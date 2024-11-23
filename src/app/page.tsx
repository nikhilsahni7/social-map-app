/* eslint-disable @typescript-eslint/no-explicit-any */

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
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

import { getAuthUser, logout } from "@/lib/clientAuth"; // Import auth functions

// Map styles
const mapStyles = [
  {
    featureType: "all",
    elementType: "labels",
    stylers: [{ visibility: "on" }],
  },
];

// Types
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
  pictureOfSuccess?: {
    url: string;
  };
}

interface CustomDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tags: string[];
  searchQuery: string;
  handleSearch: (e: ChangeEvent<HTMLInputElement>) => void;
  filteredSuggestions: string[];
  handleSelectSuggestion: (suggestion: string) => void;
}

const tags = ["Mumbai", "Delhi", "Bangalore", "Kolkata"];
const organizationTypes = ["Human", "Animal", "Plant"];

const CustomDialog: React.FC<CustomDialogProps> = ({
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
    <div className="fixed top-[57px] left-[240px] z-50 w-[500px] h-[45vh] bg-white border border-gray-300 shadow-lg rounded-xl">
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

export default function SocialConnectMap() {
  const router = useRouter();
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
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  });

  useEffect(() => {
    const authUser = getAuthUser();
    if (authUser) {
      setUser(authUser);
    }
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
            (project: any) =>
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

  // Handle search (unchanged)
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
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
        (project) => project.category === selectedType
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
    if (map) {
      map.panTo({
        lat: project.location.coordinates[1],
        lng: project.location.coordinates[0],
      });
    }
  };

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
      <div className="h-screen w-full flex items-center justify-center bg-black">
        <p className="text-xl text-white font-medium">Loading map...</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-full relative bg-gray-900">
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
                icon={{
                  url: "https://cdn-icons-png.flaticon.com/512/9356/9356230.png",
                  scaledSize: new google.maps.Size(40, 40),
                }}
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
                    <CardTitle className="text-lg text-black">
                      {project.title}
                    </CardTitle>
                    <CardDescription className="text-blue-600">
                      {project.category}
                    </CardDescription>
                    <CardDescription className="text-gray-700">
                      {project.description}
                    </CardDescription>
                    <CardDescription className="text-gray-700">
                      {project.location.address}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </OverlayView>
            )}
          </React.Fragment>
        ))}

        {selectedProject && (
          <InfoWindow
            position={{
              lat: selectedProject.location.coordinates[1],
              lng: selectedProject.location.coordinates[0],
            }}
            onCloseClick={() => setSelectedProject(null)}
          >
            <Card className="w-full max-w-xs bg-white border border-blue-500 shadow-lg overflow-hidden">
              <CardHeader className="p-4 bg-gradient-to-r from-blue-500 to-blue-700">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-white">
                      {selectedProject.firstName} wants{" "}
                      {selectedProject.objective}
                    </h2>
                    <Badge
                      variant="secondary"
                      className="mt-1 bg-blue-400 text-white"
                    >
                      {selectedProject.category}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardFooter className="p-4">
                <p className="text-xl text-black font-medium">
                  {selectedProject.location.address}
                </p>
              </CardFooter>
              <CardFooter className="p-4">
                <Button className="w-full bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
                  <FaHandsHelping />
                  Support
                </Button>
              </CardFooter>

              <CardFooter className="p-4 -mt-4">
                <Link href={`/project-profile/${selectedProject._id}`}>
                  <Button className="w-full bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
                    <FaUserCircle />
                    View Profile
                  </Button>
                </Link>
              </CardFooter>

              <div className="flex justify-between p-4 -mt-5">
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-black hover:text-blue-500 transition-colors duration-300 transform hover:scale-110 active:scale-95"
                  >
                    <Heart className="h-6 w-6 transition-transform duration-300" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-black hover:text-blue-500 transition-colors duration-300 transform hover:scale-110 active:scale-95"
                  >
                    <FaThumbsUp className="h-6 w-6 transition-transform duration-300" />
                  </Button>
                </div>
              </div>
            </Card>
          </InfoWindow>
        )}
      </GoogleMap>

      {/* Category filters */}
      <div className="absolute top-20 left-0 right-0 z-10 flex flex-col md:flex-row items-center">
        <div className="relative w-full">
          {/* Tags Section */}
          <div className="flex flex-wrap justify-center space-x-4">
            {organizationTypes.map((type) => (
              <Button
                key={type}
                variant={selectedType === type ? "default" : "outline"}
                size="sm"
                className={`w-24 sm:w-28 rounded-full transition-all duration-300 ${
                  selectedType === type
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                }`}
                onClick={() =>
                  setSelectedType(selectedType === type ? null : type)
                }
              >
                {type}
              </Button>
            ))}
          </div>

          {/* Total Projects Section */}
          <div className="mt-4 md:absolute md:top-0 md:right-0 md:mt-0 flex justify-center md:justify-end mr-4">
            <div className="text-sm font-semibold text-white bg-blue-600 px-4 py-2 rounded-full transition-all duration-300">
              Total Projects: {filteredProjects.length}
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
      <div className="absolute top-4 left-4 right-4 z-10">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="relative">
            <Button
              variant="outline"
              className="fixed bottom-24 left-8 z-10 py-7 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="mr-2 h-4 w-4" />
              Search projects
            </Button>

            <CustomDialog
              isOpen={isSearchOpen}
              onClose={() => setIsSearchOpen(false)}
              tags={tags}
              searchQuery={searchQuery}
              handleSearch={handleSearch}
              filteredSuggestions={filteredSuggestions}
              handleSelectSuggestion={handleSelectSuggestion}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="bg-white hover:bg-gray-100"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Side Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: 300 }}
            animate={{ x: 0 }}
            exit={{ x: 300 }}
            className="fixed top-0 right-0 h-full w-72 bg-white shadow-lg z-20"
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Menu</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>

              <div className="space-y-4">
                {user ? (
                  <div className="flex flex-col space-y-2">
                    <Card className="p-4 bg-gray-100">
                      <CardTitle className="text-lg">{user.name}</CardTitle>
                      <CardDescription className="text-sm text-gray-600">
                        {user.email}
                      </CardDescription>
                    </Card>
                    <Button
                      onClick={logout}
                      variant="outline"
                      className="w-full justify-start"
                    >
                      Logout
                    </Button>
                  </div>
                ) : (
                  <>
                    <Button
                      onClick={() => router.push("/login")}
                      variant="outline"
                      className="w-full justify-start"
                    >
                      Login
                    </Button>
                    <Button
                      onClick={() => router.push("/signup")}
                      variant="outline"
                      className="w-full justify-start"
                    >
                      Sign Up
                    </Button>
                  </>
                )}
                <Button variant="outline" className="w-full justify-start">
                  About Us
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Contact Us
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project Creation Button */}
      <Link href="/create-project">
        <Button className="fixed bottom-8 left-8 z-10 py-7 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg">
          <Plus className="h-6 w-6 mr-2" />
          Create Project
        </Button>
      </Link>
    </div>
  );
}
