"use client";
import { useState } from "react";
import { Calendar, User, Tag as TagIcon, Info, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface ProjectDetailsProps {
  creator: string;
  title: string;
  preview: string;
  details: string;
  category: string;
  dateRange: string;
  photoCaption: string;
  supportNeeded: string;
  others: string;
}

export default function ProjectDetails({
  creator,
  title,
  preview,
  details,
  category,
  dateRange,
  photoCaption,
  supportNeeded,
  others,
}: ProjectDetailsProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header with gradient */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-blue-400 text-transparent bg-clip-text">
            Your Organization Name
          </h1>
          <div className="h-1 w-32 bg-gradient-to-r from-blue-600 to-blue-400 mx-auto rounded-full"></div>
        </div>

        {/* Project Title and Creator */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">{title}</h2>
          <div className="flex items-center text-gray-600">
            <User size={18} className="mr-2" />
            <span className="font-medium">Created by: {creator}</span>
          </div>
        </div>

        {/* Preview Image */}
        <Card className="mb-8 overflow-hidden">
          <Image
            src={preview}
            alt={`${title} Preview`}
            width={500}
            height={500}
            className="w-full h-64 object-cover"
          />
          <CardContent>
            <p className="text-sm text-gray-500 mt-2">{photoCaption}</p>
          </CardContent>
        </Card>

        {/* Category and Date Range */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Badge variant="secondary" className="text-lg py-1 px-3">
            <TagIcon size={18} className="mr-2 inline" />
            {category}
          </Badge>
          <div className="flex items-center text-gray-600">
            <Calendar size={18} className="mr-2" />
            <span>{dateRange}</span>
          </div>
        </div>

        {/* Project Details */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-blue-600">
              Project Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{details}</p>
          </CardContent>
        </Card>

        {/* Support Needed */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-blue-600">
              Support Needed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{supportNeeded}</p>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-blue-600">
              Additional Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{others}</p>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center">
          <Button
            size="lg"
            className={`bg-gradient-to-r bg-blue-600 text-white px-8 py-8 rounded-full text-lg font-semibold transition-all duration-300 ease-in-out ${
              isHovered ? "shadow-lg scale-105" : ""
            }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            Contact for Support
          </Button>
        </div>
      </div>
    </div>
  );
}

// Sample data to pass as props
ProjectDetails.defaultProps = {
  creator: "John Doe",
  title: "Innovative Map Project",
  preview: "/placeholder.svg?height=400&width=800",
  details:
    "This project is focused on creating an interactive map platform that helps users navigate and explore different regions. Our goal is to provide a user-friendly interface that combines detailed geographical data with real-time information, making it easier for people to discover and learn about various locations around the world.",
  category: "HDA, Duralin",
  dateRange: "January 2023 - March 2023",
  photoCaption: "Preview of the interactive map project interface",
  supportNeeded:
    "We are currently looking for experienced frontend and backend developers to join our team. We need assistance in improving the map rendering performance, implementing advanced search algorithms, and creating a robust API for third-party integrations.",
  others:
    "For more information about this project or to discuss potential collaborations, please don't hesitate to reach out to the project creator. We're always open to new ideas and partnerships that can help us improve and expand our platform.",
};
