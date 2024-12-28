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
import { Input } from "@/components/ui/input";
import { CommentSection } from "@/components/Comments";
import { Loader2, ChevronRight, } from "lucide-react";
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
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

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

  const router = useRouter();

  const [isMobile, setIsMobile] = useState(false);

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

  const getSupportSummary = () => {
    if (totalSupport === 0) return "Select items to support";
    const items = Object.entries(supportItems)
      .filter(([_, qty]) => qty > 0)
      .map(([item, qty]) => `${qty}x ${item}`)
      .join(", ");
    return `Supporting: ${items}`;
  };

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
        body: JSON.stringify({
          supportItems,
          additionalSupport
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setProjectData(data.project);
        setSupportItems({});
        setTotalSupport(0);
        setAdditionalSupport(''); // Reset additional support
        toast.success("Support submitted successfully!");
      } else {
        throw new Error("Failed to submit support");
      }
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
        <div className="h-[40vh] md:h-[50vh] overflow-hidden">
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
              <div className="flex flex-row items-center gap-4">
                <Avatar className="w-16 h-16 md:mb-0 mb-8 md:w-32 md:h-32 border-4 border-white shadow-xl ring-4 ring-blue-500/20">
                  <AvatarFallback className="text-xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 text-white">
                    {projectData.firstName[0]}
                    {projectData.lastName[0]}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-4">
                  {!isMobile && (<div className="flex flex-wrap gap-2">
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
                    {showSupportSection ? "Support Project" : "Support Project"}
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                </Button>
              </div>
            </div>
            {showSupportSection && (
              <div>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg text-xl">
                        ❤️
                      </div>
                      <h2 className="text-2xl font-semibold text-gray-900">
                        Your Support Section
                      </h2>
                    </div>
                  </div>

                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.8 }}
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
                              <span className="md:hidden font-medium">Quantity Needed:</span>
                              <span>{item.quantity}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="md:hidden font-medium">Support Provided:</span>
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

                        <div className="flex justify-end mt-4">
                          <HoverCard>
                            <HoverCardTrigger asChild>
                              <Button
                                size="lg"
                                className="bg-blue-600 hover:bg-blue-700"
                                onClick={handleSupport}
                                disabled={isSupporting || totalSupport === 0}
                              >
                                {isSupporting ? (
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                  <Heart className="w-4 h-4 mr-2" />
                                )}
                                Confirm Support
                              </Button>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-80">
                              <h4 className="font-semibold mb-2">
                                Your Support Summary
                              </h4>
                              <p className="text-sm text-gray-600">
                                {getSupportSummary()}
                              </p>
                            </HoverCardContent>
                          </HoverCard>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                    <Label className="text-sm font-medium text-blue-600 block mb-2">
                      Additional Support Needed
                    </Label>
                    <Input
                      placeholder="Enter additional support details"
                      value={additionalSupport}
                      onChange={(e) => setAdditionalSupport(e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </CardContent>
              </div>
            )}

            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="space-y-4">
                  <div className="hidden md:grid md:grid-cols-5 gap-4 p-4 bg-gray-50 rounded-lg font-2xl font-semibold text-gray-700">
                    <div>Items</div>
                    <div className="text-right pr-8">Quantity Needed</div>
                    <div className="text-right pr-8">Support Provided</div>
                    <div>Needed By</div>
                    <div>Drop Location</div>
                  </div>

                  {projectData.supportItems.map((item, index) => (
                    <div key={index} className="flex flex-col md:grid md:grid-cols-5 gap-4 p-4 bg-white border border-gray-100 rounded-lg transition-colors hover:bg-gray-50">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-blue-600" />
                        <span>{item.item}</span>
                      </div>
                      <div className="flex items-center justify-end pr-8">
                        <span>{item.quantity}</span>
                      </div>
                      <div className="flex items-center justify-end gap-2 pr-8">
                        <span>{item.supportProvided || 0}</span>
                        <Progress value={(item.supportProvided / Number(item.quantity)) * 100} className="w-20 h-2" />
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
              </motion.div>
            </AnimatePresence>

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
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
