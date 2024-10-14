"use client";

import React, { useState } from "react";
import { Calendar, User, Tag as TagIcon, HelpCircle } from "lucide-react";
import Image from "next/image";

interface ProjectDetailsProps {
  creator: string;
  title: string;
  preview: string;
  details: string;
  category: string;
  dateRange: string;
  photoCaption: string;
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
  others,
}: ProjectDetailsProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSupport, setSelectedSupport] = useState<string[]>([]);
  const [otherSupport, setOtherSupport] = useState("");

  const supportTypes = [
    { id: "cash", label: "Cash" },
    { id: "food", label: "Food" },
    { id: "items", label: "Items" },
    { id: "volunteers", label: "Volunteers" },
  ];

  const handleSupportChange = (supportId: string) => {
    setSelectedSupport((prev) =>
      prev.includes(supportId)
        ? prev.filter((id) => id !== supportId)
        : [...prev, supportId]
    );
  };

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
        <div className="mb-8 overflow-hidden rounded-lg shadow-lg">
          <Image
            src={preview}
            alt={`${title} Preview`}
            width={800}
            height={400}
            className="w-full h-64 object-cover"
          />
          <p className="text-sm text-gray-500 mt-2 p-4">{photoCaption}</p>
        </div>

        {/* Category and Date Range */}
        <div className="flex flex-wrap gap-4 mb-8">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            <TagIcon size={18} className="mr-2" />
            {category}
          </span>
          <div className="flex items-center text-gray-600">
            <Calendar size={18} className="mr-2" />
            <span>{dateRange}</span>
          </div>
        </div>

        {/* Project Details */}
        <div className="mb-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-2xl font-semibold text-blue-600 mb-4">
            Project Details
          </h3>
          <p className="text-gray-700">{details}</p>
        </div>

        {/* Support Needed Form */}
        <div className="mb-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-2xl font-semibold text-blue-600 mb-4">
            Support Needed
          </h3>
          <div className="space-y-4">
            {supportTypes.map((type) => (
              <div key={type.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={type.id}
                  checked={selectedSupport.includes(type.id)}
                  onChange={() => handleSupportChange(type.id)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor={type.id} className="text-gray-700">
                  {type.label}
                </label>
              </div>
            ))}
            <div className="space-y-2">
              <label htmlFor="other-support" className="block text-gray-700">
                Other (please specify)
              </label>
              <textarea
                id="other-support"
                placeholder="Describe any other support needed..."
                value={otherSupport}
                onChange={(e) => setOtherSupport(e.target.value)}
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
                rows={4}
              />
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mb-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-2xl font-semibold text-blue-600 mb-4">
            Additional Information
          </h3>
          <p className="text-gray-700">{others}</p>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <button
            className={`bg-gradient-to-r from-blue-600 to-blue-400 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 ease-in-out ${
              isHovered ? "shadow-lg scale-105" : ""
            }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <HelpCircle size={24} className="inline mr-2" />
            Contact for Support
          </button>
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
  others:
    "For more information about this project or to discuss potential collaborations, please don't hesitate to reach out to the project creator. We're always open to new ideas and partnerships that can help us improve and expand our platform.",
};
