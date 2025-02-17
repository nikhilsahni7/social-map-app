"use client";
import React from "react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaArrowCircleLeft, FaArrowCircleRight } from "react-icons/fa";
import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import { CommentSection } from "@/components/Comments";
import { Loader2, ChevronRight, Share, LogOut } from "lucide-react";
import { Mail } from 'lucide-react';
import "react-vertical-timeline-component/style.min.css";
import { FaCalendarAlt, FaFlag, FaProjectDiagram } from "react-icons/fa";
import {
  Target,
  Calendar,
  Award,
  Briefcase,
  Heart,
  MapPin,
  Clock,
  Package,
  Plus,
  Minus,
} from "lucide-react";
import { Search, X, Menu, ZoomIn, ZoomOut, Compass, LogIn } from "lucide-react";
import { getAuthToken, getAuthUser, logout } from "@/lib/clientAuth";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { UserCircle, UserPlus } from 'lucide-react';
import { Info, HelpCircle } from 'lucide-react';


interface ProjectData {
  _id: string;
  firstName: string;
  lastName: string;
  title: string;
  objective: string;
  category: string;
  duration: {
    startDate: string;
    endDate: string;
  };
  description: string;
  supportItems: Array<{
    item: string;
    quantity: string;
    byWhen: string;
    dropLocation: string;
    supportProvided: number;
  }>;
  otherSupport: string;
  pictureOfSuccess?: {
    url: string;
  };
  timestamps: string;
  likeCount: number;
  location: {
    address: string;
  };
}

interface Supporter {
  name: string;
  profileUrl: string;
}

interface SupportNotification {
  _id: string;
  sender: {
    _id: string;
    name: string;
    avatar: string;
  };
  message: string;
  createdAt: string;
}

interface CurrentUser {
  id: string;
}

export default function ProjectDetails({ params }: { params: { id: string } }) {
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSupporting, setIsSupporting] = useState(false);
  const [supportItems, setSupportItems] = useState<Record<string, number>>({});
  const [totalSupport, setTotalSupport] = useState(0);
  const [showSupportSection, setShowSupportSection] = useState(false);
  const [relatedProjects, setRelatedProjects] = useState<ProjectData[]>([]);
  const [supporters, setSupporters] = useState<Supporter[]>([]);
  const [supportNotifications, setSupportNotifications] = useState<SupportNotification[]>([]);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);

  const router = useRouter();

  const [isMobile, setIsMobile] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  useEffect(() => {
    setToken(getAuthToken());
    setUser(getAuthUser());
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // Adjust this breakpoint as needed
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const response = await fetch(`/api/projects/${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch project data");
        }
        const data = await response.json();
        setProjectData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [params.id]);

  useEffect(() => {
    if (projectData) {
      const fetchRelatedProjects = async () => {
        try {
          const response = await fetch(`/api/projects/${params.id}/related`);
          if (!response.ok) {
            throw new Error("Failed to fetch related projects");
          }
          const data = await response.json();
          setRelatedProjects(data);
        } catch (err) {
          console.error(err);
        }
      };

      fetchRelatedProjects();
    }
  }, [projectData, params.id]);

  // Function to check if the user is authenticated
  const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    return !!token;
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
    }
  }, []);

  const fetchSupporters = async () => {
    try {
      const response = await fetch(`/api/projects/${params.id}/supporters`);
      if (!response.ok) {
        throw new Error("Failed to fetch supporters");
      }
      const data = await response.json();
      setSupporters(data);
    } catch (err) {
      console.error("Error fetching supporters:", err);
    }
  };

  useEffect(() => {
    fetchSupporters();
  }, [params.id]);

  const updateItemQuantity = (item: string, delta: number) => {
    setSupportItems((prev) => {
      const currentQty = prev[item] || 0;
      const newQty = Math.max(0, Math.min(currentQty + delta));

      if (newQty === 0) {
        const { [item]: _, ...rest } = prev;
        setTotalSupport(Object.values(rest).reduce((sum, qty) => sum + qty, 0));
        return rest;
      }

      const newItems = { ...prev, [item]: newQty };
      setTotalSupport(
        Object.values(newItems).reduce((sum, qty) => sum + qty, 0)
      );
      return newItems;
    });
  };

  

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // Adjust this breakpoint as needed
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const CurvedText = () => {
    const text = "Provoke Goodness";
    const radius = 30;
    
    return (
      <div className="relative w-24 h-24 scale-125 ml-14 -mt-5">
        {text.split('').map((char, i) => {
          const angle = (i * 360 / text.length);
          const radian = angle * (Math.PI / 180);
          const x = radius * Math.cos(radian);
          const y = radius * Math.sin(radian);
          
          return (
            <span
              key={i}
              className="absolute text-blue-600 font-semibold text-sm transform-gpu"
              style={{
                left: `${50 + x}%`,
                top: `${50 + y}%`,
                transform: `rotate(${angle + 90}deg)`,
              }}
            >
              {char}
            </span>
          );
        })}
      </div>
    );
  };
  

  const getSupportSummary = () => {
    if (totalSupport === 0) return "Select items to support";
    const items = Object.entries(supportItems)
      .filter(([_, qty]) => qty > 0)
      .map(([item, qty]) => `${qty}x ${item}`)
      .join(", ");
    return `Supporting: ${items}`;
  };

  const handleSupport = async () => {
    try {
      setIsSupporting(true);

      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to support this project');
        router.push('/login');
        return;
      }

      // Convert supportItems to the correct format
      const supportData = Object.entries(supportItems).reduce((acc: Record<string, number>, [item, qty]) => {
        if (qty > 0) {
          acc[item] = qty;
        }
        return acc;
      }, {});

      const response = await fetch(`/api/projects/${params.id}/support`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          supportItems: supportData,
          additionalSupport
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit support");
      }

      // Reset all form fields and states
      setSupportItems({});
      setAdditionalSupport("");
      setTotalSupport(0);
      setShowSupportSection(false);

      // Show success notification
      toast.success("Support submitted successfully!");

      // Optionally refresh the project data
      const updatedData = await fetch(`/api/projects/${params.id}`).then(res => res.json());
      setProjectData(updatedData);

    } catch (error) {
      console.error("Error submitting support:", error);
      toast.error("Failed to submit support");
    } finally {
      setIsSupporting(false);
    }
  };

  const toggleSupportSection = () => {
    setShowSupportSection(!showSupportSection);
  };
  const [additionalSupport, setAdditionalSupport] = useState("")

  const fetchSupportNotifications = async () => {
    try {
      const res = await fetch(`/api/users/${currentUser?.id}/support/notifications`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();

      // Filter notifications for current project
      const projectNotifications = data.notifications.filter(
        (notif: { project?: { _id: string } }) => notif.project?._id === params.id
      );

      setSupportNotifications(projectNotifications);
    } catch (error) {
      console.error("Failed to fetch support notifications:", error);
    }
  };

  useEffect(() => {
    const user = getAuthUser();
    setCurrentUser(user);
  }, []);

  useEffect(() => {
    if (currentUser?.id) {
      fetchSupportNotifications();
    }
  }, [currentUser?.id, params.id]);

  if (loading) {
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

  if (error || !projectData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-6 max-w-md mx-auto">
          <div className="text-red-500 flex flex-col items-center gap-4">
            <span className="text-4xl">⚠️</span>
            <p className="text-lg font-medium">Error: {error}</p>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="mt-4"
            >
              Try Again
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm shadow-md">
          <div className="max-w-7xl mx-auto px-4 py-2">
            <div className="flex items-center justify-between">
              {/* Logo and Slogan Section */}
              {!isMobile && (
              <div className="flex items-center gap-4">
                <button onClick={() => router.push("/")}>
                  <Image
                    src="/logo.png"
                    alt="logo"
                    width={65}
                    height={80}
                    className="object-contain"
                  />
                  <span className='text-sm font-bold text-blue-700'>Did<span className='text-sm font-bold text-yellow-500'>My</span>Bit</span>
                </button>
                <div className="hidden md:block">
                  <p className="text-blue-600 font-semibold text-lg">DidMyBit</p>
                  <p className="text-gray-600 text-sm">Make an impact, one bit at a time</p>
                </div>
                <div className="hidden md:block ml-36">
                  <p className="text-blue-600 font-semibold text-lg">Find Someone to Support you Bit!</p>
                  <p className="text-gray-600 text-sm">Find any social project one the map</p>
                </div>
              </div>
              )}

              {isMobile && (
        <div className='flex flex-row items-start ml-4'>
          <div className="flex flex-col items-center">
            <Image 
              src="/logo.png"
              alt="logo"
              width={60}
              height={80}
              className="object-contain -py-4"
            />
            <span className='text-sm font-bold text-blue-700 ml-2'>
              Did<span className='text-sm font-bold text-yellow-500'>My</span>Bit
            </span>
          </div>
          <div className="scale-75">
            <CurvedText />
          </div>
          
        </div>
      )}

              <div className="flex items-center gap-3">
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-white hover:bg-gray-100 p-2 rounded-full shadow-sm hover:shadow-md transition-all duration-300"
                  onClick={() => {
                    setIsMenuOpen(!isMenuOpen);

                  }}
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </div>

              
            </div>
          </div>
        </div>


      <div className="w-full">
        <div className="relative mt-24">
          <div className="bg-white rounded-b-2xl shadow-lg p-8 backdrop-blur-lg bg-white/90">
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
              <div className="flex flex-row items-center gap-4">
                <Avatar className="w-16 h-16 md:mb-0 mb-8 md:w-32 md:h-32 border-4 border-white shadow-xl ring-4 ring-blue-500/20">
                  <AvatarFallback className="text-xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 text-white">
                    {projectData.firstName[0]}
                    {projectData.lastName[0]}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-4">
                  {!isMobile && (
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1">
                        {projectData.category}
                      </Badge>
                    </div>
                  )}

                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      {projectData.firstName} {projectData.lastName}
                    </h1>
                    <p className="text-xl text-blue-600 font-medium mt-1">
                      {projectData.title}
                    </p>
                    <div className="flex items-center gap-4 text-gray-600">
                      <div className="flex items-center gap-1">
                        ❤️
                        <span>{projectData.likeCount || 0}</span>
                      </div>
                      <div className="relative">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center gap-1 text-sm hover:bg-gray-100 hover:text-green-600 transition-colors duration-200 text-green-600"
                          onClick={() => setIsShareOpen(!isShareOpen)}
                        >
                          <Share className="h-4 w-4" />
                          Share
                        </Button>

                        <AnimatePresence>
                          {isShareOpen && (
                            <>
                              <div
                                className="fixed inset-0 z-40"
                                onClick={() => setIsShareOpen(false)}
                              />
                              <motion.div
                                initial={{ opacity: 0, x: -20, scale: 0.95 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: -20, scale: 0.95 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg py-2 z-50 border border-gray-100"
                              >
                                <div className="px-3 py-2 border-b border-gray-100">
                                  <p className="text-sm font-medium text-gray-700">Share via</p>
                                </div>

                                <button
                                  className="w-full px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors duration-200"
                                  onClick={() => {
                                    navigator.clipboard.writeText(window.location.href);
                                    toast.success('Link copied to clipboard!', {
                                      icon: '✅',
                                      style: {
                                        borderRadius: '10px',
                                        background: '#fffff',
                                        color: 'black',
                                      },
                                    });
                                    setIsShareOpen(false);
                                  }}
                                >
                                  <Share className="h-4 w-4" />
                                  Copy Link
                                </button>

                                <button
                                  className="w-full px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors duration-200"
                                  onClick={() => {
                                    const text = `Check out this project: ${projectData.title}\n\nObjective: ${projectData.objective}\n\nSupport needed! View more at: ${window.location.href}`;
                                    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
                                    window.open(whatsappUrl, '_blank');
                                    setIsShareOpen(false);
                                  }}
                                >
                                  <svg
                                    viewBox="0 0 24 24"
                                    className="h-4 w-4 fill-current text-green-600"
                                  >
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                  </svg>
                                  WhatsApp
                                </button>

                                <button
                                  className="w-full px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors duration-200"
                                  onClick={() => {
                                    const text = `Check out this amazing project: ${projectData.title}\n\nSupport needed! View more at: ${window.location.href}`;
                                    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
                                    setIsShareOpen(false);
                                  }}
                                >
                                  <svg
                                    viewBox="0 0 24 24"
                                    className="h-4 w-4 fill-current text-black"
                                  >
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                  </svg>
                                  X (Twitter)
                                </button>

                                <button
                                  className="w-full px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors duration-200"
                                  onClick={() => {
                                    const url = window.location.href;
                                    window.open(`https://www.instagram.com/share?url=${encodeURIComponent(url)}`, '_blank');
                                    setIsShareOpen(false);
                                  }}
                                >
                                  <svg
                                    viewBox="0 0 24 24"
                                    className="h-4 w-4 fill-current text-pink-600"
                                  >
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.281-.059 1.689-.073 4.948-.073zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                  </svg>
                                  Instagram
                                </button>
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Project Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6 space-y-16">
              {/* Project Objective */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <FaFlag className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <Label className="text-md font-medium text-blue-600">
                    Project Objective
                  </Label>
                  <p className="mt-2 text-gray-700 leading-relaxed">
                    {projectData.objective}
                  </p>
                </div>
              </div>

              {/* Project Description */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <FaProjectDiagram className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <Label className="text-md font-medium text-blue-600">
                    Project Description
                  </Label>
                  <p className="mt-2 text-gray-700 leading-relaxed">
                    {projectData.description}
                  </p>
                </div>
              </div>

              {/* Timeline */}
              <div className="w-full px-4">
                <div className="flex flex-row items-center justify-between">
                  {/* Start Date Section */}
                  <div className="flex flex-col items-center">
                    <div className="text-sm text-gray-500 mb-2">Start</div>
                    <div className="text-lg font-semibold text-blue-700 px-2 py-1 rounded-md shadow-sm">
                      {new Date(projectData.duration.startDate).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </div>
                  </div>

                  {/* End Date Section */}
                  <div className="flex flex-col items-center">
                    <div className="text-sm text-gray-500 mb-2">End</div>
                    <div className="text-lg font-semibold text-blue-700 px-2 py-1 rounded-md shadow-sm">
                      {new Date(projectData.duration.endDate).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <Label className="text-lg font-semibold text-gray-900 block mb-4">
                Project Vision
              </Label>
              <div className="aspect-video rounded-xl overflow-hidden bg-gray-100">
                <Image
                  width={600}
                  height={400}
                  src={
                    projectData.pictureOfSuccess?.url ||
                    "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800"
                  }
                  alt="Project Success Vision"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Support Section */}
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  Support Required
                </h2>
              </div>
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <Label className="text-sm font-medium text-blue-600 block text-center md:text-left">
                  DO YOUR BIT BY SUPPORTING THIS PROJECT
                </Label>
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto group relative overflow-hidden"
                  onClick={toggleSupportSection}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    {showSupportSection ? "Close Support" : "Support Project"}
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                </Button>
              </div>
            </div>

            {/* Support Items Table */}
            {!showSupportSection && (
              <div className="space-y-4">
                <div className="hidden md:grid md:grid-cols-5 gap-4 p-4 bg-gray-50 rounded-lg font-2xl font-semibold text-gray-700">
                  <div>Items</div>
                  <div>Quantity Needed</div>
                  <div>Support Provided</div>
                  <div>Needed By</div>
                  <div>Drop Location</div>
                </div>

                {projectData.supportItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col md:grid md:grid-cols-5 gap-4 p-4 bg-white border border-gray-100 rounded-lg transition-colors hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-blue-600" />
                      <span>{item.item}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>{item.quantity}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        <span>{item.supportProvided || 0}</span>
                        <Progress
                          value={(item.supportProvided / Number(item.quantity)) * 100}
                          className="w-20 h-2"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>{new Date(item.byWhen).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{item.dropLocation}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Your Support Section - Shows when button is clicked */}
            {showSupportSection && (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="space-y-4">
                    <div className="hidden md:grid md:grid-cols-6 gap-4 p-4 bg-gray-50 rounded-lg font-2xl font-semibold text-gray-700">
                      <div>Items</div>
                      <div>Quantity Needed</div>
                      <div>Support Provided</div>
                      <div>Needed By</div>
                      <div>Drop Location</div>
                      <div>Your Support</div>
                    </div>

                    {projectData.supportItems.map((item, index) => (
                      <div
                        key={index}
                        className="flex flex-col md:grid md:grid-cols-6 gap-4 p-4 bg-white border border-gray-100 rounded-lg transition-colors hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-blue-600" />
                          <span>{item.item}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>{item.quantity}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-2">
                            <span>{item.supportProvided || 0}</span>
                            <Progress
                              value={(item.supportProvided / Number(item.quantity)) * 100}
                              className="w-20 h-2"
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span>{new Date(item.byWhen).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span>{item.dropLocation}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => updateItemQuantity(item.item, -1)}
                              disabled={!supportItems[item.item]}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>

                            <Input
                              type="number"
                              min="0"
                              max={Number(item.quantity)}
                              value={supportItems[item.item] || ''}
                              placeholder="0"
                              onChange={(e) => {
                                const value = Math.min(
                                  Math.max(0, parseInt(e.target.value) || 0),
                                  Number(item.quantity)
                                );
                                setSupportItems(prev => ({
                                  ...prev,
                                  [item.item]: value || 0
                                }));
                                setTotalSupport(
                                  Object.entries(supportItems)
                                    .reduce((sum, [key, qty]) =>
                                      key === item.item ? sum + (value || 0) : sum + (qty || 0),
                                      0
                                    )
                                );
                              }}
                              className="w-16 text-center mx-1 h-9 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />

                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => updateItemQuantity(item.item, 1)}
                              disabled={Number(supportItems[item.item]) >= Number(item.quantity)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                      <Label className="text-sm font-medium text-blue-600 block mb-2">
                        Additional Support
                      </Label>
                      <Input
                        placeholder="Enter additional support details"
                        value={additionalSupport}
                        onChange={(e) => setAdditionalSupport(e.target.value)}
                        className="w-full p-2 border rounded"
                      />
                    </div>

                    <div className="flex justify-end mt-4">
                      <div className="relative group">
                        <Button
                          size="lg"
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={handleSupport}
                          disabled={isSupporting || (totalSupport === 0 && !additionalSupport)}
                        >
                          {isSupporting ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <Heart className="w-4 h-4 mr-2" />
                              Confirm Support
                            </>
                          )}
                        </Button>

                        {/* Simple hover card */}
                        <div className="absolute bottom-full right-0 mb-2 w-64 bg-white rounded-lg shadow-lg p-4 hidden group-hover:block border border-gray-200">
                          <h4 className="text-md font-semibold mb-2">Support Summary</h4>
                          {Object.entries(supportItems).map(([item, qty]) => (
                            qty > 0 && (
                              <div key={item} className="flex justify-between text-sm py-1">
                                <span className="text-gray-600">{item}</span>
                                <span className="font-medium">x{qty}</span>
                              </div>
                            )
                          ))}
                          {additionalSupport && (
                            <div className="mt-2 pt-2 border-t border-gray-100">

                              <h4 className="text-sm font-medium mb-1">Additional Support</h4>
                              <p className="text-sm text-gray-600">{additionalSupport}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </CardContent>
        </Card>

        {/* Support Providers Card  */}
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">Support Providers</CardTitle>
            <p className="text-sm text-gray-500">People who have supported this project</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              {(showAllNotifications ? supportNotifications : supportNotifications.slice(0, 6)).map((notif: SupportNotification) => (
                <div
                  key={notif._id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Link href={`/creator-profile/${notif.sender._id}`}>
                    <Avatar className="h-8 w-8 border-2 border-white shadow-sm">
                      <AvatarImage src={notif.sender.avatar} alt={notif.sender.name} />
                      <AvatarFallback>{notif.sender.name[0]}</AvatarFallback>
                    </Avatar>
                  </Link>
                  <div className="flex-1">
                    <Link href={`/creator-profile/${notif.sender._id}`}>
                      <h4 className="text-sm font-medium text-blue-600 hover:underline">
                        {notif.sender.name}
                      </h4>
                    </Link>
                    <p className="text-sm text-gray-600">{notif.message}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(notif.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}

              {supportNotifications.length === 0 && (
                <div className="text-center py-6">
                  <p className="text-gray-500">No support notifications yet</p>
                </div>
              )}

              {supportNotifications.length > 6 && (
                <Button
                  variant="ghost"
                  className="mt-2 w-full text-blue-600 hover:text-blue-700"
                  onClick={() => setShowAllNotifications(!showAllNotifications)}
                >
                  {showAllNotifications ? "Show Less" : `Show More (${supportNotifications.length - 6} more)`}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <CommentSection slug={params.id} />

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900">
                See Other Projects of {projectData.firstName}{" "}
                {projectData.lastName}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProjects.map((project) => (
                <Card
                  key={project._id}
                  className="overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  <CardContent className="p-6 space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {project.title}
                    </h3>
                    <p className="text-gray-600">{project.objective}</p>

                    <Image
                      src={project?.pictureOfSuccess?.url || "/digital.jpg"}
                      alt="Project"
                      width={600}
                      height={400}
                      className="w-full h-48 object-cover rounded-lg"
                    />

                    <Button
                      variant="outline"
                      onClick={() =>
                        router.push(`/project-profile/${project._id}`)
                      }
                    >
                      {" "}
                      View Project
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
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
                          <UserCircle className="mr-3 h-5 w-5" />
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
                    2024 Did My Bit. All rights reserved.
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
