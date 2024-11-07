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
import { FaThumbsUp } from "react-icons/fa";
import {
  Search,
  X,
  Menu,
  Phone,
  Mail,
  DollarSign,
  Layers,
  ZoomIn,
  ZoomOut,
  Compass,
  ChevronRight,
  Heart,
  Eye,
  MapPin,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { FaHandsHelping, FaUserCircle } from "react-icons/fa";
import { getAuthUser, logout } from "@/lib/clientAuth";

const searchSuggestions = [
  "Community Support Center",
  "Family Care Network",
  "Youth Empowerment Alliance",
  "Animal Welfare Society",
  "Environmental Conservation Group",
  "Senior Care Foundation",
  "Education for All Initiative",
  "Mental Health Awareness Project",
  "Homeless Shelter Network",
  "Disaster Relief Organization",
];

interface Organization {
  id: number;
  name: string;
  lat: number;
  lng: number;
  description: string;
  phone: string;
  email: string;
  donationInfo: string;
  avatar: string;
  category: string;
  objective: string;
}

const organizations: Organization[] = [
  {
    id: 1,
    name: "Community Support Center",
    lat: 40.7128,
    lng: -74.006,
    description: "Helping communities thrive through various support programs",
    phone: "+1 (555) 123-4567",
    email: "contact@communitysupport.org",
    donationInfo: "Your donation helps us reach more people in need",
    avatar: "/placeholder.svg?height=40&width=40",
    category: "Animal",
    objective: "To provide educational resources to underserved communities",
  },
  {
    id: 2,
    name: "Family Care Network",
    lat: 40.72,
    lng: -74.01,
    description: "Supporting families with comprehensive care and resources",
    phone: "+1 (555) 987-6543",
    email: "info@familycarenetwork.org",
    donationInfo: "Help us strengthen families in our community",
    avatar: "/placeholder.svg?height=40&width=40",
    category: "Plant",
    objective: "To provide educational resources to underserved communities",
  },
  {
    id: 3,
    name: "Youth Empowerment Alliance",
    lat: 40.73,
    lng: -73.99,
    description: "Empowering youth through education and mentorship programs",
    phone: "+1 (555) 246-8135",
    email: "hello@youthempowerment.org",
    donationInfo: "Invest in the future of our youth",
    avatar: "/placeholder.svg?height=40&width=40",
    category: "Humans",
    objective: "To provide educational resources to underserved communities",
  },
];

const mapStyles = [
  {
    featureType: "all",
    elementType: "labels",
    stylers: [{ visibility: "on" }],
  },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "poi",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "road",
    elementType: "labels",
    stylers: [{ visibility: "on" }],
  },
  {
    featureType: "transit",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "water",
    elementType: "labels",
    stylers: [{ visibility: "on" }],
  },
  {
    featureType: "all",
    elementType: "geometry.fill",
    stylers: [{ color: "#f7f7f7" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#e0e0e0" }],
  },
  {
    featureType: "transit.line",
    elementType: "geometry",
    stylers: [{ color: "#cccccc" }],
  },
  {
    featureType: "transit.station",
    elementType: "geometry",
    stylers: [{ color: "#dddddd" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#d4e4f4" }],
  },
];

const quickNavLocations = [
  { name: "New Delhi", lat: 28.6139, lng: 77.209 },
  { name: "Mumbai", lat: 19.076, lng: 72.8777 },
  { name: "Kolkata", lat: 22.5726, lng: 88.3639 },
  { name: "Chennai", lat: 13.0827, lng: 80.2707 },
];

const organizationTypes = ["Humans", "Animals", "Plants"];

const tags = ["Mumbai", "Delhi", "Bangalore", "Kolkata"];

const handleCreateOrganization = () => {
  // Implement the logic to create a new organization
  console.log("Create new organization");
};

interface CustomDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tags: string[];
  searchQuery: string;
  handleSearch: (e: ChangeEvent<HTMLInputElement>) => void;
  filteredSuggestions: string[];
  handleSelectSuggestion: (suggestion: string) => void;
}

interface SearchBarProps {
  searchQuery: string;
  handleSearch: (e: ChangeEvent<HTMLInputElement>) => void;
  filteredSuggestions: string[];
  handleSelectSuggestion: (suggestion: string) => void;
  onClose: () => void;
}

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
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        &times;
      </button>

      {/* Search Input and Button */}
      <div className="p-4">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search Organizations..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full h-10 text-md border rounded-full px-4"
          />
        </div>
      </div>

      {/* Scrollable Suggestions List */}
      <div className="h-[calc(50vh-125px)] overflow-y-auto px-4">
        {filteredSuggestions.length === 0 ? (
          <p>No results found.</p>
        ) : (
          <ul>
            {filteredSuggestions.map((suggestion) => (
              <li
                key={suggestion}
                onClick={() => handleSelectSuggestion(suggestion)}
                className="flex items-center cursor-pointer hover:bg-blue-100 py-2" // Added items-center to align items vertically
              >
                <SearchIcon className="mr-2 h-4 w-4 text-gray-500" />
                <span className="flex-1">{suggestion}</span>{" "}
                {/* Added flex-1 to allow span to take available space */}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default function SocialConnectMap() {
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [hoveredOrg, setHoveredOrg] = useState<Organization | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const [filteredOrgs, setFilteredOrgs] = useState(organizations);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mapType, setMapType] = useState<google.maps.MapTypeId | null>(null);
  const [showSatelliteView, setShowSatelliteView] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [filteredSuggestions, setFilteredSuggestions] =
    useState(searchSuggestions);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
  };

  const handleSelectSuggestion = (value: string) => {
    setSearchQuery(value);
    // Implement your search logic here
    console.log("Searching for:", value);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobileDevice(window.innerWidth < 768);
    };

    // Initial check
    handleResize();

    // Listen for window resize
    window.addEventListener("resize", handleResize);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyBqhfgZcU66YtFCbNYFaHgiLKaR6CVve3U",
  });

  useEffect(() => {
    if (isLoaded && mapType === null) {
      setMapType(google.maps.MapTypeId.ROADMAP);
    }
  }, [isLoaded, mapType]);

  const onLoad = useCallback((map: google.maps.Map) => {
    const bounds = new window.google.maps.LatLngBounds();
    organizations.forEach((org) =>
      bounds.extend({ lat: org.lat, lng: org.lng })
    );
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  useEffect(() => {
    const filtered = organizations.filter(
      (org) =>
        org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredOrgs(filtered);
  }, [searchQuery]);

  const handleMarkerClick = (org: Organization) => {
    setSelectedOrg(org);
    if (map) {
      map.panTo({ lat: org.lat, lng: org.lng });
    }
  };

  const toggleSatelliteView = () => {
    if (isLoaded) {
      setShowSatelliteView(!showSatelliteView);
      setMapType(
        showSatelliteView
          ? google.maps.MapTypeId.ROADMAP
          : google.maps.MapTypeId.HYBRID
      );
    }
  };

  const handleZoomIn = () => {
    if (map) {
      map.setZoom(map.getZoom()! + 1);
    }
  };

  const handleZoomOut = () => {
    if (map) {
      map.setZoom(map.getZoom()! - 1);
    }
  };

  const handleResetView = () => {
    if (map) {
      const bounds = new window.google.maps.LatLngBounds();
      organizations.forEach((org) =>
        bounds.extend({ lat: org.lat, lng: org.lng })
      );
      map.fitBounds(bounds);
    }
  };

  const handleCreateOrganization = () => {
    // Implement the logic to create a new organization
    console.log("Create new organization");
  };

  const handleQuickNav = (location: { lat: number; lng: number }) => {
    if (map) {
      map.panTo(location);
      map.setZoom(12);
    }
  };

  const [isSearchOpen, setIsSearchOpen] = useState(false);

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
        center={{ lat: 40.7128, lng: -74.006 }}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          styles: mapStyles,
          mapTypeId: mapType || undefined,
          disableDefaultUI: true,
          zoomControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        {filteredOrgs.map((org) => (
          <React.Fragment key={org.id}>
            <Marker
              position={{ lat: org.lat, lng: org.lng }}
              onClick={() => handleMarkerClick(org)}
              onMouseOver={() => setHoveredOrg(org)}
              onMouseOut={() => setHoveredOrg(null)}
              icon={{
                url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
              }}
            />
            {hoveredOrg === org && (
              <OverlayView
                position={{ lat: org.lat, lng: org.lng }}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
              >
                <Card className="w-64 bg-white shadow-lg">
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg text-black">
                      {org.name}
                    </CardTitle>
                    <CardDescription className="text-blue-600">
                      {org.category}
                    </CardDescription>
                    <CardDescription className="text-gray-700">
                      {org.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </OverlayView>
            )}
          </React.Fragment>
        ))}
        {selectedOrg && (
          <InfoWindow
            position={{ lat: selectedOrg.lat, lng: selectedOrg.lng }}
            onCloseClick={() => setSelectedOrg(null)}
          >
            <Card className="w-full max-w-xs bg-white border border-blue-500 shadow-lg overflow-hidden">
              <CardHeader className="p-4 bg-gradient-to-r from-blue-500 to-blue-700">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-white">
                      Asmi wants {selectedOrg.objective}
                    </h2>
                    <Badge
                      variant="secondary"
                      className="mt-1 bg-blue-400 text-white"
                    >
                      {selectedOrg.category}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-4 space-y-2 text-gray-800 font-normal"></CardContent>

              <CardFooter className="p-4 -mt-4">
                <Button className="w-full bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
                  <FaHandsHelping />
                  Support
                </Button>
              </CardFooter>

              <CardFooter className="p-4 -mt-4">
                <Button className="w-full bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
                  <FaUserCircle />
                  View Profile
                </Button>
              </CardFooter>

              <div className="flex justify-between p-4 -mt-5">
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-black hover:text-blue-500 transition-colors duration-300 transform hover:scale-110 active:scale-95"
                    onClick={() => console.log("Liked")}
                  >
                    <Heart className="h-6 w-6 transition-transform duration-300" />
                    <span className="sr-only">Like</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-black hover:text-blue-500 transition-colors duration-300 transform hover:scale-110 active:scale-95"
                    onClick={() => console.log("Loved")}
                  >
                    <FaThumbsUp className="h-6 w-6 transition-transform duration-300" />
                    <span className="sr-only">Love</span>
                  </Button>
                </div>
              </div>
            </Card>
          </InfoWindow>
        )}
      </GoogleMap>

      <div className="absolute top-20 left-0 right-0 z-10 flex flex-col items-center">
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

        {/* Total Projects only shown on desktop */}
        {!isMobileDevice && (
          <div className="absolute right-0 mt-4 mr-5 flex items-center space-x-2 text-sm font-semibold text-black bg-yellow-400 px-4 py-2 rounded-full transition-all duration-300">
            <span>Total Projects: </span>
            <span className="text-sm">{"3"}</span>
          </div>
        )}
      </div>

      {!isMobileDevice && (
        <div className="absolute bottom-8 right-6 z-10 flex space-x-3 justify-end">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full text-black bg-yellow-400 hover:bg-blue-700 hover:text-white transition-all duration-300"
                  onClick={handleZoomIn}
                >
                  <ZoomIn className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Zoom In</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full text-black bg-yellow-400 hover:bg-blue-700 hover:text-white transition-all duration-300"
                  onClick={handleZoomOut}
                >
                  <ZoomOut className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Zoom Out</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {!isMobileDevice && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full text-black bg-yellow-400 shadow-lg hover:bg-blue-700 hover:text-white transition-all duration-300"
                    onClick={handleResetView}
                  >
                    <Compass className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Reset View</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      )}

      <Button
        variant="outline"
        className="absolute top-4 right-4 z-20 h-11 rounded-full text-black font-medium bg-yellow-400 hover:bg-yellow-500 transition-all duration-300"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {!isMobileDevice && (
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 space-y-4">
          <Link href="/create-project">
            <Button
              variant="default"
              className="h-14 w-2/3 rounded-full text-black font-medium bg-yellow-400 hover:bg-yellow-500 transition-all duration-300"
              onClick={handleCreateOrganization}
            >
              <Plus className="h-5 w-5 mr-1" />
              Create Your Project
            </Button>
          </Link>

          <Button
            variant="default"
            className="h-14 w-2/3 rounded-full text-black font-medium bg-yellow-400 hover:bg-yellow-500 transition-all duration-300"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search className="h-5 w-5 mr-1" />
            Search
          </Button>

          {/* Custom Dialog without Background Dimming */}
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
      )}

      {isMobileDevice && (
        <div className="fixed left-0 right-0 z-20 flex flex-col items-center bottom-6 space-y-2">
          <Link href="/create-project">
            <Button
              variant="default"
              className="h-10 w-[220px] rounded-full bg-green-600 hover:bg-green-700 text-white transition-all duration-300"
              onClick={handleCreateOrganization}
            >
              <Plus className="h-4 w-4 mr-1" />
              Create Your Project
            </Button>
          </Link>

          <Button
            variant="default"
            className="h-10 w-[220px] rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search className="h-4 w-4 mr-1" />
            Search
          </Button>

          <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
            <DialogContent className="sm:max-w-[500px] h-[65vh] sm:h-[65vh] w-[90%] sm:w-auto mx-auto">
              <DialogHeader>
                <DialogTitle className="text-xl sm:text-2xl font-bold text-center mb-3 sm:mb-5">
                  Search Organizations
                </DialogTitle>
              </DialogHeader>

              <div className="flex flex-wrap gap-2 justify-center">
                {tags.slice(0, 6).map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="cursor-pointer hover:bg-blue-100 h-7 transition-colors text-sm sm:text-base px-2"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              <Command className="rounded-lg border shadow-md">
                <CommandInput
                  placeholder="Type to search..."
                  value={searchQuery}
                  onValueChange={handleSelectSuggestion}
                  className="h-8 sm:h-10 text-sm sm:text-base"
                />

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
                        <span className="text-sm sm:text-base">
                          {suggestion}
                        </span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </DialogContent>
          </Dialog>
        </div>
      )}

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute top-0 right-0 h-full w-80 bg-white shadow-lg z-30 overflow-y-auto overflow-x-auto"
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-black">Menu</h2>
                <Button
                  onClick={() => setIsMenuOpen(false)}
                  className="text-black bg-transparent border-none hover:bg-transaparent focus:outline-none"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <nav className="space-y-2">
                {["About", "Contact", "Login", "Sign Up"].map((item) => (
                  <Button
                    key={item}
                    asChild
                    variant="ghost"
                    className="w-full justify-start text-black hover:text-white hover:bg-black transition-all duration-300"
                  >
                    <a href={`/${item.toLowerCase().replace(" ", "")}`}>
                      {item}
                    </a>
                  </Button>
                ))}
              </nav>

              <div className="mt-6">
                <Link href={"/about"}>
                  <Button className="w-full bg-black text-white hover:bg-gray-800 transition-all duration-300">
                    <Heart className="h-5 w-5 mr-2" />
                    Support Our Cause
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
