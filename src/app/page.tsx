"use client";

import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  ChangeEvent,
} from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
  OverlayView,
} from "@react-google-maps/api";
import { motion, AnimatePresence } from "framer-motion";
import { FaThumbsUp, FaHandsHelping, FaUserCircle } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import {
  Home,
  LogIn,
  UserPlus,
  Info,
  Mail,
  Settings,
  HelpCircle,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";
import {
  Search,
  X,
  Menu,
  Heart,
  Plus,
  ZoomIn,
  ZoomOut,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import CountUp from "react-countup";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/router";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Search as SearchIcon } from "react-feather";
import { Label } from "recharts";
import { ScrollArea } from "@/components/ui/scroll-area";

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
/// Types
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
  { label: "🧑‍💼 Human", value: "Human" },
  { label: "🐕 Animal", value: "Animal" },
  { label: "🌳 Plant", value: "Plant" },
];

interface CustomDialogProps {
  tags: string[];
  searchQuery: string;
  handleSearch: (e: ChangeEvent<HTMLInputElement>) => void;
  filteredSuggestions: string[];
  handleSelectSuggestion: (suggestion: string) => void;
}

const CustomDialog: React.FC<CustomDialogProps> = ({
  tags,
  searchQuery,
  handleSearch,
  filteredSuggestions,
  handleSelectSuggestion,
}) => {
  return (
    <div className="fixed top-[57px] left-[240px] z-50 w-[500px] h-[45vh] bg-white border border-gray-300 shadow-lg rounded-xl">
      <div className="p-4">
        {/* Search Input */}
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search Projects..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full h-10 text-md border rounded-full px-4"
          />
        </div>
      </div>

      {/* Suggestions List */}
      <div className="h-[calc(50vh-125px)] overflow-y-auto px-4">
        {filteredSuggestions.length === 0 ? (
          <p>No results found.</p>
        ) : (
          <ul>
            {filteredSuggestions.map((suggestion) => (
              <li
                key={suggestion}
                onClick={() => handleSelectSuggestion(suggestion)}
                className="flex items-center cursor-pointer hover:bg-blue-100 py-2"
              >
                <SearchIcon className="mr-2 h-4 w-4 text-gray-500" />
                <span className="flex-1">{suggestion}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

interface CustomDialogMobileProps {
  isOpen: boolean;
  onClose: () => void;
  tags: string[];
  searchQuery: string;
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  filteredSuggestions: string[];
  handleSelectSuggestion: (suggestion: string) => void;
}

const CustomDialogMobile: React.FC<CustomDialogMobileProps> = ({
  isOpen,
  onClose,
  tags,
  searchQuery,
  handleSearch,
  filteredSuggestions,
  handleSelectSuggestion,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 z-50 w-full h-full bg-gray-500 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white w-[90%] sm:w-[500px] md:w-[600px] lg:w-[700px] h-[60vh] sm:h-[40vh] rounded-xl shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>

        <div className="p-4">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search Projects..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full h-10 text-md border rounded-full px-4"
            />
          </div>
        </div>

        <div className="h-[calc(100vh-170px)] overflow-y-auto px-4">
          {filteredSuggestions.length === 0 ? (
            <p>No results found.</p>
          ) : (
            <ul>
              {filteredSuggestions.map((suggestion) => (
                <li
                  key={suggestion}
                  onClick={() => handleSelectSuggestion(suggestion)}
                  className="flex items-center cursor-pointer hover:bg-blue-100 py-2"
                >
                  <SearchIcon className="mr-2 h-4 w-4 text-gray-500" />
                  <span className="flex-1">{suggestion}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

const getCategoryEmoji = (category: string) => {
  switch (category.toLowerCase()) {
    case "human":
      return "🧑‍💼";
    case "animal":
      return "🐕";
    case "plant":
      return "🌳";
    default:
      return "🧑‍💼";
  }
};

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

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  });

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
        project.description?.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredProjects(filtered);

    const suggestions = filtered.map((project) => project.title);
    setFilteredSuggestions(suggestions);
  };

  // Handle category filter (unchanged)
  useEffect(() => {
    if (selectedType) {
      const filtered = projects.filter(
        (project) =>
          project.category.toLowerCase() === selectedType.toLowerCase()
      );
      setFilteredProjects(filtered);
    } else {
      setFilteredProjects(projects);
    }
  }, [selectedType, projects]);

  const handleSelectSuggestion = (value: string) => {
    setSearchQuery(value);
    const filtered = projects.filter((project) =>
      project.title.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredProjects(filtered);
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

  if (loadError) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black">
        <p className="text-xl text-white font-medium">
          Error loading map: {loadError.message}
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
      {isClient && (
        <GoogleMap
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
                            <text x="20" y="24" font-family="Arial" font-size="18" text-anchor="middle" dominant-baseline="middle">
                              ${getCategoryEmoji(project.category)}
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
                  <Card className="w-64 bg-white shadow-lg">
                    <CardHeader className="p-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg text-black">
                          {project.title}
                        </CardTitle>
                        <Badge variant="outline" className="text-lg">
                          {getCategoryEmoji(project.category)}
                        </Badge>
                      </div>
                      <CardDescription className="text-blue-600 mt-2">
                        {project.category}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 text-sm mb-2 line-clamp-3">
                        {project.description}
                      </p>
                      <p className="text-gray-600 text-xs">
                        {project.location.address}
                      </p>
                    </CardContent>
                  </Card>
                </OverlayView>
              )}
            </React.Fragment>
          ))}
        </GoogleMap>
      )}

      {/* Category Filters */}
      <div className="absolute top-20 left-0 right-0 z-10 w-full px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          {/* Organization Types Buttons */}
          <div className="flex-grow flex items-center justify-center">
            <div className="inline-flex items-center justify-center space-x-2 bg-white rounded-full shadow-md px-4 py-2">
              {organizationTypes.map((type) => (
                <Button
                  key={type.value}
                  variant={selectedType === type.value ? "default" : "ghost"}
                  size="sm"
                  className={`rounded-full transition-all duration-300 ${selectedType === type.value
                      ? "bg-blue-600 text-white"
                      : "text-blue-600 hover:bg-blue-50"
                    }`}
                  onClick={() =>
                    setSelectedType(
                      selectedType === type.value ? null : type.value
                    )
                  }
                >
                  {type.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Total Projects Section */}
          <div className="sm:ml-4">
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
        className="absolute top-4 right-4 bg-white hover:bg-gray-100 p-4 rounded-full shadow-lg z-20"
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
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-10">
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
                    className="text-white hover:bg-blue-700 transition-colors hover:bg-transparent mr-1 focus:ring-0 focus:outline-none"
                  >
                    <X className="h-6 w-6" />
                  </Button>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Did My Bit</h3>
                  <p className="text-sm text-blue-100">
                    Make an impact, one bit at a time
                  </p>
                </div>
              </div>

              {/* Menu Items */}
              <nav className="flex-grow p-6 space-y-6">
                {/* Main Menu */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 mb-2">
                    MAIN MENU
                  </h4>
                  <ul className="space-y-4">
                    <li>
                      <Link href="/">
                        <Button
                          variant="outline"
                          className="w-full justify-start text-blue-600 font-semibold hover:bg-blue-100 transition-all"
                        >
                          <Home className="mr-3 h-5 w-5 font-semibold" />
                          Home
                        </Button>
                      </Link>
                    </li>
                    <li>
                      <Link href="/login">
                        <Button
                          variant="outline"
                          className="w-full justify-start text-blue-600 font-semibold hover:bg-blue-100 transition-all"
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
                          className="w-full justify-start text-blue-600 font-semibold hover:bg-blue-100 transition-all"
                        >
                          <UserPlus className="mr-3 h-5 w-5" />
                          Sign Up
                        </Button>
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* About Us */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 mb-2">
                    ABOUT US
                  </h4>
                  <ul className="space-y-4">
                    <li>
                      <Link href="/about">
                        <Button
                          variant="outline"
                          className="w-full justify-start text-blue-600 font-semibold hover:bg-blue-100 transition-all"
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
                          className="w-full justify-start text-blue-600 font-semibold hover:bg-blue-100 transition-all"
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
                      <Link href="/about">
                        <Button
                          variant="outline"
                          className="w-full justify-start text-blue-600 font-semibold hover:bg-blue-100 transition-all"
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
                className="fixed top-36 right-4 bg-white shadow-lg hide-scrollbar z-20 rounded-3xl overflow-hidden -translate-y-2"
                style={{
                  maxWidth: "350px",
                  height: "calc(100% - 14rem)",
                }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 hover:bg-transparent mr-1 focus:ring-0 focus:outline-none"
                  onClick={() => setIsProjectPanelOpen(false)}
                >
                  <X className="h-6 w-6" />
                </Button>

                <div className="p-6 h-full overflow-y-auto">
                  <h2 className="text-2xl font-bold mb-4">
                    {selectedProject.title}
                  </h2>
                  <Badge className="mb-3">{selectedProject.category}</Badge>
                  <p className="text-gray-600 mb-2 line-clamp-3">
                    {selectedProject.description}
                  </p>
                  <p className="font-semibold mb-1">Objective:</p>
                  <p className="text-gray-600 mb-2">
                    {selectedProject.objective}
                  </p>
                  <p className="font-semibold mb-1">Location:</p>
                  <p className="text-gray-600 mb-2">
                    {selectedProject.location.address}
                  </p>
                  <div className="flex space-x-4 mt-6">
                    <Link
                      href={`/creator-profile/${selectedProject.creator._id}`}
                    >
                      <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                        <FaUserCircle className="mr-2" />
                        View Profile
                      </Button>
                    </Link>
                    <Link href={`/project-profile/${selectedProject._id}`}>
                      <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                        <FaHandsHelping className="mr-2" />
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
                      placeholder="Search projects..."
                      value={searchQuery}
                      onChange={handleSearch}
                      className="w-full pl-12 pr-4 py-3 text-md border border-gray-300 rounded-3xl"
                    />
                  </div>

                  {/* Search Results */}
                  <ScrollArea className="mt-6 h-[50vh] px-2">
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
                              className="w-full h-14 justify-start text-left hover:bg-blue-50 rounded-lg p-3"
                              onClick={() =>
                                handleSelectSuggestion(project.title)
                              }
                            >
                              <div>
                                <p className="font-medium text-blue-600">
                                  {project.title}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {project.category}
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
            className="absolute top-20 left-4 bottom-24 w-72 bg-white shadow-lg rounded-2xl z-10"
            style={{ height: "80%" }}
          >
            {/* Header */}
            <div className="flex flex-row p-4 items-center bg-blue-600 text-white rounded-t-2xl">
              <h2 className="text-xl font-bold flex-grow">Top Projects</h2>
              <div className="ml-auto">
                <CountUp
                  start={0}
                  end={filteredProjects.length}
                  duration={2}
                  separator=","
                  enableScrollSpy={true}
                />
              </div>
            </div>

            {/* Scrollable Section */}
            <div
              className="overflow-y-auto h-[calc(100%-4rem)]"
              style={{
                scrollbarWidth: "none", // Firefox
                msOverflowStyle: "none", // IE and Edge
              }}
            >
              {projects.slice(0, 10).map((project) => (
                <Card
                  key={project._id}
                  className="m-4 cursor-pointer hover:shadow-md transition-shadow duration-200"
                  onClick={() => handleMarkerClick(project)}
                >
                  <CardHeader className="p-4">
                    <Image
                      src={project.pictureOfSuccess.url}
                      alt=""
                      width={500}
                      height={30}
                      style={{ objectFit: "contain" }}
                      className="rounded-2xl"
                    ></Image>

                    <CardTitle className="text-sm font-semibold">
                      {project.title}
                    </CardTitle>
                    <Badge className="mt-1 w-[86px]">{project.category}</Badge>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-xs text-gray-600">
                      {project.description.substring(0, 100)}
                      {project.description.length > 100 ? "..." : ""}
                    </p>
                  </CardContent>
                </Card>
              ))}
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
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed top-36 right-4 bg-white shadow-lg z-20 rounded-3xl overflow-hidden -translate-y-2"
                style={{
                  maxWidth: "420px",
                  height: "calc(100% - 19rem)",
                  scrollbarWidth: "thin",
                }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 ml-4 hover:bg-transparent focus:ring-0 focus:outline-none"
                  onClick={() => setIsProjectPanelOpen(false)}
                >
                  <X className="h-6 w-6" />
                </Button>

                <div className="p-6 h-full overflow-y-auto">
                  <Image
                    src={selectedProject.pictureOfSuccess.url}
                    alt=""
                    width={280}
                    height={30}
                    style={{ objectFit: 'contain' }}
                    className="rounded-2xl"
                  ></Image>
                  <h2 className="text-2xl mt-4 font-bold mb-2">
                    {selectedProject.title}
                  </h2>
                  <Badge className="mb-3">{selectedProject.category}</Badge>
                  <p className="text-gray-600 mb-2 line-clamp-3">
                    {selectedProject.description}
                  </p>
                  <p className="font-semibold mb-1">Objective:</p>
                  <p className="text-gray-600 mb-2">
                    {selectedProject.objective}
                  </p>
                  <p className="font-semibold mb-1">Location:</p>
                  <p className="text-gray-600 mb-2">
                    {selectedProject.location.address}
                  </p>
                  <div className="flex space-x-4 mt-6">
                    <Link href={`/creator-profile/${selectedProject._id}`}>
                      <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                        <FaUserCircle className="mr-2" />
                        View Profile
                      </Button>
                    </Link>
                    <Link href={`/project-profile/${selectedProject._id}`}>
                      <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                        <FaHandsHelping className="mr-2" />
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
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed top-36 right-4 bg-white shadow-lg z-20 rounded-3xl overflow-hidden"
                style={{
                  maxWidth: "600px",
                  width: "90%",
                  height: "calc(100% - 19rem)",
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
                      placeholder="Search projects..."
                      value={searchQuery}
                      onChange={handleSearch}
                      className="w-full pl-12 pr-4 py-3 text-md border border-gray-300 rounded-3xl"
                    />
                  </div>

                  {/* Search Results */}
                  <ScrollArea className="mt-6 h-[50vh] px-2">
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
                              className="w-full h-14 justify-start text-left hover:bg-blue-50 rounded-lg p-3"
                              onClick={() =>
                                handleSelectSuggestion(project.title)
                              }
                            >
                              <div>
                                <p className="font-medium text-blue-600">
                                  {project.title}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {project.category}
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
