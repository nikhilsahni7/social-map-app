"use client";
import React from "react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
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
import CommentSection from "@/components/Comments";
import { Loader2 } from "lucide-react";
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
  }>;
  otherSupport: string;
  pictureOfSuccess?: {
    url: string;
  };
}

export default function ProjectDetails({ params }: { params: { id: string } }) {
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSupporting, setIsSupporting] = useState(false);
  const [supportItems, setSupportItems] = useState<Record<string, number>>({});
  const [totalSupport, setTotalSupport] = useState(0);

  const relatedProjects = [
    {
      id: "1",
      title: "Digital Literacy Program",
      description: "Empowering communities through technology education",
      image: "/digital-literacy.jpg",
      category: "Education",
      progress: 60,
    },
    {
      id: "2",
      title: "Youth Mentorship Initiative",
      description: "Connecting students with professional mentors",
      image: "/youth-mentorship.jpg",
      category: "Human Development",
      progress: 45,
    },
  ];

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

  const updateItemQuantity = (item: string, delta: number) => {
    setSupportItems((prev) => {
      const currentQty = prev[item] || 0;
      const newQty = Math.max(0, Math.min(4, currentQty + delta));

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

  const getSupportSummary = () => {
    if (totalSupport === 0) return "Select items to support";
    const items = Object.entries(supportItems)
      .filter(([_, qty]) => qty > 0)
      .map(([item, qty]) => `${qty}x ${item}`)
      .join(", ");
    return `Supporting: ${items}`;
  };

  // Inside ProjectDetails component

  const handleSupport = async () => {
    setIsSupporting(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/projects/${params.id}/support`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ supportItems }),
      });

      if (response.ok) {
        // Reset support items
        setSupportItems({});
        setTotalSupport(0);
        // Optionally, display a success message or notification
        alert("Support sent successfully!");
      } else {
        const data = await response.json();
        alert(data.error || "Failed to send support");
      }
    } catch (error) {
      console.error("Error sending support:", error);
      alert("An error occurred while sending support.");
    } finally {
      setIsSupporting(false);
    }
  };

  if (loading) {
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
      {/* Hero Section */}
      <div className="relative">
        <div className="h-[50vh] overflow-hidden">
          <Image
            width={1920}
            height={600}
            src="/digital.jpg"
            alt="Project Banner"
            className="w-full h-full object-cover"
            priority
          />
        </div>
      </div>

      <div className="w-full">
        <div className="relative -mt-28">
          <div className="bg-white rounded-b-2xl shadow-lg p-8 backdrop-blur-lg bg-white/90">
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
              <Avatar className="w-32 h-32 border-4 border-white shadow-xl ring-4 ring-blue-500/20">
                <AvatarFallback className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 text-white">
                  {projectData.firstName[0]}
                  {projectData.lastName[0]}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1">
                    {projectData.category}
                  </Badge>
                </div>

                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {projectData.firstName} {projectData.lastName}
                  </h1>
                  <p className="text-xl text-blue-600 font-medium mt-1">
                    {projectData.title}
                  </p>
                </div>
              </div>
              <div className="flex justify-end items-center">
                <h1 className="text-5xl font-bold tracking-tight text-center mt-2">
                  Do Your <span className="text-red-500">Bit</span>
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Project Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6 space-y-8">
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
              <div className="w-full mt-8 px-4">
                <div className="flex items-center justify-between">
                  {/* Start Date Section */}
                  <div className="flex flex-col items-center">
                    <div className="text-sm text-gray-500 mb-2">Start</div>
                    <div className="text-lg font-semibold text-blue-700 px-3 py-1 rounded-md shadow-sm">
                      {"2/02/2024"}
                    </div>
                  </div>

                  {/* Dotted Line Timeline */}
                  <div className="flex-1 mx-6 items-center mt-7">
                    <div className="w-full h-1 border-t-2 border-dotted border-blue-300 relative"></div>
                  </div>

                  {/* End Date Section */}
                  <div className="flex flex-col items-center">
                    <div className="text-sm text-gray-500 mb-2">End</div>
                    <div className="text-lg font-semibold text-blue-700 px-3 py-1 rounded-md shadow-sm">
                      {"2/12/2024"}
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
          {/* Project Details */}
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
              <div className="flex flex-row gap-4 items-center">
                <Label className="text-sm font-medium text-blue-600 block">
                  DO YOUR BIT BY SUPPORTING THIS PROJECT
                </Label>
                <HoverCard openDelay={0} closeDelay={0}>
                  <HoverCardTrigger asChild>
                    <Button
                      size="lg"
                      className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto group relative overflow-hidden"
                      onClick={handleSupport}
                      disabled={isSupporting || totalSupport === 0}
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        <Heart className="w-5 h-5" />
                        Support Project
                      </span>
                      <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80 p-2" align="end">
                    <div className="space-y-2">
                      <h4 className="font-semibold">Your Support Summary</h4>
                      <p className="text-sm text-gray-600">
                        {getSupportSummary()}
                      </p>
                      {totalSupport > 0 && (
                        <div className="pt-2 border-t">
                          <p className="text-xs text-gray-500">
                            Click to confirm your support for these items
                          </p>
                        </div>
                      )}
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid md:grid-cols-5 gap-4 p-4 bg-gray-50 rounded-lg font-medium text-gray-700">
                <div>Items</div>
                <div>Quantity</div>
                <div>Needed By</div>
                <div>Drop Location</div>
                <div>Support</div>
              </div>

              {projectData.supportItems.map((item, index) => (
                <div
                  key={index}
                  className="grid md:grid-cols-5 gap-4 p-4 bg-white border border-gray-100 rounded-lg transition-colors hover:bg-gray-50"
                >
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-blue-600" />
                    <span>{item.item}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{item.quantity}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{item.byWhen}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{item.dropLocation}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => updateItemQuantity(item.item, -1)}
                      disabled={!supportItems[item.item]}
                      className={supportItems[item.item] ? "text-red-500" : ""}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">
                      {supportItems[item.item] || 0}
                    </span>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => updateItemQuantity(item.item, 1)}
                      disabled={supportItems[item.item] >= 4}
                      className={
                        supportItems[item.item] < 4
                          ? "text-green-500"
                          : "text-gray-400"
                      }
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <Label className="text-sm font-medium text-blue-600 block mb-2">
                Additional Support Needed
              </Label>
              <p className="text-gray-700 leading-relaxed">
                {projectData.otherSupport}
              </p>
            </div>
          </CardContent>
        </Card>

        <CommentSection slug="your-post-slug" />

        {/* Related Projects */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-900">
              Other Related Projects
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {relatedProjects.map((project) => (
              <Card
                key={project.id}
                className="overflow-hidden hover:shadow-lg transition-all duration-300 group"
              >
                <CardContent className="p-0">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      width={400}
                      height={200}
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-white/90 text-blue-600 hover:bg-white">
                        {project.category}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {project.title}
                      </h3>
                      <p className="mt-2 text-gray-600">
                        {project.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
