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
    elementType: "geometry",
    stylers: [{ color: "#1a202c" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#2c5282" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#4a5568" }],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#3182ce" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#3182ce" }],
  },
  {
    featureType: "landscape",
    elementType: "geometry",
    stylers: [{ color: "#2d3748" }],
  },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [{ color: "#3182ce" }],
  },
  {
    featureType: "all",
    elementType: "labels.text.fill",
    stylers: [{ color: "#e2e8f0" }],
  },
  {
    featureType: "all",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#1a202c" }],
  },
];

const quickNavLocations = [
  { name: "New Delhi", lat: 28.6139, lng: 77.209 },
  { name: "Mumbai", lat: 19.076, lng: 72.8777 },
  { name: "Kolkata", lat: 22.5726, lng: 88.3639 },
  { name: "Chennai", lat: 13.0827, lng: 80.2707 },
];

const organizationTypes = [
  "Community Services",
  "Youth Services",
  "Animal Services",
  "Environmental Services",
];

export default function SocialConnectMap() {
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [hoveredOrg, setHoveredOrg] = useState<Organization | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredOrgs, setFilteredOrgs] = useState(organizations);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mapType, setMapType] = useState<google.maps.MapTypeId | null>(null);
  const [showSatelliteView, setShowSatelliteView] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // You can add more complex search logic here if needed
  };

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

      <div className="absolute top-4 left-4 right-20 z-10">
        <form onSubmit={handleSearch} className="flex items-center">
          <Input
            ref={searchInputRef}
            type="text"
            placeholder="Search for social work organizations or categories..."
            className="flex-grow rounded-l-full border-2 border-blue-500 bg-gray-800 text-white placeholder-gray-400 focus:border-blue-400 h-12"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button
            type="submit"
            className="rounded-r-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 h-12 px-6 transition-all duration-300"
          >
            <Search className="h-5 w-5" />
          </Button>
        </form>
      </div>

      <div className="absolute top-20 left-5 z-10 flex space-x-3 items-center">

        {quickNavLocations.map((location) => (
          <TooltipProvider key={location.name}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-28 bg-gray-800 rounded-full text-blue-400 hover:bg-blue-700 hover:text-white transition-all duration-300"
                  onClick={() => handleQuickNav(location)}
                >
                  <MapPin className="h-4 w-4" />
                  {location.name}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Navigate to {location.name}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}

        {organizationTypes.map((type) => (
          <Button
            key={type}
            variant={selectedType === type ? "default" : "outline"}
            size="sm"
            className="w-40 rounded-full bg-gray-800 text-blue-400 hover:bg-blue-700 hover:text-white transition-all duration-300"
            onClick={() =>
              setSelectedType(selectedType === type ? null : type)
            }
          >
            {type}
          </Button>
        ))}

      </div>


      <div className="absolute bottom-8 left-4 z-10 space-x-2">
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
      </div>

      <Button
        variant="outline"
        className="absolute top-4 right-4 z-20 h-11 rounded-full bg-gray-800 text-blue-400 hover:bg-blue-700 hover:text-white transition-all duration-300"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      <Link href={"create-org"}>
        <Button
          variant="default"
          className="absolute bottom-8 right-20 z-20 h-14 rounded-full bg-green-600 hover:bg-green-700 text-white transition-all duration-300"
          onClick={handleCreateOrganization}
        >
          <Plus className="h-5 w-5 mr-2" />
          Create Organization
        </Button>
      </Link>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute top-0 right-0 h-full w-80 bg-gray-800 shadow-lg z-30 overflow-y-auto overflow-x-auto"
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-blue-400">Menu</h2>
                <Button

                  onClick={() => setIsMenuOpen(false)}
                  className="text-blue-400 bg-transparent hover:bg-transparent border-none"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <nav className="space-y-2">
                <Button
                  asChild
                  variant="ghost"
                  className="w-full justify-start text-blue-300 hover:text-blue-200 hover:bg-blue-700 transition-all duration-300"
                >
                  <a href="/aboutpage">About</a>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className="w-full justify-start text-blue-300 hover:text-blue-200 hover:bg-blue-700 transition-all duration-300"
                >
                  <a href="/contact">Contact</a>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className="w-full justify-start text-blue-300 hover:text-blue-200  hover:bg-blue-700 transition-all duration-300"
                >
                  <a href="/login">Login</a>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className="w-full justify-start text-blue-300 hover:text-blue-200 hover:bg-blue-700 transition-all duration-300"
                >
                  <a href="/signup">Sign Up</a>
                </Button>
              </nav>
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-blue-400 mb-2">
                  Map Settings
                </h3>
                <Button
                  variant="outline"
                  className="w-full justify-start text-black  transition-all duration-300"
                  onClick={toggleSatelliteView}
                >
                  <Layers className="h-5 w-5 mr-2" />
                  {showSatelliteView
                    ? "Hide Satellite View"
                    : "Show Satellite View"}
                </Button>
              </div>
              <div className="mt-6">
                <Button className="w-full bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white transition-all duration-300">
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
