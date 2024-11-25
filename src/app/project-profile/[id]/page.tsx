"use client";
import React from "react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import CommentSection from "@/components/Comments";

import {
  Target,
  Calendar,
  Award,
  Briefcase,
  Heart,
  MessageSquare,
  ChevronRight,
  MapPin,
  Clock,
  Package,
  Share2,
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

interface RelatedProject {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  progress: number;
}

export default function ProjectDetails({ params }: { params: { id: string } }) {
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSupporting, setIsSupporting] = useState(false);

  const relatedProjects = [
    {
      id: "1",
      title: "Digital Literacy Program",
      description: "Empowering communities through technology education",
      image: "/digital.jpg",
      category: "Education",
      progress: 60,
    },
    {
      id: "2",
      title: "Youth Mentorship Initiative",
      description: "Connecting students with professional mentors",
      image: "/mentorship.png",
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="space-y-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600">Loading project details...</p>
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

  const handleSupport = () => {
    setIsSupporting(true);
    // Add support logic here
    setTimeout(() => setIsSupporting(false), 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative">
        <div className="h-40 lg:h-56 overflow-hidden">
          <div className="absolute inset-0 bg-blue-600 mix-blend-multiply opacity-10"></div>
          <Image
            width={1920}
            height={200}
            src="/api/placeholder/1920/500"
            alt="Project Banner"
            className="w-full h-full object-cover"
            priority
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-32">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                <Avatar className="w-32 h-32 border-4 border-white shadow-xl">
                  <AvatarFallback className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 text-white">
                    {projectData.firstName[0]}
                    {projectData.lastName[0]}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {/* <Badge variant="secondary" className="bg-blue-50 text-blue-600 hover:bg-blue-100">
                      {projectData.category}
                    </Badge> */}
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
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Project Details */}
        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="overflow-hidden">
            <CardContent className="p-6 space-y-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Target className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <Label className="text-sm font-medium text-blue-600">
                    Project Objective
                  </Label>
                  <p className="mt-2 text-gray-700 leading-relaxed">
                    {projectData.objective}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <Label className="text-sm font-medium text-blue-600">
                    Timeline
                  </Label>
                  <div className="mt-2 space-y-2">
                    <p className="text-gray-700">
                      <span className="font-medium">Starts:</span>{" "}
                      {projectData.duration.startDate}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Ends:</span>{" "}
                      {projectData.duration.endDate}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Award className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <Label className="text-sm font-medium text-blue-600">
                    Project Description
                  </Label>
                  <p className="mt-2 text-gray-700 leading-relaxed">
                    {projectData.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
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
                    "/api/placeholder/600/400"
                  }
                  alt="Project Success Vision"
                  className="w-full h-full object-cover"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Support Section */}
        <Card className="overflow-hidden">
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
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto"
                  onClick={handleSupport}
                  disabled={isSupporting}
                >
                  Support Project
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg font-medium text-gray-700">
                <div>Items</div>
                <div>Quantity</div>
                <div>Needed By</div>
                <div>Drop Location</div>
              </div>

              {projectData.supportItems.map((item, index) => (
                <div
                  key={index}
                  className="grid md:grid-cols-4 gap-4 p-4 bg-white border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
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

        {/* Related Projects */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-900">
              Other related Projects
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {relatedProjects.map((project) => (
              <Card
                key={project.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-0">
                  <div className="relative h-48">
                    <Image
                      width={400}
                      height={200}
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
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
        <CommentSection slug="your-post-slug" />
      </div>
    </div>
  );
}
