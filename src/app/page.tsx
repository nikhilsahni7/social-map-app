

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
import { Label } from "recharts";

// Map styles
const mapStyles = [
  {
    featureType: "all",
    elementType: "labels",
    stylers: [{ visibility: "on" }],
  },
  // ... (other styles from your original code)
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

export const isMobileDevice = () => {
  return window.matchMedia("(max-width: 768px)").matches;
};

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

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  });



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

  const [isMobile, setIsMobile] = useState(false);

  const checkIsMobile = () => {
    return window.innerWidth <= 768;
  };

  useEffect(() => {
    // Initial check
    setIsMobile(checkIsMobile());

    // Add resize listener
    const handleResize = () => {
      setIsMobile(checkIsMobile());
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
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
              {/* Header */}
              <CardHeader className="p-4 bg-gradient-to-r from-blue-500 to-blue-700">
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    {selectedProject.firstName} wants {selectedProject.objective}
                  </h2>
                  <Badge
                    variant="secondary"
                    className="mt-2 bg-blue-400 text-white"
                  >
                    {selectedProject.category}
                  </Badge>
                </div>
              </CardHeader>

              {/* Address */}
              <CardContent className="p-4 border-b border-gray-200">
                <p className="text-sm text-gray-600 font-medium">
                  {selectedProject.location.address}
                </p>
              </CardContent>

              {/* Full-Width Buttons */}
              <CardFooter className="p-4 flex flex-col gap-3">
                <Link href={`/project-profile/${selectedProject._id}`} className="w-full">
                  <Button className="w-full bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center gap-2 py-2">
                    <FaHandsHelping className="h-4 w-4" />
                    Support
                  </Button>
                </Link>
                <Link href={`/creator-profile/${selectedProject._id}`} className="w-full">
                  <Button className="w-full bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center gap-2 py-2">
                    <FaUserCircle className="h-4 w-4" />
                    View Profile
                  </Button>
                </Link>
              </CardFooter>

              {/* Action Buttons */}
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





      {/* Category Filters */}
      <div className="absolute top-20 left-0 right-0 z-10 w-full px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          {/* Organization Types Buttons */}
          <div className="flex-grow flex items-center justify-center">
            <div className="inline-flex items-center justify-center space-x-2 bg-white rounded-full shadow-md px-4 py-2">
              {organizationTypes.map((type) => (
                <Button
                  key={type}
                  variant={selectedType === type ? "default" : "ghost"}
                  size="sm"
                  className={`rounded-full transition-all duration-300 ${selectedType === type
                    ? "bg-blue-600 text-white"
                    : "text-blue-600 hover:bg-blue-50"
                    }`}
                  onClick={() => setSelectedType(selectedType === type ? null : type)}
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>

          {/* Total Projects Section */}
          <div className="sm:ml-4">
            <div className="text-sm font-semibold text-white bg-blue-600 px-4 py-2 rounded-full shadow-md">
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

      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 bg-white hover:bg-gray-100 p-4 rounded-full shadow-lg z-20"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
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
              <button onClick={() => setIsSearchOpen(true)} className="btn btn-primary">
                Open Search
              </button>

              {/* Search Dialog */}
              <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
                <DialogContent className="sm:max-w-[500px] h-[65vh] sm:h-[65vh] w-[90%] sm:w-auto mx-auto">
                  <DialogHeader>
                    <DialogTitle className="text-xl sm:text-2xl font-bold text-center mb-3 sm:mb-5">
                      Search Organizations
                    </DialogTitle>
                  </DialogHeader>



                  {/* Search Input */}
                  <Command className="rounded-lg border shadow-md">
                    <CommandInput
                      placeholder="Type to search..."
                      value={searchQuery}
                      onValueChange={handleSearch}
                      className="h-8 sm:h-10 text-sm sm:text-base"
                    />

                    {/* Suggestions List */}
                    <CommandList className="h-[calc(60vh-100px)] sm:h-[calc(60vh-120px)] overflow-y-auto">
                      <CommandEmpty>No results found.</CommandEmpty>
                      <CommandGroup>
                        {filteredSuggestions.map((suggestion) => (
                          <CommandItem
                            key={suggestion}
                            onSelect={() => handleSelectSuggestion(suggestion)}
                            className="flex cursor-pointer hover:bg-blue-100 py-1 sm:py-2 flex-row"
                          >
                            <Search className="mr-1 sm:mr-2 mt-1 h-4 w-4" />
                            <span className="text-sm sm:text-base">{suggestion}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </DialogContent>
              </Dialog>
            </div>
          )}

          {/* Button Section (Mobile) */}
          <div className="flex flex-col items-center fixed bottom-4 left-4 right-4 z-10 space-y-4">
            {/* Create Project Button */}
            <Link href="/create-project">
              <Button className="w-full py-6 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center">
                <Plus className="h-6 w-7 mr-2" />
                Create Project
              </Button>
            </Link>

            {/* Search Button */}
            <Button
              className="py-6 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="h-6 w-7 mr-2" />
              Search Projects
            </Button>
          </div>
        </div>

      ) : (

        <div className="absolute top-1/2 left-4 z-10 transform -translate-y-1/2">

          <div className="flex flex-col items-center space-y-4">



            <Link href="/create-project">
              <Button className="py-7 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg">
                <Plus className="h-6 w-6 mr-2" />
                Create Project
              </Button>
            </Link>

            {/* Side Menu (for mobile) */}
            <CustomDialog
              isOpen={isSearchOpen}
              onClose={() => setIsSearchOpen(false)}
              tags={tags}
              searchQuery={searchQuery}
              handleSearch={handleSearch}
              filteredSuggestions={filteredSuggestions}
              handleSelectSuggestion={handleSelectSuggestion}

            />

            {/* Search Button */}
            <Button

              className="py-7 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="mr-2 h-4 w-4" />
              Search projects
            </Button>
          </div>
        </div>

      )
      }

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
                <div>
                  <Link href="/login">
                    <Button variant="outline" className="w-full justify-start">
                      Login
                    </Button>
                  </Link>
                </div>
                <div>
                  <Link href="/signup">
                    <Button variant="outline" className="w-full justify-start">
                      Sign Up
                    </Button>
                  </Link>
                </div>
                <div>
                  <Link href="/about">
                    <Button variant="outline" className="w-full justify-start">
                      About Us
                    </Button>
                  </Link>
                </div>
                <div>
                  <Link href="/contact">
                    <Button variant="outline" className="w-full justify-start">
                      Contact Us
                    </Button>
                  </Link>
                </div>
              </div>
              <Label className="text-blue-600 font-medium">Did My Bit</Label>

            </div>
          </motion.div>
        )}

      </AnimatePresence>



    </div >
  );
}