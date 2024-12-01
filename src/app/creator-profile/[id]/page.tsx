// app/creator/profile/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getAuthUser } from "@/lib/clientAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Mail,
  LinkedinIcon,
  TwitterIcon,
  Users,
  Eye,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { NotificationDropdown } from "@/components/NotificationDropdown";
import SupportNotifications from "@/components/SupportNotifications";

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
  const currentUser = getAuthUser();

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

  useEffect(() => {
    fetchProfile();
    if (currentUser) {
      fetchNotifications();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-black">
        <div className="text-center space-y-4">
          <Loader2 className="w-16 h-16 text-white animate-spin mx-auto" />
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Loading...
          </h2>
          <p className="text-lg text-blue-300">
            Fetching profile data, please wait
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
    <div
      className="min-h-screen bg-gray-100">
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            {/* Profile Header */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative h-60">
                  <Image
                    src={personData.banner}
                    alt="Profile Banner"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white/90 to-transparent"></div>
                </div>
                <div className="relative px-8 pb-8">
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
                            <span>{((personData.profileViews) / 2)} profile views</span>
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
                          <Link
                            href={`/project-profile/${project.id}`}
                            passHref
                          >
                            <Button variant="outline" className="w-full">
                              View Project
                              <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                          </Link>
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
          </div>
        </div>
      </main>
    </div>
  );
}
