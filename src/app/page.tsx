"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
  OverlayView,
} from "@react-google-maps/api";
import { motion, AnimatePresence } from "framer-motion";
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
    category: "Community Services",
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
    category: "Family Services",
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
    category: "Youth Services",
  },
];

const mapStyles = [
  {
    featureType: "all",
    elementType: "geometry.fill",
    stylers: [{ color: "#f1f1f1" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#e9e9e9" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9e9e9e" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#ffffff" }],
  },
  {
    featureType: "road.arterial",
    elementType: "labels.text.fill",
    stylers: [{ color: "#757575" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#dadada" }],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#eeeeee" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#757575" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#e5e5e5" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9e9e9e" }],
  },
  {
    featureType: "transit.line",
    elementType: "geometry",
    stylers: [{ color: "#e5e5e5" }],
  },
  {
    featureType: "transit.station",
    elementType: "geometry",
    stylers: [{ color: "#eeeeee" }],
  },
];

const quickNavLocations = [
  { name: "New Delhi", lat: 28.6139, lng: 77.209 },
  { name: "Mumbai", lat: 19.076, lng: 72.8777 },
  { name: "Kolkata", lat: 22.5726, lng: 88.3639 },
  { name: "Chennai", lat: 13.0827, lng: 80.2707 },
];

const organizationTypes = ["Humans", "Animals", "Plants"];

const tags = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Kolkata",
  "Chennai",
  "NGO",
  "Environment",
  "Women Empowerment",
  "Animal Welfare",
];

const handleCreateOrganization = () => {
  // Implement the logic to create a new organization
  console.log("Create new organization");
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

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    const filtered = searchSuggestions.filter((suggestion) =>
      suggestion.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredSuggestions(filtered);
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
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
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
                url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
              }}
            />
            {hoveredOrg === org && (
              <OverlayView
                position={{ lat: org.lat, lng: org.lng }}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
              >
                <Card className="w-64 bg-gray-800 border-blue-500 shadow-lg">
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg text-white">
                      {org.name}
                    </CardTitle>
                    <CardDescription className="text-gray-300">
                      {org.category}
                    </CardDescription>
                    <CardDescription className="text-gray-300">
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
            <Card className="w-80 bg-gray-800 border-blue-500 shadow-lg">
              <CardHeader className="p-4 bg-gradient-to-r from-blue-600 to-blue-800">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl text-white">
                      {selectedOrg.name}
                    </CardTitle>
                    <Badge
                      variant="secondary"
                      className="mt-1 bg-blue-500 text-white"
                    >
                      {selectedOrg.category}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:text-blue-200 -mt-2 -mr-2"
                    onClick={() => setSelectedOrg(null)}
                  >
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <p className="text-sm text-gray-300">
                  {selectedOrg.description}
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-gray-300">
                    <Phone className="h-4 w-4 mr-2 text-blue-400" />
                    <span className="text-sm">{selectedOrg.phone}</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Mail className="h-4 w-4 mr-2 text-blue-400" />
                    <span className="text-sm">{selectedOrg.email}</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <DollarSign className="h-4 w-4 mr-2 text-green-400" />
                    <span className="text-sm">{selectedOrg.donationInfo}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 transition-colors duration-300">
                  View Full Profile
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </InfoWindow>
        )}
      </GoogleMap>

      <div className="absolute top-20 left-5 right-5 z-10 flex justify-between items-center">
        <div className="flex-grow flex justify-center space-x-4">
          {organizationTypes.map((type) => (
            <Button
              key={type}
              variant={selectedType === type ? "default" : "outline"}
              size="sm"
              className={`w-28 rounded-full transition-all duration-300 ${
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

        {/* Total Projects */}
        {!isMobileDevice && (
          <div className="flex items-center space-x-2 text-sm font-semibold text-blue-400 bg-gray-800 px-4 py-2 rounded-full transition-all duration-300">
            <span>Total Projects: </span>
            <span className="text-sm">{"3"}</span>
          </div>
        )}
      </div>

      <div className="absolute bottom-8 left-4 z-10 space-x-2">
        {!isMobileDevice && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-gray-800 text-blue-400 hover:bg-blue-700 hover:text-white transition-all duration-300"
                  onClick={toggleSatelliteView}
                >
                  <Layers className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {showSatelliteView
                    ? "Hide Satellite View"
                    : "Show Satellite View"}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-gray-800 text-blue-400 hover:bg-blue-700 hover:text-white transition-all duration-300"
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
                className="rounded-full bg-gray-800 text-blue-400 hover:bg-blue-700 hover:text-white transition-all duration-300"
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
                  className="rounded-full bg-gray-800 text-blue-400 hover:bg-blue-700 hover:text-white transition-all duration-300"
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

      <Button
        variant="outline"
        className="absolute top-4 right-4 z-20 h-11 rounded-full bg-gray-800 text-blue-400 hover:bg-blue-700 hover:text-white transition-all duration-300"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 space-y-4">
        <Link href="/create-org">
          <Button
            variant="default"
            className="h-14 w-2/3 rounded-full bg-green-600 hover:bg-green-700 text-white transition-all duration-300"
            onClick={handleCreateOrganization}
          >
            <Plus className="h-5 w-5 mr-1" />
            Create Your Project
          </Button>
        </Link>

        <Button
          variant="default"
          className="h-14 w-2/3 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300"
          onClick={() => setIsSearchOpen(true)}
        >
          <Search className="h-5 w-5 mr-1" />
          Search
        </Button>

        <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
          <DialogContent className="sm:max-w-[700px] h-[85vh]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center mb-4">
                Search Organizations
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="cursor-pointer hover:bg-blue-100 transition-colors"
                >
                  {tag}
                </Badge>
              ))}
            </div>
            <Command className="rounded-lg border shadow-md">
              <CommandInput
                placeholder="Type to search..."
                value={searchQuery}
                onValueChange={handleSearch}
                className="h-14 text-lg"
              />
              <CommandList className="h-[calc(60vh-120px)] overflow-y-auto">
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  {filteredSuggestions.map((suggestion) => (
                    <CommandItem
                      key={suggestion}
                      onSelect={() => handleSelectSuggestion(suggestion)}
                      className="flex cursor-pointer hover:bg-blue-100 py-2 flex-row"
                    >
                      <Search className="mr-2 mt-1 h-4 w-4" />
                      <span>{suggestion}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </DialogContent>
        </Dialog>
      </div>

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
                <h3 className="text-lg font-semibold text-black mb-2">
                  Map Settings
                </h3>
                <Button
                  variant="outline"
                  className="w-full justify-start text-black hover:text-white hover:bg-black border-black transition-all duration-300"
                  onClick={toggleSatelliteView}
                >
                  <Layers className="h-5 w-5 mr-2" />
                  {showSatelliteView
                    ? "Hide Satellite View"
                    : "Show Satellite View"}
                </Button>
              </div>
              <div className="mt-6">
                <Button className="w-full bg-black text-white hover:bg-gray-800 transition-all duration-300">
                  <Heart className="h-5 w-5 mr-2" />
                  Support Our Cause
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
