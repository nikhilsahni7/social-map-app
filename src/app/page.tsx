"use client";

import dynamic from 'next/dynamic';
import React, { useState, useCallback, useEffect, ChangeEvent } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  OverlayView,
} from "@react-google-maps/api";
import { motion, AnimatePresence } from "framer-motion";
import { FaHandsHelping, FaUserCircle } from "react-icons/fa";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Filter, LogOut, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Home, LogIn, UserPlus, Info, Mail, HelpCircle } from "lucide-react";
import { Search, X, Menu, Plus, ZoomIn, ZoomOut, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import CountUp from "react-countup";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

import { ScrollArea } from "@/components/ui/scroll-area";
import { getAuthToken, getAuthUser, logout } from "@/lib/clientAuth";
import { Label } from "recharts";

// Map styles
const mapStyles = [
  {
    featureType: "all",
    elementType: "labels",
    stylers: [{ visibility: "on" }, { saturation: -20 }, { lightness: -10 }],
  },
];

interface PageProps {
  params?: { [key: string]: string | string[] };
  searchParams?: { [key: string]: string | string[] };
}
/// Typess
interface Project {
  _id: string;
  firstName: string;
  lastName: string;
  title: string;
  objective: string;
  description: string;
  category: string;
  location: {
    coordinates: [number, number];
    address: string;
  };
  pictureOfSuccess: {
    url: string;
  };
  creator: {
    _id: string;
  };
}

const tags = ["Mumbai", "Delhi", "Bangalore", "Kolkata"];
const organizationTypes = [
  { label: "👨 Human", value: "👨 Human" },
  { label: "🐕 Animal", value: "🐕 Animal" },
  { label: "🌳 Plant", value: "🌳 Plant" },
];

const getCategoryEmoji = (category: string) => {
  switch (category.toLowerCase()) {
    case "human":
      return "👨";
    case "animal":
      return "🐕";
    case "plant":
      return "🌳";
    default:
      return "�";
  }
};

interface CityStats {
  city: string;
  human: number;
  animal: number;
  plant: number;
}

const cityStats: CityStats[] = [
  { city: "Mumbai", human: 15, animal: 8, plant: 12 },
  { city: "Delhi", human: 20, animal: 10, plant: 15 },
  { city: "Bangalore", human: 18, animal: 12, plant: 20 },
  { city: "Kolkata", human: 12, animal: 6, plant: 8 },
  { city: "Chennai", human: 10, animal: 8, plant: 10 },
  { city: "Hyderabad", human: 14, animal: 9, plant: 11 },
  { city: "Pune", human: 8, animal: 5, plant: 7 },
  { city: "Ahmedabad", human: 9, animal: 7, plant: 9 },
  // Add more cities as needed
];

const calculateCityStats = (projects: Project[]): CityStats[] => {
  // Create a map to store counts for each city
  const cityStatsMap = new Map<string, { human: number; animal: number; plant: number }>();

  // Process each project
  projects.forEach(project => {
    // Extract city from address (assuming format includes city name)
    const cityMatch = project.location.address.match(/(?:,\s*)?([^,]+?)(?:,|$)/);
    const city = cityMatch ? cityMatch[1].trim() : 'Other';

    // Initialize city stats if not exists
    if (!cityStatsMap.has(city)) {
      cityStatsMap.set(city, { human: 0, animal: 0, plant: 0 });
    }

    // Increment appropriate category counter
    const stats = cityStatsMap.get(city)!;
    switch (project.category) {
      case "👨 Human":
        stats.human++;
        break;
      case "🐕 Animal":
        stats.animal++;
        break;
      case "🌳 Plant":
        stats.plant++;
        break;
    }
  });

  // Convert map to array of CityStats
  return Array.from(cityStatsMap.entries()).map(([city, stats]) => ({
    city,
    ...stats
  }));
};

// Dynamically import GoogleMap component with no SSR
const GoogleMapComponent = dynamic(
  () => import('@react-google-maps/api').then(mod => mod.GoogleMap),
  { ssr: false }
);

export default function SocialConnectMap({ params, searchParams }: PageProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [isProjectPanelOpen, setIsProjectPanelOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [location, setLocation] = useState("");
  const [token, setToken] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const [cityStats, setCityStats] = useState<CityStats[]>([]);

  const handleFilterApply = () => {
    const value = location;
    setSearchQuery(value);

    const filtered = projects.filter((project) =>
      project.location?.address?.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredProjects(filtered);

    const suggestions = filtered.map((project) => project.title);
    setFilteredSuggestions(suggestions);
    setIsOpen(false);
  };

  const handleClearFilter = () => {
    fetchProjects();
    setIsOpen(false);
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  });

  useEffect(() => {
    setToken(getAuthToken());
    setUser(getAuthUser());
  }, []);

  const handleLogout = () => {
    logout();
    setToken(null);
    setUser(null);
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const loadGoogleApi = () => {
      if (window.google) {
        // Your logic using the google object
      } else {
        console.error("Google API not loaded");
      }
    };

    window.addEventListener("load", loadGoogleApi);
    return () => window.removeEventListener("load", loadGoogleApi);
  }, []);

  // Fetch projects from backend (unchanged)
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects");
        const data = await response.json();
        if (data.projects) {
          // Validate coordinates before setting state
          const validProjects = data.projects.filter(
            (project: Project) =>
              project.location?.coordinates?.[0] &&
              project.location?.coordinates?.[1] &&
              !isNaN(project.location.coordinates[0]) &&
              !isNaN(project.location.coordinates[1])
          );
          setProjects(validProjects);
          setFilteredProjects(validProjects);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects");
      const data = await response.json();
      if (data.projects) {
        // Validate coordinates before setting state
        const validProjects = data.projects.filter(
          (project: Project) =>
            project.location?.coordinates?.[0] &&
            project.location?.coordinates?.[1] &&
            !isNaN(project.location.coordinates[0]) &&
            !isNaN(project.location.coordinates[1])
        );
        setProjects(validProjects);
        setFilteredProjects(validProjects);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const onLoad = useCallback(
    (map: google.maps.Map) => {
      if (projects.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        projects.forEach((project) => {
          if (project.location?.coordinates) {
            bounds.extend({
              lat: project.location.coordinates[1],
              lng: project.location.coordinates[0],
            });
          }
        });
        map.fitBounds(bounds);
      } else {
        map.setCenter({ lat: 23.5937, lng: 78.9629 });
        map.setZoom(6);
      }
      setMap(map);
    },
    [projects]
  );

  const mapOptions = {
    mapTypeId: "roadmap",
    disableDefaultUI: true,
    zoomControl: false,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: false,
    styles: mapStyles,
  };

  // Handle search
  const handleSearch = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setSearchQuery(value);

    const filtered = projects.filter(
      (project) =>
        project.title.toLowerCase().includes(value.toLowerCase()) ||
        project.category.toLowerCase().includes(value.toLowerCase()) ||
        project.description?.toLowerCase().includes(value.toLowerCase()) ||
        project.location?.address?.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredProjects(filtered);

    const suggestions = filtered.map((project) => project.title);
    setFilteredSuggestions(suggestions);
  };
  const handleFilterOrgType = useCallback(
    (type: string | null) => {
      if (!type) {
        setFilteredProjects(projects);
        return;
      }

      const filtered = projects.filter((project) => project.category === type);

      setFilteredProjects(filtered);
    },
    [projects]
  );

  useEffect(() => {
    if (selectedType) {
      handleFilterOrgType(selectedType);
    } else {
      setFilteredProjects(projects);
    }
  }, [selectedType, projects, handleFilterOrgType]);

  const handleSelectSuggestion = (value: string) => {
    setSearchQuery(value);
    const filtered = projects.filter(
      (project) =>
        project.title.toLowerCase().includes(value.toLowerCase()) ||
        project.location?.address?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredProjects(filtered);
  };

  const truncateText = (text: string, wordLimit: number): string => {
    const words = text.split(" ");
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + " ...";
    }
    return text;
  };

  // Mobile detection (unchanged)
  useEffect(() => {
    const handleResize = () => {
      setIsMobileDevice(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMarkerClick = (project: Project) => {
    setSelectedProject(project);
    setIsProjectPanelOpen(true);
    setIsSearchOpen(false);
    setIsMenuOpen(false);
    if (map) {
      map.panTo({
        lat: project.location.coordinates[1],
        lng: project.location.coordinates[0],
      });
    }
  };

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // Adjust this breakpoint as needed
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Map controls (unchanged)
  const handleZoomIn = () => {
    if (map) map.setZoom(map.getZoom()! + 1);
  };

  const handleZoomOut = () => {
    if (map) map.setZoom(map.getZoom()! - 1);
  };

  const handleResetView = () => {
    if (map && projects.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      projects.forEach((project) =>
        bounds.extend({
          lat: project.location.coordinates[1],
          lng: project.location.coordinates[0],
        })
      );
      map.fitBounds(bounds);
    }
  };

  useEffect(() => {
    setCityStats(calculateCityStats(projects));
  }, [projects]);

  if (loadError) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black">
        <p className="text-xl text-white font-medium">
          Error loading map: Looks like a Network Issue
        </p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-black">
        <div className="text-center space-y-4">
          <Loader2 className="w-16 h-16 text-white animate-spin mx-auto" />
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Loading...
          </h2>
          <p className="text-lg text-blue-300">
            Make an impact by doing your bit
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full relative bg-gray-900">
      <div className="absolute top-0 z-30 left-0 w-full h-[20%] bg-gradient-to-b from-black/80 to-transparent pointer-events-none"></div>
      <div className="absolute bottom-0 z-10 left-0 w-full h-[20%] bg-gradient-to-b from-transparent to-black/70 pointer-events-none"></div>
      {isClient && (
        <GoogleMapComponent
          mapContainerStyle={{ width: "100%", height: "100%" }}
          zoom={10}
          onLoad={onLoad}
          options={mapOptions}
        >
          {filteredProjects.map((project) => (
            <React.Fragment key={project._id}>
              {project.location?.coordinates && (
                <Marker
                  position={{
                    lat: project.location.coordinates[1],
                    lng: project.location.coordinates[0],
                  }}
                  onClick={() => handleMarkerClick(project)}
                  onMouseOver={() => setHoveredProject(project)}
                  onMouseOut={() => setHoveredProject(null)}
                  icon={
                    isLoaded
                      ? {
                        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="60" viewBox="0 0 40 60">
                            <path d="M20 0 C8.954 0 0 8.954 0 20 C0 35 20 60 20 60 C20 60 40 35 40 20 C40 8.954 31.046 0 20 0 Z" fill="#3b82f6" />
                            <circle cx="20" cy="18" r="14" fill="white" />
                            <text x="20" y="20" font-family="Segoe UI Emoji, Arial, sans-serif" font-size="18" text-anchor="middle" dominant-baseline="middle">
        ${project.category === "👨 Human" ? "👨" : ""}
        ${project.category === "🌳 Plant" ? "🌳" : ""}
        ${project.category === "🐕 Animal" ? "🐕" : ""}
        
      </text>
                          </svg>
                        `)}`,
                        scaledSize: new google.maps.Size(40, 60),
                        anchor: new google.maps.Point(20, 60),
                      }
                      : undefined
                  }
                />
              )}

              {hoveredProject === project && (
                <OverlayView
                  position={{
                    lat: project.location.coordinates[1],
                    lng: project.location.coordinates[0],
                  }}
                  mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                >
                  <Card className="relative w-48 bg-white border-[3px] border-blue-600 border-opacity-50 backdrop-blur-sm hover:scale-105 transition-transform duration-300 ease-in-out rounded-md">
                    <CardHeader className="p-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm text-black font-semibold line-clamp-2">
                          {project.title}
                        </CardTitle>
                        <Badge
                          variant="outline"
                          className="text-sm p-1 bg-blue-100 text-blue-600 rounded-md"
                        >
                          {project.category === "👨 Human" && "👨"}
                          {project.category === "🌳 Plant" && "🌳"}
                          {project.category === "🐕 Animal" && "🐕"}
                        </Badge>

                      </div>
                      <CardDescription className="text-blue-500 text-xs font-medium line-clamp-1">
                        {project.category}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-3">
                      <p className="text-gray-700 text-xs mb-1 line-clamp-2">
                        {project.description}
                      </p>
                      <p className="text-gray-500 text-xs italic line-clamp-2">
                        {project.location.address}
                      </p>
                    </CardContent>
                  </Card>
                </OverlayView>
              )}
            </React.Fragment>
          ))}
        </GoogleMapComponent>
      )}

      {/* Category Filters */}
      <div className="absolute top-16 left-0 right-0 z-10 w-full px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
          {/* Organization Types Buttons */}
          <div className="flex-grow flex items-center justify-center py-4">
            <div className="inline-flex items-center justify-center gap-3 bg-white rounded-full px-4 py-3 border-2 border-opacity-70 border-blue-800 shadow-[0_8px_20px_rgba(0,0,0,0.25),0_4px_12px_rgba(0,0,0,0.2)]">
              {organizationTypes.map((type) => (
                <Button
                  key={type.value}
                  variant={selectedType === type.value ? "default" : "ghost"}
                  size="sm"
                  className={`rounded-full transition-transform duration-300 font-medium${selectedType === type.value
                    ? "bg-blue-600 text-white shadow-md hover:bg-blue-700 scale-105"
                    : "text-blue-600 border border-blue-600 hover:bg-blue-100 hover:scale-105"
                    } px-3 py-2`}
                  onClick={() => {
                    setSelectedType(
                      selectedType === type.value ? null : type.value
                    );
                    if (selectedType) handleFilterOrgType(selectedType);

                    console.log(selectedType);
                  }}
                >
                  {type.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Total Projects Section */}
          <div className="sm:ml-4 mb-2">
            <div
              className="text-sm font-semibold text-white bg-blue-600 px-4 py-2 rounded-full"
              style={{ boxShadow: "0px 10px 15px rgba(0, 0, 0, 0.1)" }}
            >
              Total Projects:{" "}
              <CountUp
                start={0}
                end={filteredProjects.length}
                duration={2}
                separator=","
                enableScrollSpy={true}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Map Controls */}
      {!isMobileDevice && (
        <div className="absolute bottom-8 right-6 z-10 flex space-x-3 justify-end">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-white hover:bg-gray-100"
                  onClick={handleZoomIn}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Zoom In</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-white hover:bg-gray-100"
                  onClick={handleZoomOut}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Zoom Out</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-white hover:bg-gray-100"
                  onClick={handleResetView}
                >
                  <Compass className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Reset View</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}

      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 bg-white hover:bg-gray-100 p-4 rounded-full shadow-lg z-30"
        onClick={() => {
          setIsMenuOpen(!isMenuOpen);
          setIsSearchOpen(false);
          setIsProjectPanelOpen(false);
        }}
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Search and Menu Controls */}
      {isMobile ? (
        <div className="">
          {/* Centered Search Modal */}
          {isSearchOpen && (
            <div>
              {/* Button to open search modal */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="btn btn-primary"
              >
                Open Search
              </button>
            </div>
          )}

          {/* Button Section (Mobile) */}
          <div className="flex flex-col items-center fixed bottom-4 left-4 right-4 z-10 space-y-3 mb-2">
            {/* Create Project Button */}
            <Link href="/create-project">
              <Button className="relative py-7 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-[0_0.25rem_0_rgb(30,64,175),0_0.75rem_0.5rem_rgba(30,64,175,0.5)] transition-all duration-300 transform hover:-translate-y-1 active:translate-y-[0.2rem] active:shadow-[0_0.1rem_0.3rem_rgba(30,64,175,0.5)] flex items-center">
                <Plus className="h-6 w-7 mr-2" />
                Create Project
              </Button>
            </Link>

            {/* Search Button */}
            <Button
              className="relative py-7 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-[0_0.25rem_0_rgb(30,64,175),0_0.75rem_0.5rem_rgba(30,64,175,0.5)] transition-all duration-300 transform hover:-translate-y-1 active:translate-y-[0.2rem] active:shadow-[0_0.1rem_0.3rem_rgba(30,64,175,0.5)] flex items-center"
              onClick={() => {
                setIsSearchOpen(!isSearchOpen);
                setIsProjectPanelOpen(false);
                setIsMenuOpen(false);
              }}
            >
              <Search className="h-6 w-7 mr-2" />
              Search Projects
            </Button>
          </div>
        </div>
      ) : (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex space-x-4">
            {/* Create Project Button */}
            <Link href="/create-project">
              <Button className="py-7 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-[0_0.25rem_0_rgb(30,64,175),0_0.75rem_0.5rem_rgba(30,64,175,0.5)] transition-all duration-300 transform hover:-translate-y-1 active:translate-y-[0.2rem] active:shadow-[0_0.1rem_0.3rem_rgba(30,64,175,0.5)] flex items-center">
                <Plus className="h-6 w-6 mr-2 relative z-10" />
                <span className="relative z-10">Create Project</span>
              </Button>
            </Link>

            {/* Search Button */}
            <Button
              className="relative py-7 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-[0_0.25rem_0_rgb(30,64,175),0_0.75rem_0.5rem_rgba(30,64,175,0.5)] transition-all duration-300 transform hover:-translate-y-1 active:translate-y-[0.2rem] active:shadow-[0_0.1rem_0.3rem_rgba(30,64,175,0.5)] flex items-center"
              onClick={() => {
                setIsSearchOpen(!isSearchOpen);
                setIsProjectPanelOpen(false);
                setIsMenuOpen(false);
              }}
            >
              <Search className="mr-2 h-6 w-6" />
              Search Projects
            </Button>
          </div>

          {/* Search Menu */}
        </div>
      )}

      {/* Side Menu*/}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: 300 }}
            animate={{ x: 0 }}
            exit={{ x: 300 }}
            className="fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 overflow-y-auto"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-6 bg-blue-600 text-white">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Menu</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-white hover:bg-blue-700 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </Button>
                </div>
                {token && user ? (
                  <div className="bg-gray-50 p-4 rounded-lg mb-2">
                    <p className="text-lg font-semibold text-gray-800">
                      {user.name}
                    </p>
                    <p className="text-sm text-gray-600 mb-3">{user.email}</p>
                    <ul className="space-y-2">
                      <li>
                        <Button
                          variant="outline"
                          onClick={() => {
                            router.push(`/creator-profile/${user.id}`);
                          }}
                          className="w-full justify-start text-white font-semibold bg-blue-600 hover:text-white hover:bg-blue-700"
                        >
                          <FaUserCircle className="mr-3 h-5 w-5" />
                          View Profile
                        </Button>
                      </li>
                      <li>
                        <Button
                          variant="outline"
                          onClick={handleLogout}
                          className="w-full justify-start text-white font-semibold bg-red-600 hover:text-white hover:bg-red-700"
                        >
                          <LogOut className="mr-3 h-5 w-5" />
                          Logout
                        </Button>
                      </li>
                    </ul>
                  </div>
                ) : (
                  <>
                    <div>
                      <h3 className="font-semibold text-lg">Did My Bit</h3>
                      <p className="text-sm text-blue-100">
                        Make an impact, one bit at a time
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Menu Items */}
              <nav className="flex-grow p-6 space-y-2">
                <div>
                  {token && user ? (
                    <></>
                  ) : (
                    <ul className="space-y-3">
                      <li>
                        <Link href="/login">
                          <Button
                            variant="outline"
                            className="w-full justify-start text-white font-semibold bg-blue-600 hover:text-white hover:bg-blue-700"
                          >
                            <LogIn className="mr-3 h-5 w-5" />
                            Login
                          </Button>
                        </Link>
                      </li>
                      <li>
                        <Link href="/signup">
                          <Button
                            variant="outline"
                            className="w-full justify-start text-white font-semibold bg-blue-600 hover:text-white hover:bg-blue-700"
                          >
                            <UserPlus className="mr-3 h-5 w-5" />
                            Sign Up
                          </Button>
                        </Link>
                      </li>
                    </ul>
                  )}
                </div>

                {/* About Us */}
                <div className="">
                  <h4 className="text-sm font-semibold text-gray-500 mb-2">
                    ABOUT US
                  </h4>
                  <ul className="space-y-4">
                    <li>
                      <Link href="/about">
                        <Button
                          variant="outline"
                          className="w-full justify-start text-white font-semibold bg-blue-600 hover:text-white hover:bg-blue-700 rounded-lg transition-all duration-200"
                        >
                          <Info className="mr-3 h-5 w-5" />
                          About Us
                        </Button>
                      </Link>
                    </li>
                    <li>
                      <Link href="/contact">
                        <Button
                          variant="outline"
                          className="w-full justify-start text-white font-semibold bg-blue-600 hover:text-white hover:bg-blue-700 rounded-lg transition-all duration-200"
                        >
                          <Mail className="mr-3 h-5 w-5" />
                          Contact Us
                        </Button>
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Support */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 mb-2">
                    SUPPORT
                  </h4>
                  <ul className="space-y-4">
                    <li>
                      <Link href="/faq">
                        <Button
                          variant="outline"
                          className="w-full justify-start text-white font-semibold bg-blue-600 hover:text-white hover:bg-blue-700 rounded-lg transition-all duration-200"
                        >
                          <HelpCircle className="mr-3 h-5 w-5" />
                          Help & FAQ
                        </Button>
                      </Link>
                    </li>
                  </ul>
                </div>
              </nav>

              {/* Footer */}
              <div className="p-6 bg-gray-50">
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    © 2024 Did My Bit. All rights reserved.
                  </p>
                  <p className="text-xs text-blue-600 font-medium mt-2">
                    Making the world better, one bit at a time
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isMobile && (
        <div>
          {/* Project Details Panel */}
          <AnimatePresence>
            {isProjectPanelOpen && selectedProject && (
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed top-36 right-4 bg-white shadow-lg z-20 rounded-3xl overflow-hidden"
                style={{
                  width: "300px",
                }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute scale-75 right-2 bg-white rounded-full hover:bg-white mr-1 focus:ring-0 focus:outline-none z-10"
                  onClick={() => {
                    fetchProjects();
                    setIsProjectPanelOpen(false);
                  }}
                >
                  <X className="h-10 w-10 scale-110" />
                </Button>

                <div className="flex flex-col p-4">

                  <div className="relative w-full h-28 mb-3">

                    <Image
                      src={selectedProject?.pictureOfSuccess?.url}
                      alt=""
                      fill
                      style={{ objectFit: "cover" }}
                      className="rounded-2xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-lg font-bold line-clamp-2">
                      {selectedProject.title}
                    </h2>


                    <div>
                      <p className="text-xs font-medium text-gray-600">Creator</p>
                      <p className="text-sm truncate">{selectedProject.firstName} {selectedProject.lastName}</p>
                    </div>


                    <div>
                      <p className="text-xs font-medium text-gray-600">Objective</p>
                      <p className="text-sm truncate">{selectedProject.objective}</p>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-gray-600">Location</p>
                      <p className="text-sm line-clamp-2">{selectedProject.location.address}</p>
                    </div>

                    <div className="flex space-x-2 pt-1">
                      <Link href={`/creator-profile/${selectedProject.creator._id}`} className="flex-1">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2">
                          <FaUserCircle className="mr-2 h-4 w-4" />
                          View Profile
                        </Button>
                      </Link>
                      <Link href={`/project-profile/${selectedProject._id}`} className="flex-1">
                        <Button className="w-full bg-green-600 hover:bg-green-700 text-white text-sm py-2">
                          <FaHandsHelping className="mr-2 h-4 w-4" />
                          Support
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/*Search Menu*/}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed top-36 right-4 bg-white shadow-lg z-20 rounded-3xl overflow-hidden"
                style={{
                  maxWidth: "600px",
                  width: "33%",
                  height: "calc(100% - 15rem)",
                  scrollbarWidth: "thin",
                }}
              >
                {/* Header Section */}
                <div className="bg-blue-500 text-white flex items-center justify-between px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <h2 className="text-lg font-semibold">Find all Projects</h2>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-gray-200 hover:bg-transparent mr-1 focus:ring-0 focus:outline-none"
                    onClick={() => setIsSearchOpen(false)}
                  >
                    <X className="h-6 w-6" />
                  </Button>
                </div>

                {/* Content Section */}
                <div className="p-6 h-full w-full overflow-y-auto">
                  <div className="relative">
                    {/* Search Input */}
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search by Name or Location..."
                      value={searchQuery}
                      onChange={handleSearch}
                      className="w-full pl-12 pr-4 py-3 text-md border border-gray-300 rounded-3xl placeholder:text-sm"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 -mt-1 right-2 hover:bg-transparent focus:ring-0 focus:outline-none"
                      onClick={() => {
                        setSearchQuery("");
                        fetchProjects();
                      }}
                    >
                      <X className="h-6 w-6" />
                    </Button>
                  </div>

                  {/* Search Results */}
                  <ScrollArea className="mt-6 px-2">
                    {filteredProjects.length === 0 ? (
                      <p className="text-center text-gray-500 py-4">
                        No results found.
                      </p>
                    ) : (
                      <ul className="space-y-3">
                        {filteredProjects.map((project) => (
                          <li key={project._id}>
                            <Button
                              variant="ghost"
                              className="w-full h-16 justify-start text-left hover:bg-blue-50 rounded-lg p-3"
                              onClick={() => {
                                handleSelectSuggestion(project.title);
                                handleMarkerClick(project);
                              }}
                            >
                              <div>
                                <p className="font-medium text-blue-600">
                                  {project.title}
                                </p>

                                <p className="text-sm text-gray-500">
                                  {project.category}
                                </p>
                                <p className="text-sm text-black truncate">
                                  {truncateText(project.location.address, 7)}
                                </p>
                              </div>
                            </Button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </ScrollArea>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Left Sidebar */}
          <div
            className="absolute top-20 left-4 bottom-24 w-72 bg-white shadow-lg rounded-2xl z-10 overflow-hidden"
            style={{ height: "80%" }}
          >
            {/* Header */}
            <div className="flex flex-row p-4 items-center bg-blue-600 text-white rounded-t-2xl">
              <h2 className="text-xl font-bold flex-grow">Projects of your City</h2>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-4 gap-2 px-4 py-3 bg-gray-100 border-b font-semibold text-sm">
              <div>City</div>
              <div className="text-center">👨</div>
              <div className="text-center">🐕</div>
              <div className="text-center">🌳</div>
            </div>

            {/* Scrolling Content */}
            <div className="overflow-hidden" style={{ height: "calc(100% - 8rem)" }}>
              <div
                className="animate-scroll"
                style={{
                  paddingBottom: "2rem",
                  display: "flex",
                  flexDirection: "column"
                }}
              >
                {[...cityStats, ...cityStats].map((stat, index) => (
                  <div
                    key={`${stat.city}-${index}`}
                    className="grid grid-cols-4 gap-2 px-4 py-3 border-b hover:bg-blue-50 transition-colors"
                  >
                    <div className="text-sm font-medium">{stat.city}</div>
                    <div className="text-center text-sm">{stat.human}</div>
                    <div className="text-center text-sm">{stat.animal}</div>
                    <div className="text-center text-sm">{stat.plant}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="fixed bottom-8 right-44 flex space-x-3 justify-end rounded-full z-10">
            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <Button className="relative py-2 px-4 justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-[0_0.25rem_0_rgb(30,64,175),0_0.75rem_0.5rem_rgba(30,64,175,0.5)] transition-all duration-300 transform hover:-translate-y-1 active:translate-y-[0.2rem] active:shadow-[0_0.1rem_0.3rem_rgba(30,64,175,0.5)] flex items-center">
                  <Filter className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <div className="flex flex-row items-center">
                    <h4 className="font-medium text-lg">Filter by Location</h4>

                    <button
                      className="ml-auto"
                      onClick={() => {
                        setIsOpen(false);
                      }}
                    >
                      <X className="h-4 w-4 ml-auto" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    <Label>Enter Location</Label>
                    <Input
                      id="location"
                      placeholder="e.g. New York, London"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-between">
                    <Button
                      onClick={handleClearFilter}
                      variant="outline"
                      className="flex items-center"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Clear
                    </Button>
                    <Button
                      onClick={handleFilterApply}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Apply Filter
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}

      {isMobile && (
        <div>
          <div
            className="fixed bottom-8 right-4 md:right-44 flex space-x-3 justify-end rounded-full z-10"
          >
            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <Button className="relative py-2 px-4 justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-[0_0.25rem_0_rgb(30,64,175),0_0.75rem_0.5rem_rgba(30,64,175,0.5)] transition-all duration-300 transform hover:-translate-y-1 active:translate-y-[0.2rem] active:shadow-[0_0.1rem_0.3rem_rgba(30,64,175,0.5)] flex items-center">
                  <Filter className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <div className="flex flex-row items-center">
                    <h4 className="font-medium text-lg">Filter by Location</h4>

                    <button
                      className="ml-auto"
                      onClick={() => {
                        setIsOpen(false);
                      }}
                    >
                      <X className="h-4 w-4 ml-auto" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    <Label>Enter Location</Label>
                    <Input
                      id="location"
                      placeholder="e.g. New York, London"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-between">
                    <Button
                      onClick={handleClearFilter}
                      variant="outline"
                      className="flex items-center"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Clear
                    </Button>
                    <Button
                      onClick={handleFilterApply}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Apply Filter
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Project Details Panel for mobile */}
          <AnimatePresence>
            {isProjectPanelOpen && selectedProject && (
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed bottom-0 left-0 right-0 bg-white shadow-lg z-20 rounded-t-3xl overflow-hidden"
                style={{
                  height: "calc(100% - 65vh)",
                  minHeight: "280px",
                }}
              >
                {/* Drag Handle */}
                <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-3" />

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 hover:bg-transparent focus:ring-0 focus:outline-none"
                  onClick={() => {
                    fetchProjects();
                    setIsProjectPanelOpen(false);
                  }}
                >
                  <X className="h-5 w-5 text-gray-500" />
                </Button>

                <div className="px-4 pt-2">
                  {/* Image and Title Section */}
                  <div className="flex items-start space-x-3">
                    {selectedProject.pictureOfSuccess?.url && (
                      <div className="relative w-20 h-20 flex-shrink-0">
                        <Image
                          src={selectedProject.pictureOfSuccess.url}
                          alt=""
                          fill
                          className="rounded-lg object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 mt-4">
                      <h2 className="text-base font-bold mb-1 line-clamp-2">
                        {selectedProject.title}
                      </h2>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {selectedProject.description}
                      </p>
                    </div>
                  </div>

                  {/* Objective Section */}

                  <div className="mt-4 ml-2">
                    <p className="text-xs font-semibold text-blue-600 mb-1">Objective</p>
                    <p className="text-sm font-medium text-gray-900 line-clamp-2">
                      {selectedProject.objective || selectedProject.description}
                    </p>
                  </div>


                  {/* Info Grid */}
                  <div className="mt-1 grid grid-cols-2 gap-2">
                    <div className="bg-gray-50 rounded-lg p-2.5">
                      <p className="text-xs font-semibold text-blue-600">Creator</p>
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {selectedProject.firstName} {selectedProject.lastName}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2.5">
                      <p className="text-xs font-semibold text-blue-600">Location</p>
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {selectedProject.location.address}
                      </p>
                    </div>
                  </div>



                  {/* Action Buttons */}
                  <div className="flex space-x-2 mt-2">
                    <Link
                      href={`/creator-profile/${selectedProject.creator._id}`}
                      className="flex-1"
                    >
                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm h-10"
                      >
                        <FaUserCircle className="mr-2 h-4 w-4" />
                        View Profile
                      </Button>
                    </Link>
                    <Link
                      href={`/project-profile/${selectedProject._id}`}
                      className="flex-1"
                    >
                      <Button
                        className="w-full bg-green-600 hover:bg-green-700 text-white text-sm h-10"
                      >
                        <FaHandsHelping className="mr-2 h-4 w-4" />
                        Support
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {/*Search Menu*/}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed inset-x-0 bottom-0 bg-white shadow-lg z-20 rounded-t-3xl overflow-hidden"
                style={{
                  height: "calc(100% - 60vh)",
                  minHeight: "300px",
                  maxHeight: "90vh",
                }}
              >
                {/* Header Section */}
                <div className="bg-blue-500 text-white flex items-center justify-between px-4 py-3">
                  <h2 className="text-lg font-semibold">Find all Projects</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-transparent focus:ring-0 focus:outline-none"
                    onClick={() => setIsSearchOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Content Section */}
                <div className="p-4 h-full overflow-y-auto z-30">
                  <div className="relative mb-4">
                    {/* Search Input */}
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Search by Name or Location"
                      value={searchQuery}
                      onChange={handleSearch}
                      className="w-full pl-10 pr-10 py-2 text-sm border border-gray-300 rounded-full"
                    />
                    {searchQuery && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-1/2 right-2 transform -translate-y-1/2 hover:bg-transparent focus:ring-0 focus:outline-none"
                        onClick={() => {
                          handleSearch({
                            target: { value: "" },
                          } as React.ChangeEvent<HTMLInputElement>);
                          fetchProjects();
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {/* Search Results */}
                  <ScrollArea className="h-[calc(100%-3rem)]">
                    {filteredProjects.length === 0 ? (
                      <p className="text-center text-gray-500 py-4">
                        No results found.
                      </p>
                    ) : (
                      <ul className="space-y-2">
                        {filteredProjects.map((project) => (
                          <li key={project._id}>
                            <Button
                              variant="ghost"
                              className="w-full justify-start text-left hover:bg-blue-50 rounded-lg p-2"
                              onClick={() => {
                                handleSelectSuggestion(project.title);
                                handleMarkerClick(project);
                              }}
                            >
                              <div>
                                <p className="font-medium text-blue-600 text-sm">
                                  {project.title}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {project.category}
                                </p>
                                <p className="text-xs text-black truncate">
                                  {truncateText(project.location.address, 5)}
                                </p>
                              </div>
                            </Button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </ScrollArea>
                </div>
              </motion.div>
            )}
          </AnimatePresence>


        </div>
      )}
    </div>
  );
}
