// app/creator/profile/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getAuthUser } from "@/lib/clientAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, X, Menu, ZoomIn, ZoomOut, Compass, LogIn } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAuthToken, logout } from "@/lib/clientAuth";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  LinkedinIcon,
  TwitterIcon,
  Users,
  Eye,
  ChevronRight,
  Loader2,
  UserCircle,
  LogOut,
  Info,
  Mail,
  HelpCircle,
  UserPlus
} from "lucide-react";
import { NotificationDropdown } from "@/components/NotificationDropdown";
import SupportNotifications from "@/components/SupportNotifications";
import { FaArrowLeft, FaHome } from 'react-icons/fa';
interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
}

interface PersonData {
  firstName: string;
  lastName: string;
  title: string;
  location: string;
  email: string;
  aboutMe: string;
  avatar: string;
  banner: string;
  projects: Project[];
  connections: number;
  profileViews: number;
  social: {
    linkedin: string;
    twitter: string;
  };
  connectionStatus?: string;
}

export default function PersonProfile() {
  const params = useParams();
  const [personData, setPersonData] = useState<PersonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const router = useRouter();
  const currentUser = getAuthUser();
  const [token, setToken] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setToken(getAuthToken());
    const user = getAuthUser();
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // Adjust this breakpoint as needed
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`/api/users/${params.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();

      if (data.user) {
        setPersonData({
          firstName: data.user.name.split(" ")[0],
          lastName: data.user.name.split(" ")[1] || "",
          title: data.user.occupation || "",
          location: `${data.user.city || ""}, ${data.user.state || ""}`,
          email: data.user.email,
          aboutMe: data.user.aboutMe,
          avatar: data.user.avatar,
          banner: "/digital.jpg",
          connections: data.user.connectionsCount || 0,
          profileViews: data.user.profileViews,
          projects:
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data.projects?.map((p: any) => ({
              id: p._id,
              title: p.title,
              description: p.objective,
              category: p.category,
              image: p.pictureOfSuccess?.url || "/digital.jpg",
            })) || [],
          social: {
            linkedin: "#",
            twitter: "#",
          },
          connectionStatus: data.user.connectionStatus,
        });
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setNotifications(data.notifications);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  const handleConnect = async () => {
    try {
      const res = await fetch("/api/connections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ recipientId: params.id }),
      });

      if (res.ok) {
        setPersonData((prev) =>
          prev
            ? {
              ...prev,
              connectionStatus: "pending",
            }
            : null
        );
      }
    } catch (error) {
      console.error("Failed to connect:", error);
    }
  };

  const handleConnectionResponse = async (
    id: string,
    status: "accepted" | "rejected"
  ) => {
    try {
      await fetch(`/api/connections/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status }),
      });

      // Refresh notifications and profile data after response
      fetchNotifications();
      fetchProfile();
    } catch (error) {
      console.error("Failed to update connection:", error);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  useEffect(() => {
    fetchProfile();
    if (currentUser) {
      fetchNotifications();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-white">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-[#7E57C2] animate-spin mx-auto" />
          <p className="text-lg text-black font-semibold">
            One moment, please... Fetching profile data
          </p>
        </div>
      </div>
    );
  }

  if (!personData) return <div>Profile not found</div>;

  const renderConnectionButton = () => {
    if (currentUser?.id === params.id) return null;

    switch (personData.connectionStatus) {
      case "pending":
        return <Button disabled>Pending</Button>;
      case "accepted":
        return <Button disabled>Connected</Button>;
      default:
        return <Button onClick={handleConnect}>Connect</Button>;
    }
  };



  return (
    <div>

      

      <div className="min-h-screen bg-gray-100">

        <div className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm shadow-md">
          <div className="max-w-7xl mx-auto px-4 py-2">
          {isMobile && (
              <div>
              <button onClick={() => router.back()} className="bg-blue-600 scale-90 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              <FaArrowLeft size={10} />
            </button>
            <button onClick={() => router.push('/')} className="bg-blue-600 scale-90 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              <FaHome size={10} />
            </button>
            </div>
            )}
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
                {token && currentUser ? (
                  <div></div>
                ) : (
                  <>
                    
                  </>
                )}
                {/* Menu Button */}
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
        <main className="md:pt-20 pt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="space-y-6">
              {/* Profile Header */}
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative h-20">
                    
                    <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white/90 to-transparent"></div>
                  </div>
                  <div className="mt-6 relative px-8 pb-8">
                    <Avatar className="w-40 h-40 border-4 border-blue-500 rounded-full bg-gradient-to-b from-blue-500 to-blue-700 shadow-xl absolute -top-20 left-8">
                      <AvatarImage
                        src={personData.avatar}
                        alt={`${personData.firstName} ${personData.lastName}`}
                      />
                      <AvatarFallback className="flex items-center justify-center w-full h-full text-5xl font-semibold text-white bg-blue-600 rounded-full">
                        {personData.firstName[0]}
                        {personData.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="pt-24">
                      <div className="flex justify-between items-start flex-col gap-4">
                        <div className="space-y-4">
                          <div>
                            <h1 className="text-4xl font-bold text-gray-900">
                              {personData.firstName} {personData.lastName}
                            </h1>
                            <p className="text-xl text-gray-600 font-medium mt-1">
                              {personData.title}
                            </p>
                          </div>

                          <div className="flex items-center space-x-6 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              <span>{personData.connections} connections</span>
                            </div>
                            <div className="flex items-center">
                              <Eye className="w-4 h-4 mr-1" />
                              <span>{Math.ceil(personData.profileViews)} profile views</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-6">
                            <div className="flex items-center text-gray-600">
                              <MapPin className="w-5 h-5 mr-2" />
                              <span>{personData.location}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Mail className="w-5 h-5 mr-2" />
                              <span>{personData.email}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          {renderConnectionButton()}
                          {currentUser?.id === params.id && (
                            <NotificationDropdown
                              notifications={notifications}
                              onAccept={(id: string) =>
                                handleConnectionResponse(id, "accepted")
                              }
                              onReject={(id: string) =>
                                handleConnectionResponse(id, "rejected")
                              }
                            />
                          )}
                          <Button variant="outline" size="icon" asChild>
                            <a
                              href={personData.social.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <LinkedinIcon className="w-5 h-5" />
                            </a>
                          </Button>
                          <Button variant="outline" size="icon" asChild>
                            <a
                              href={personData.social.twitter}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <TwitterIcon className="w-5 h-5" />
                            </a>
                          </Button>
                          {(currentUser?.id === params.id) && (<Link href={`/edit-profile/${params.id}`}>
                            <Button className="ml-2">Edit Profile</Button></Link>)}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Projects Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-3xl">Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {personData.projects.map((project) => (
                      <Card
                        key={project.id}
                        className="overflow-hidden hover:shadow-lg transition-shadow"
                      >
                        <CardContent className="p-0">
                          <div className="relative h-48">
                            <Image
                              src={project.image}
                              alt={project.title}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute top-4 right-4">
                              <Badge variant="secondary" className="bg-white/90">
                                {project.category}
                              </Badge>
                            </div>
                          </div>
                          <div className="p-6 space-y-4">
                            <h3 className="text-xl font-semibold text-gray-900">
                              {project.title}
                            </h3>
                            <p className="text-gray-600">{project.description}</p>
                            <div className="flex flex-row justify-center gap-4">
                              {currentUser?.id === params.id ? (
                                <div className="flex flex-row justify-center gap-4">
                                  <Link href={`/project-profile/${project.id}`} passHref>
                                    <Button variant="outline" className="w-full">
                                      View Project
                                      <ChevronRight className="w-4 h-4 ml-2" />
                                    </Button>
                                  </Link>
                                  <Link href={`/edit-project/${project.id}`} passHref>
                                    <Button variant="outline" className="w-full">
                                      Edit Project
                                      <ChevronRight className="w-4 h-4 ml-2" />
                                    </Button>
                                  </Link>
                                </div>
                              ) : (<div className="w-full">
                                <Link href={`/project-profile/${project.id}`} passHref>
                                  <Button variant="outline" className="w-full">
                                    View Project
                                    <ChevronRight className="w-4 h-4 ml-2" />
                                  </Button>
                                </Link>
                              </div>)}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
              {currentUser?.id === params.id && (
                <SupportNotifications
                  userId={Array.isArray(params.id) ? params.id[0] : params.id}
                />
              )}
              {/* About Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-3xl">About Me</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {personData.aboutMe}
                  </p>
                </CardContent>
              </Card>
              
              {isMenuOpen && (
          <motion.div
            initial={{ x: 300 }}
            animate={{ x: 0 }}
            exit={{ x: 300 }}
            className="fixed -top-6 right-0 h-full w-80 bg-white shadow-lg z-50"
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
                {token && currentUser ? (
                  <div className="bg-gray-50 p-4 rounded-lg mb-2">
                    <p className="text-lg font-semibold text-gray-800">
                      {currentUser.name}
                    </p>
                    <p className="text-sm text-gray-600 mb-3">{currentUser.email}</p>
                    <ul className="space-y-2">
                      <li>
                        <Button
                          variant="outline"
                          onClick={() => {
                            router.push(`/creator-profile/${currentUser.id}`);
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
                  {token && currentUser ? (
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
                  <p className="text-xs text-blue-600 font-medium mt-1">
                    Making the world better, one bit at a time
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}