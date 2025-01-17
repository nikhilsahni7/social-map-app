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
  const [liked, setLiked] = useState(false);
  const [likedProjects, setLikedProjects] = useState<Set<string>>(new Set());
  const [projectLikeCounts, setProjectLikeCounts] = useState<{ [key: string]: number }>({});

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

  const toggleLike = async (projectId: string) => {
    try {
      const isCurrentlyLiked = likedProjects.has(projectId);
      const response = await fetch(`/api/projects/${projectId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ like: !isCurrentlyLiked }),
      });

      if (response.ok) {
        const data = await response.json();
        setLikedProjects((prev) => {
          const updated = new Set(prev);
          if (data.liked) {
            updated.add(projectId);
          } else {
            updated.delete(projectId);
          }
          return updated;
        });
        setProjectLikeCounts((prev) => ({
          ...prev,
          [projectId]: data.likeCount,
        }));
      } else {
        console.error('Failed to toggle like');
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  useEffect(() => {
    const fetchLikeStates = async () => {
      if (!token) return;

      try {
        const response = await fetch('/api/projects/likes', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setLikedProjects(new Set(data.likedProjectIds));
          setProjectLikeCounts(data.likeCounts);
        }
      } catch (error) {
        console.error('Error fetching like states:', error);
      }
    };

    fetchLikeStates();
  }, [token]);

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
      <div className="h-screen w-full flex flex-col items-center justify-center bg-white">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-[#7E57C2] animate-spin mx-auto" />
          <p className="text-lg text-black font-semibold">
            Make an impact by doing your bit
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full relative bg-gray-900">
      <div className="absolute top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            {/* Logo and Slogan Section */}
            <div className="flex items-center gap-4">
              <Image
                src="/logo.png"
                alt="logo"
                width={65}
                height={80}
                className="object-contain"
              />
              <div className="hidden md:block">
                <p className="text-blue-600 font-semibold text-lg">DidMyBit</p>
                <p className="text-gray-600 text-sm">Make an impact, one bit at a time</p>
              </div>
              <div className="hidden md:block ml-16">
                <p className="text-blue-600 font-semibold text-lg">Find Someone to Support you Bit!</p>
                <p className="text-gray-600 text-sm">Find any social project one the map</p>
              </div>
            </div>



            {/* Auth Buttons and Menu */}
            <div className="flex items-center gap-3">

              {token && user ? (
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              ) : (
                <>
                  <Link href="/login">
                    <Button
                      variant="ghost"
                      className="hidden md:flex items-center text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <LogIn className="h-4 w-4 mr-2" />
                      Login
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button
                      className="bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
              {/* Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="bg-white hover:bg-gray-100 p-2 rounded-full shadow-sm hover:shadow-md transition-all duration-300"
                onClick={() => {
                  setIsMenuOpen(!isMenuOpen);
                  setIsSearchOpen(false);
                  setIsProjectPanelOpen(false);
                }}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

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
                            <path d="M20 0 C8.954 0 0 8.954 0 20 C0 35 20 60 20 60 C20 60 40 35 40 20 C40 8.954 31.046 0 20 0 Z" fill="#7E57C2" />
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
                  <Card
                    className="relative w-52 bg-white/95 backdrop-blur-md group hover:scale-105 transition-all duration-300 ease-in-out rounded-xl shadow-lg border border-blue-100 hover:shadow-xl hover:border-blue-200"
                    onMouseEnter={() => setHoveredProject(project)}
                    onMouseLeave={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const isInCard = e.clientX >= rect.left &&
                        e.clientX <= rect.right &&
                        e.clientY >= rect.top &&
                        e.clientY <= rect.bottom;
                      if (!isInCard) {
                        setHoveredProject(null);
                      }
                    }}
                  >
                    <CardHeader className="p-3 pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <CardTitle className="text-sm font-bold text-gray-800 line-clamp-2 leading-tight mb-1">
                            {project.title}
                          </CardTitle>
                          <div className="flex items-center gap-1.5">
                            <Badge
                              variant="outline"
                              className="px-2 py-0.5 bg-blue-50 border-blue-200 text-blue-600 rounded-full text-[10px] font-medium"
                            >
                              {project.category === "👨 Human" && "👨 Human"}
                              {project.category === "🌳 Plant" && "🌳 Plant"}
                              {project.category === "🐕 Animal" && "🐕 Animal"}
                            </Badge>
                          </div>
                        </div>
                        <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center">
                          <span className="text-lg">
                            {project.category === "👨 Human" && "👨"}
                            {project.category === "🌳 Plant" && "🌳"}
                            {project.category === "🐕 Animal" && "🐕"}
                          </span>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="p-3 pt-1">
                      <div className="space-y-2">
                        <div>
                          <p className="text-[11px] font-medium text-gray-500 mb-0.5">
                            Description
                          </p>
                          <p className="text-xs text-gray-700 line-clamp-2 leading-snug">
                            {project.description}
                          </p>
                        </div>

                        <div>
                          <p className="text-[11px] font-medium text-gray-500 mb-0.5 flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                              <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
                            </svg>
                            Location
                          </p>
                          <p className="text-xs text-gray-600 line-clamp-2 leading-snug">
                            {project.location.address}
                          </p>
                        </div>
                      </div>

                      <div className="absolute bottom-2 right-2 opacity-100 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          className={`relative text-gray-600 hover:text-red-600 transition-colors duration-200`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLike(project._id);
                          }}
                        >
                          <AnimatePresence>
                            {likedProjects.has(project._id) && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                className="absolute inset-0 text-red-600"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  className="w-4 h-4"
                                >
                                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                </svg>
                              </motion.div>
                            )}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill={likedProjects.has(project._id) ? "red" : "none"}
                              stroke="currentColor"
                              className="w-4 h-4"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                              />
                            </svg>
                          </AnimatePresence>
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                </OverlayView>
              )}
            </React.Fragment>
          ))}
        </GoogleMapComponent>
      )}

      {/* Category Filters */}
      <div className="absolute top-20 left-0 right-0 z-10 w-full px-4">
        <div className="max-w-7xl mx-auto">
          {/* Main Container with Responsive Layout */}
          <div className="flex flex-col md:relative md:flex-row md:justify-center space-y-1 md:space-y-0">
            {/* Organization Types Buttons */}
            <div className="flex justify-center py-2 md:py-4">
              <div className="inline-flex items-center justify-center gap-5 bg-blue-100 rounded-full px-4 py-3 border-2 border-opacity-70 border-blue-800 shadow-[0_8px_20px_rgba(0,0,0,0.25),0_4px_12px_rgba(0,0,0,0.2)]">
                {organizationTypes.map((type) => (
                  <Button
                    key={type.value}
                    variant={selectedType === type.value ? "default" : "ghost"}
                    size="sm"
                    className={`rounded-full scale-110 bg-white transition-transform duration-300 font-bold text-blue-600 ${selectedType === type.value
                      ? "bg-blue-600 text-white shadow-md hover:bg-blue-700 scale-105"
                      : "text-blue-600 border border-blue-600 hover:bg-white hover:scale-105"
                      } px-3 py-2`}
                    onClick={() => {
                      setSelectedType(
                        selectedType === type.value ? null : type.value
                      );
                      if (selectedType) handleFilterOrgType(selectedType);
                    }}
                  >
                    {type.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Total Projects Section */}
            <div className="flex justify-center md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2">
              <div
                className="text-sm font-semibold text-white bg-[#7E57C2] px-4 py-2 rounded-full"
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
              <Button className="relative py-7 px-6 bg-gradient-to-b from-[#7E57C2] to-[#5B4091] hover:from-[#6B4DAA] hover:to-[#5B4091] text-white rounded-full shadow-[0_0.3rem_0_rgb(126,87,194),0_1rem_0.6rem_rgba(126,87,194,0.4)] transition-all duration-300 transform hover:-translate-y-1 active:translate-y-[0.2rem] active:shadow-[0_0.1rem_0.2rem_rgba(107,77,170,0.6)] flex items-center">
                <Plus className="h-6 w-7 mr-2" />
                Create Project
              </Button>
            </Link>

            {/* Search Button */}
            <Button
              className="relative py-7 px-6 bg-gradient-to-b from-[#7E57C2] to-[#5B4091] hover:from-[#6B4DAA] hover:to-[#5B4091] text-white rounded-full shadow-[0_0.3rem_0_rgb(126,87,194),0_1rem_0.6rem_rgba(126,87,194,0.4)] transition-all duration-300 transform hover:-translate-y-1 active:translate-y-[0.2rem] active:shadow-[0_0.1rem_0.2rem_rgba(107,77,170,0.6)] flex items-center"
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
              <Button className="relative py-7 px-6 bg-gradient-to-b from-[#7E57C2] to-[#5B4091] hover:from-[#6B4DAA] hover:to-[#5B4091] text-white rounded-full shadow-[0_0.3rem_0_rgb(126,87,194),0_1rem_0.6rem_rgba(126,87,194,0.4)] transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_0.4rem_0.2rem_rgb(107,77,170),0_1rem_0.6rem_rgba(107,77,170,0.5)] active:translate-y-[0.2rem] active:shadow-[0_0.1rem_0.2rem_rgba(107,77,170,0.6)] flex items-center">
                <Plus className="h-6 w-6 mr-2 relative z-10" />
                <span className="relative z-10">Create Project</span>
              </Button>
            </Link>

            {/* Search Button */}
            <Button
              className="relative py-7 px-6 bg-gradient-to-b from-[#7E57C2] to-[#5B4091] hover:from-[#6B4DAA] hover:to-[#5B4091] text-white rounded-full shadow-[0_0.3rem_0_rgb(126,87,194),0_1rem_0.6rem_rgba(126,87,194,0.4)] transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_0.4rem_0.2rem_rgb(107,77,170),0_1rem_0.6rem_rgba(107,77,170,0.5)] active:translate-y-[0.2rem] active:shadow-[0_0.1rem_0.2rem_rgba(107,77,170,0.6)] flex items-center"
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
                          className="w-full justify-start text-white font-semibold bg-[#7E57C2] hover:text-white hover:bg-[#6B4DAA]"
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
                            className="w-full justify-start text-white font-semibold bg-[#7E57C2] hover:text-white hover:bg-[#6B4DAA]"
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
                            className="w-full justify-start text-white font-semibold bg-[#7E57C2] hover:text-white hover:bg-[#6B4DAA]"
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
                          className="w-full justify-start text-white font-semibold bg-[#7E57C2] hover:text-white hover:bg-[#6B4DAA] rounded-lg transition-all duration-200"
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
                          className="w-full justify-start text-white font-semibold bg-[#7E57C2] hover:text-white hover:bg-[#6B4DAA] rounded-lg transition-all duration-200"
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
                          className="w-full justify-start text-white font-semibold bg-[#7E57C2] hover:text-white hover:bg-[#6B4DAA] rounded-lg transition-all duration-200"
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
                className="fixed top-40 right-4 bg-white shadow-lg z-10 rounded-3xl overflow-hidden"
                style={{
                  width: "280px",
                  maxHeight: "calc(100vh - 12rem)",
                  height: "auto"
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

                <ScrollArea className="h-full">
                  <div className="flex flex-col p-5">
                    <div className="relative w-full h-24 mb-3 flex-shrink-0">
                      <Image
                        src={selectedProject?.pictureOfSuccess?.url}
                        alt=""
                        fill
                        style={{ objectFit: "cover" }}
                        className="rounded-2xl"
                      />
                    </div>

                    <div className="space-y-2 flex-grow">
                      <h2 className="text-lg font-bold line-clamp-1">
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
                        <p className="text-sm line-clamp-1">{selectedProject.location.address}</p>
                      </div>

                      <div className="flex justify-center space-x-4 pt-1 scale-90">
                        <Link href={`/creator-profile/${selectedProject.creator._id}`}>
                          <Button className="w-32 bg-[#7E57C2] hover:bg-[#6B4DAA] text-white text-sm py-2">
                            <FaUserCircle className="h-4 w-4" />
                            View Profile
                          </Button>
                        </Link>
                        <Link href={`/project-profile/${selectedProject._id}`}>
                          <Button className="w-32 bg-green-600 hover:bg-green-700 text-white text-sm py-2">
                            <FaHandsHelping className="mr-2 h-4 w-4" />
                            Support
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
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
                className="fixed top-40 right-4 bg-white shadow-lg z-20 rounded-3xl overflow-hidden"
                style={{
                  maxWidth: "600px",
                  width: "33%",
                  height: "calc(100% - 15rem)",
                }}
              >
                {/* Header Section */}
                <div className="sticky top-0 bg-[#7E57C2] text-white flex items-center justify-between px-4 py-3 shadow-sm">
                  <h2 className="text-lg font-semibold">Find Projects</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-transparent focus:ring-0 focus:outline-none"
                    onClick={() => setIsSearchOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <div className="sticky top-0 z-10 bg-white px-4 py-3 border-b border-gray-100">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Search by Name or Location..."
                      value={searchQuery}
                      onChange={handleSearch}
                      className="w-full pl-12 pr-10 py-3 text-sm border border-gray-200 rounded-full shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 bg-gray-50/50"
                    />
                    {searchQuery && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 hover:bg-transparent focus:ring-0 focus:outline-none"
                        onClick={() => {
                          setSearchQuery("");
                          fetchProjects();
                        }}
                      >
                        <X className="h-4 w-4 text-gray-400" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Content Section */}
                <div className="h-full overflow-y-auto">
                  {!searchQuery ? (
                    // Initial Empty State
                    <div className="h-10/12 flex flex-col items-center justify-center p-6 text-center">
                      <div className="w-24 h-14 mb-4">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          className="w-full h-full text-blue-100"
                        >
                          <path
                            d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Search Projects
                      </h3>
                      <p className="text-sm text-gray-500 max-w-[200px]">
                        Start typing to search for projects by name or location
                      </p>
                    </div>
                  ) : (
                    // Search Results
                    <div className="py-2">
                      {filteredProjects.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-6 text-center">
                          <div className="w-16 h-16 mb-4 text-gray-300">
                            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                              <path
                                d="M10 12C10 13.1046 9.10457 14 8 14C6.89543 14 6 13.1046 6 12C6 10.8954 6.89543 10 8 10C9.10457 10 10 10.8954 10 12Z"
                                fill="currentColor"
                              />
                              <path
                                d="M18 12C18 13.1046 17.1046 14 16 14C14.8954 14 14 13.1046 14 12C14 10.8954 14.8954 10 16 10C17.1046 10 18 10.8954 18 12Z"
                                fill="currentColor"
                              />
                              <path
                                d="M12 17C9.23858 17 7 16.1046 7 15C7 13.8954 9.23858 13 12 13C14.7614 13 17 13.8954 17 15C17 16.1046 14.7614 17 12 17Z"
                                fill="currentColor"
                              />
                            </svg>
                          </div>
                          <p className="text-gray-500">No results found</p>
                        </div>
                      ) : (
                        <ul className="space-y-1 px-2 max-h-80 overflow-y-auto overflow-x-hidden">
                          {filteredProjects.map((project) => (
                            <li key={project._id}>
                              <Button
                                variant="ghost"
                                className="w-full h-14 justify-start text-left hover:bg-blue-50 rounded-lg p-3"
                                onClick={() => {
                                  handleSelectSuggestion(project.title);
                                  handleMarkerClick(project);
                                }}
                              >
                                <div>
                                  <p className="font-medium text-blue-600 mb-0.5">
                                    {project.title}
                                  </p>
                                  <div className="flex items-center gap-2 text-xs">
                                    <span className="text-gray-500">
                                      {project.category}
                                    </span>
                                    <span className="text-gray-300">•</span>
                                    <span className="text-gray-600 truncate">
                                      {truncateText(project.location.address, 7)}
                                    </span>
                                  </div>
                                </div>
                              </Button>
                            </li>
                          ))}
                        </ul>

                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Left Sidebar */}
          <div
            className="absolute top-40 mb-8 left-4 bottom-24 w-80 bg-white/95 backdrop-blur-sm shadow-2xl rounded-3xl z-10 overflow-hidden border border-blue-100"
            style={{ height: "60%" }}
          >
            {/* Header with Gradient */}
            <div className="relative p-6 h-20 bg-[#7E57C2] text-white rounded-t-2xl">
              <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.5))]" />
              <h2 className="text-xl font-bold">Projects of your City</h2>
              <p className="text-sm text-blue-100 mb-6">Real-time statistics</p>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-4 gap-2 px-6 py-2 bg-gray-50/80 border-b border-blue-100 font-medium text-sm">
              <div className="text-gray-600 items-center mt-1">City</div>
              <div className="text-center flex flex-col items-center">
                <span className="text-lg mb-1">👨</span>
              </div>
              <div className="text-center flex flex-col items-center">
                <span className="text-lg mb-1">🐕</span>
              </div>
              <div className="text-center flex flex-col items-center">
                <span className="text-lg mb-1">🌳</span>
              </div>
            </div>

            {/* Scrolling Content */}
            <div className="overflow-hidden" style={{ height: "calc(100% - 9.5rem)" }}>
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
                    className="grid grid-cols-4 gap-1 px-4 py-4 border-b border-gray-100 hover:bg-blue-50/50 transition-all duration-300 group"
                  >
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-700">{stat.city}</span>
                    </div>
                    <div className="text-center">
                      <span className="inline-block px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-medium text-sm group-hover:bg-blue-100 transition-colors duration-300">
                        {stat.human}
                      </span>
                    </div>
                    <div className="text-center">
                      <span className="inline-block px-2.5 py-1 rounded-full bg-orange-50 text-orange-700 font-medium text-sm group-hover:bg-orange-100 transition-colors duration-300">
                        {stat.animal}
                      </span>
                    </div>
                    <div className="text-center">
                      <span className="inline-block px-2.5 py-1 rounded-full bg-green-50 text-green-700 font-medium text-sm group-hover:bg-green-100 transition-colors duration-300">
                        {stat.plant}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>


          </div>


        </div>
      )}

      {isMobile && (
        <div>

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
                      <h2 className="text-base font-bold mb-1 line-clamp-1">
                        {selectedProject.title}
                      </h2>
                      <p className="text-sm text-gray-600 line-clamp-1">
                        {selectedProject.description}
                      </p>
                    </div>
                  </div>

                  {/* Objective Section */}

                  <div className="mt-4 ml-2">
                    <p className="text-xs font-semibold text-blue-600 mb-1">Objective</p>
                    <p className="text-sm font-medium text-gray-900 line-clamp-1">
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
                  <div className="flex justify-between gap-2 pt-1 w-full px-2">
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
                  height: "60vh", // Increased height for better visibility
                  maxHeight: "90vh",
                }}
              >
                {/* Header Section */}
                <div className="sticky top-0 bg-blue-600 text-white flex items-center justify-between px-4 py-3 shadow-sm">
                  <h2 className="text-lg font-semibold">Find Projects</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-transparent focus:ring-0 focus:outline-none"
                    onClick={() => setIsSearchOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Search Input - Sticky */}
                <div className="sticky top-[56px] bg-white px-4 py-3 border-b border-gray-100 z-10">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Search by name or location..."
                      value={searchQuery}
                      onChange={handleSearch}
                      className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-200 rounded-full bg-gray-50/50"
                    />
                    {searchQuery && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 hover:bg-transparent"
                        onClick={() => {
                          setSearchQuery("");
                          fetchProjects();
                        }}
                      >
                        <X className="h-4 w-4 text-gray-400" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 overflow-y-auto">
                  {!searchQuery ? (
                    // Empty State
                    <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                      <div className="w-20 h-20 mb-4 text-blue-100">
                        <Search className="w-full h-full" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Search Projects
                      </h3>
                      <p className="text-sm text-gray-500 max-w-[250px]">
                        Start typing to search for projects by name or location
                      </p>
                    </div>
                  ) : filteredProjects.length === 0 ? (
                    // No Results State
                    <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                      <div className="w-16 h-16 mb-4 text-gray-300">
                        <Info className="w-full h-full" />
                      </div>
                      <p className="text-gray-500">No results found</p>
                    </div>
                  ) : (
                    // Results List
                    <div className="py-2 px-4 max-h-80 overflow-y-auto"> {/* Added max-h-80 and overflow-y-auto */}
                      <p className="text-xs font-medium text-gray-500 mb-3">
                        {filteredProjects.length} results found
                      </p>
                      <ul className="space-y-2 gap-2">
                        {filteredProjects.map((project) => (
                          <li key={project._id}>
                            <Button
                              variant="ghost"
                              className="w-full h-14 justify-start text-left hover:bg-blue-50 rounded-xl p-3"
                              onClick={() => {
                                handleSelectSuggestion(project.title);
                                handleMarkerClick(project);
                                setIsSearchOpen(false);
                              }}
                            >
                              <div className="flex items-start gap-3 w-full">

                                <div className="flex-1 min-w-0">

                                  {/* Added min-w-0 to allow truncation */}
                                  <p className="font-semibold text-blue-600 mb-0.5 truncate">
                                    {project.title}
                                  </p>
                                  <span className="text-sm scale-90 flex-shrink-0 items-center">{project.category}</span>
                                  <p className="text-xs text-gray-600 truncate">
                                    {project.location.address}
                                  </p>
                                </div>
                              </div>
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </div>

                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>



        </div>
      )}
    </div>
  );
}