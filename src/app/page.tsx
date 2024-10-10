"use client";
import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  MapPin,
  Phone,
  Mail,
  DollarSign,
  Menu,
  Maximize2,
  Minimize2,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

interface MapContainerStyle {
  width: string;
  height: string;
}

interface LatLng {
  lat: number;
  lng: number;
}

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
}

const center: LatLng = {
  lat: 40.7128,
  lng: -74.006,
};

const organizations: Organization[] = [
  {
    id: 1,
    name: "Social Work Org 1",
    lat: 40.7128,
    lng: -74.006,
    description: "Helping communities thrive",
    phone: "+1 (555) 123-4567",
    email: "contact@org1.com",
    donationInfo: "Support our cause with a donation",
    avatar: "/api/placeholder/40/40",
  },
  {
    id: 2,
    name: "Social Work Org 2",
    lat: 40.72,
    lng: -74.01,
    description: "Supporting families in need",
    phone: "+1 (555) 987-6543",
    email: "info@org2.com",
    donationInfo: "Your donation makes a difference",
    avatar: "/api/placeholder/40/40",
  },
  {
    id: 3,
    name: "Social Work Org 3",
    lat: 40.73,
    lng: -73.99,
    description: "Empowering youth through education",
    phone: "+1 (555) 246-8135",
    email: "hello@org3.com",
    donationInfo: "Help us empower the next generation",
    avatar: "/api/placeholder/40/40",
  },
];

const HomePage: React.FC = () => {
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [hoveredOrg, setHoveredOrg] = useState<Organization | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isMapMaximized, setIsMapMaximized] = useState<boolean>(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const mapContainerStyle: MapContainerStyle = {
    width: "100%",
    height: isMapMaximized ? "80vh" : "50vh",
  };

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
    if (map) {
      const listener = map.addListener("click", () => {
        setSelectedOrg(null);
        setHoveredOrg(null);
      });
      return () => google.maps.event.removeListener(listener);
    }
  }, [map]);

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== "undefined") {
        if (window.scrollY > lastScrollY) {
          // if scroll down hide the navbar
          setIsNavbarVisible(false);
        } else {
          // if scroll up show the navbar
          setIsNavbarVisible(true);
        }
        // remember current page location to use in the next move
        setLastScrollY(window.scrollY);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", controlNavbar);

      // cleanup function
      return () => {
        window.removeEventListener("scroll", controlNavbar);
      };
    }
  }, [lastScrollY]);

  const toggleMapSize = () => {
    setIsMapMaximized(!isMapMaximized);
  };

  return (
    <div className="min-h-screen bg-white bg-cover bg-center">
      <motion.header
        className={`bg-[#F9FAFB] shadow-md sticky top-0 z-10 transition-all duration-400 ${
          isNavbarVisible ? "translate-y-0" : "-translate-y-full"
        }`}
        initial={false}
        animate={{ y: isNavbarVisible ? 0 : -100 }}
        transition={{ duration: 0.3 }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex items-center"
            >
              <h1
                className="text-5xl font-bold text-black"
                style={{
                  fontFamily:
                    "Inter, ui-sans-serif, system-ui, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji",
                  fontSize: "30px",
                  lineHeight: "50px",
                  fontWeight: 700,
                }}
              >
                SocialConnect
              </h1>
            </motion.div>
            <nav className="hidden md:flex space-x-4">
              <Button
                asChild
                variant="ghost"
                className="text-[#2196F3] hover:text-[#1B2250] text-base"
              >
                <Link href="/org-dashboard">Dashboard</Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                className="text-[#2196f3] hover:text-[#1B2250] text-base"
              >
                <Link href="/admin">Admin</Link>
              </Button>
            </nav>
            <Button
              variant="ghost"
              className="md:hidden text-[#2196F3]"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu />
            </Button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white shadow-md md:hidden"
          >
            <nav className="container mx-auto px-4 py-2 flex flex-col space-y-2">
              <Button asChild variant="ghost" className="w-full">
                <Link href="/org-dashboard">Dashboard</Link>
              </Button>
              <Button asChild variant="ghost" className="w-full">
                <Link href="/admin">Admin</Link>
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2
            className="text-4xl font-bold text-[#2196F3] mb-4"
            style={{
              fontFamily:
                '"Inter", ui-sans-serif, system-ui, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji',
              fontSize: "60px",
              lineHeight: "74px",
              fontWeight: 700,
            }}
          >
            Find Social Workers Near You
          </h2>
          <p className="text-xl text-[#14171A] mb-8 font-family-inter">
            Connect with professionals dedicated to making a difference in your
            community
          </p>
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <Input
                placeholder="Enter your location..."
                className="flex-grow text-lg py-6 rounded-full"
              />
              <Button className="bg-[#2196F3] hover:bg-[#465ade] text-white text-lg py-6 px-8 rounded-full">
                <Search className="mr-2 h-5 w-5" /> Search
              </Button>
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full text-[#2196F3] border-[#2196F3] hover:bg-[#2196F3] hover:text-white"
              >
                New Delhi
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full text-[#2196F3] border-[#2196F3] hover:bg-[#2196F3] hover:text-white"
              >
                Mumbai
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full text-[#2196F3] border-[#2196F3] hover:bg-[#2196F3] hover:text-white"
              >
                Kolkata
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full text-[#2196F3] border-[#2196F3] hover:bg-[#2196F3] hover:text-white"
              >
                Bangalore
              </Button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Card className="shadow-xl bg-white overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between bg-[#2196F3] text-white">
              <div
                style={{
                  fontFamily:
                    '"Inter", ui-sans-serif, system-ui, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji',
                  fontSize: "30px",
                  lineHeight: "44px",
                  fontWeight: 700,
                }}
              >
                <CardTitle className="text-2xl">
                  Social Work Organizations Map
                </CardTitle>
                <CardDescription className="text-gray-200">
                  Interactive map showing social worker locations
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMapSize}
                className="text-white hover:text-[#1B2250]"
              >
                {isMapMaximized ? <Minimize2 /> : <Maximize2 />}
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {isLoaded ? (
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={center}
                  zoom={10}
                  onLoad={onLoad}
                  onUnmount={onUnmount}
                  options={{
                    styles: [
                      {
                        featureType: "all",
                        elementType: "geometry",
                        stylers: [{ color: "#E6EEFF" }],
                      },
                      {
                        featureType: "water",
                        elementType: "geometry",
                        stylers: [{ color: "#A5C0FF" }],
                      },
                      {
                        featureType: "road",
                        elementType: "geometry",
                        stylers: [{ color: "#FFFFFF" }],
                      },
                    ],
                  }}
                >
                  {organizations.map((org) => (
                    <Marker
                      key={org.id}
                      position={{ lat: org.lat, lng: org.lng }}
                      onClick={() => setSelectedOrg(org)}
                      onMouseOver={() => setHoveredOrg(org)}
                      onMouseOut={() => setHoveredOrg(null)}
                      icon={{
                        url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                      }}
                    />
                  ))}
                  {hoveredOrg && !selectedOrg && (
                    <InfoWindow
                      position={{ lat: hoveredOrg.lat, lng: hoveredOrg.lng }}
                      options={{
                        pixelOffset: new window.google.maps.Size(0, -40),
                      }}
                    >
                      <div className="p-2 max-w-xs">
                        <h3 className="text-lg font-semibold text-[#2196F3]">
                          {hoveredOrg.name}
                        </h3>
                        <p className="text-sm text-[#14171A]">
                          {hoveredOrg.description}
                        </p>
                      </div>
                    </InfoWindow>
                  )}
                  {selectedOrg && (
                    <InfoWindow
                      position={{ lat: selectedOrg.lat, lng: selectedOrg.lng }}
                      onCloseClick={() => setSelectedOrg(null)}
                    >
                      <div className="p-4 max-w-sm">
                        <h3 className="text-xl font-semibold mb-2 text-[#2196F3]">
                          {selectedOrg.name}
                        </h3>
                        <p className="text-sm mb-3 text-[#14171A]">
                          {selectedOrg.description}
                        </p>
                        <div className="flex items-center mb-2">
                          <MapPin className="h-4 w-4 mr-2 text-[#1B2250]" />
                          <span className="text-sm">{`${selectedOrg.lat.toFixed(
                            4
                          )}, ${selectedOrg.lng.toFixed(4)}`}</span>
                        </div>
                        <div className="flex items-center mb-2">
                          <Phone className="h-4 w-4 mr-2 text-[#1B2250]" />
                          <span className="text-sm">{selectedOrg.phone}</span>
                        </div>
                        <div className="flex items-center mb-3">
                          <Mail className="h-4 w-4 mr-2 text-[#1B2250]" />
                          <span className="text-sm">{selectedOrg.email}</span>
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-2 text-[#2196F3]" />
                          <span className="text-sm text-[#2196F3]">
                            {selectedOrg.donationInfo}
                          </span>
                        </div>
                        <Button className="mt-3 w-full bg-[#2196F3] hover:bg-[#1B2250] text-white">
                          View Full Profile
                        </Button>
                      </div>
                    </InfoWindow>
                  )}
                </GoogleMap>
              ) : (
                <div className="h-[500px] flex items-center justify-center">
                  <p className="text-xl text-[#2196F3]">Loading map...</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mt-16"
        >
          <h2
            className="text-3xl font-bold text-[#2196F3] mb-8 text-center"
            style={{
              fontFamily:
                '"Inter", ui-sans-serif, system-ui, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji',
              fontSize: "50px",
              lineHeight: "74px",
              fontWeight: 700,
            }}
          >
            Featured Organizations
          </h2>
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            style={{
              fontFamily:
                '"Inter", ui-sans-serif, system-ui, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji',
              fontSize: "16px",
              lineHeight: "24px",
              fontWeight: 400,
            }}
          >
            {organizations.map((org) => (
              <Card
                key={org.id}
                className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
              >
                <CardHeader className="bg-[#2196F3] text-white">
                  <CardTitle className="text-xl">{org.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-[#14171A] mb-4">{org.description}</p>
                  <div className="flex items-center mb-2">
                    <Phone className="h-4 w-4 mr-2 text-[#1B2250]" />
                    <span className="text-sm">{org.phone}</span>
                  </div>
                  <div className="flex items-center mb-2">
                    <Mail className="h-4 w-4 mr-2 text-[#1B2250]" />
                    <span className="text-sm">{org.email}</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-[#2196F3]" />
                    <span className="text-sm text-[#2196F3]">
                      {org.donationInfo}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="bg-[#F9FAFB]">
                  <Button className="w-full bg-[#2196f3] hover:bg-[#1B2250] text-white">
                    View Full Profile <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </motion.div>
      </main>

      <footer
        className="bg-[#F9FAFB] text-black border-t border-gray-200"
        style={{
          fontFamily:
            '"Inter", ui-sans-serif, system-ui, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji',
          fontSize: "16px",
          lineHeight: "24px",
          fontWeight: 400,
        }}
      >
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Branding Section */}
            <div className="mb-8 md:mb-0 text-center md:text-left">
              <h3
                className="text-2xl font-bold mb-2"
                style={{
                  fontFamily:
                    '"Avenir Next", "Helvetica Neue", "Helvetica", "Arial", sans-serif',
                  fontSize: "30px",
                  lineHeight: "44px",
                  fontWeight: 700,
                }}
              >
                SocialConnect
              </h3>
              <p className="text-blue-500 border-spacing-2 font-bold">
                Connecting communities with social work professionals
              </p>
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-wrap justify-center md:justify-end space-x-8">
              <Link
                href="/about"
                className="hover:text-blue-500 hover:underline transition-all duration-300"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="hover:text-blue-500 hover:underline transition-all duration-300"
              >
                Contact
              </Link>
              <Link
                href="/privacy"
                className="hover:text-blue-500 hover:underline transition-all duration-300"
              >
                Privacy Policy
              </Link>
            </nav>
          </div>

          {/* Divider */}
          <hr className="my-8 border-gray-300" />

          {/* Copyright Section */}
          <div className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Social Worker Locator. All rights
            reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
