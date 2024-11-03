"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import Image from "next/image";

export default function ProjectProfile() {
  // Static data that mirrors the structure of the creation form
  const projectData = {
    firstName: "John",
    lastName: "Doe",
    projectTitle: "Community Education Initiative",
    projectObjective: "To provide educational resources to underserved communities",
    category: "Human",
    duration: {
      from: "2024-01-01",
      to: "2024-12-31"
    },
    achievement: "Creating a sustainable education model that can be replicated across different communities",
    pictureOfSuccess: "/project-success.jpg",
    supportItems: [
      { item: "Laptops", quantity: "10", byWhen: "2024-03-15", dropLocation: "Community Center" },
      { item: "Books", quantity: "100", byWhen: "2024-02-28", dropLocation: "Local Library" },
      { item: "Stationery", quantity: "50", byWhen: "2024-03-01", dropLocation: "School Office" }
    ],
    otherSupport: "Volunteers for weekly teaching sessions and technical support"
  };

  return (
    <div className="w-full max-w-full p-2">
      <h2 className="text-2xl font-bold text-center mb-4 text-blue-600">
        Project Details
      </h2>

      <Card className="border-2 border-blue-200 rounded-lg overflow-hidden w-full">
        <ScrollArea className="h-full">
          <CardContent className="p-4 grid grid-cols-1 gap-4">
            <div className="space-y-3">
              {/* First Name and Last Name */}
              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
                <div className="flex flex-col w-full md:w-1/6">
                  <Label className="text-sm font-semibold text-blue-600">
                    First Name
                  </Label>
                  <div className="p-2 text-sm">
                    {projectData.firstName}
                  </div>
                </div>
                <div className="flex flex-col w-full md:w-1/6">
                  <Label className="text-sm font-semibold text-blue-600">
                    Last Name
                  </Label>
                  <div className="p-2 text-sm">
                    {projectData.lastName}
                  </div>
                </div>
              </div>

              {/* Project Title */}
              <div className="flex flex-col">
                <Label className="text-sm font-semibold text-blue-600">
                  Project Title
                </Label>
                <div className="p-2 text-sm">
                  {projectData.projectTitle}
                </div>
              </div>

              {/* Project Objective */}
              <div className="flex flex-col">
                <Label className="text-sm font-semibold text-blue-600">
                  Project Objective
                </Label>
                <div className="p-2 text-sm">
                  {projectData.projectObjective}
                </div>
              </div>

              {/* Project Tag Preview */}
              <div className="flex space-x-4 items-center">
                <Label className="text-sm font-semibold text-blue-600">
                  Project Tag Preview:
                </Label>
                <div className="flex flex-col items-center justify-end space-x-2">
                  <h1 className="text-sm font-medium whitespace-nowrap">
                    Mr. {projectData.lastName} wants to {projectData.projectObjective.toLowerCase()}.
                  </h1>
                </div>
              </div>

              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 w-full">
                {/* Category Section */}
                <div className="flex flex-col w-full md:w-1/3">
                  <Label className="text-sm font-semibold text-blue-600">
                    Category:
                  </Label>
                  <div className="p-2 text-sm">
                    {projectData.category}
                  </div>
                </div>

                {/* Duration Section */}
                <div className="flex flex-col w-full md:w-2/4">
                  <div className="flex flex-col space-y-2">
                    <Label className="text-sm font-semibold text-blue-600">
                      Duration
                    </Label>
                    <div className="flex items-center space-x-4">
                      <div className="text-sm">
                        {projectData.duration.from}
                      </div>
                      <span className="text-sm font-semibold text-black">
                        to
                      </span>
                      <div className="text-sm">
                        {projectData.duration.to}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Describe What You Want To Achieve and Picture of Success */}
              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
                <div className="flex flex-col w-full md:w-6/12">
                  <Label className="text-sm font-semibold text-blue-600">
                    Describe What You Want To Achieve
                  </Label>
                  <div className="p-2 text-sm h-48">
                    {projectData.achievement}
                  </div>
                </div>

                <div className="flex flex-col w-full md:w-6/12">
                  <Label className="text-sm font-semibold text-blue-600">
                    Picture Of Success
                  </Label>
                  <div className="w-10/12 h-48 border-2 border-gray-300 rounded-lg flex justify-center items-center">
                    <Image
                      width={20}
                      height={20}
                      src="/api/placeholder/400/320"
                      alt="Project Success"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Supports Needed */}
              <Label className="text-lg font-semibold text-blue-600 mb-6">
                Supports Needed
              </Label>
              <div className="w-full p-6">
                <div className="grid grid-cols-12 gap-4 mb-4">
                  <div className="w-2 font-medium  text-sm pt-2 text-center"></div>
                  <div className="col-span-3 font-medium text-black text-md text-center pt-2">Item</div>
                  <div className="col-span-2 font-medium text-black text-md text-center pt-2">Quantity</div>
                  <div className="col-span-2 font-medium text-black text-md text-center pt-2">By When</div>
                  <div className="col-span-4 font-medium text-black text-md text-center pt-2">Drop Location</div>
                </div>

                <div className="grid grid-cols-12 gap-4">
                  {/* Serial Numbers Column */}
                  <div className="w-2 mt-2">
                    {projectData.supportItems.map((_, index) => (
                      <div key={index} className="flex items-center justify-center text-sm text-gray-600 h-9 mb-3">
                        {index + 1 + "."}
                      </div>
                    ))}
                  </div>

                  {/* Items Display */}
                  <div className="col-span-3 border border-gray-200 rounded-md p-3">
                    {projectData.supportItems.map((item, index) => (
                      <div key={index} className="mb-3 p-2 border rounded-md text-sm">
                        {item.item}
                      </div>
                    ))}
                  </div>

                  {/* Quantity Display */}
                  <div className="col-span-2 border border-gray-200 rounded-md p-3">
                    {projectData.supportItems.map((item, index) => (
                      <div key={index} className="mb-3 p-2 border rounded-md text-sm text-center">
                        {item.quantity}
                      </div>
                    ))}
                  </div>

                  {/* By When Display */}
                  <div className="col-span-2 border border-gray-200 rounded-md p-3">
                    {projectData.supportItems.map((item, index) => (
                      <div key={index} className="mb-3 p-2 border rounded-md text-sm text-center">
                        {item.byWhen}
                      </div>
                    ))}
                  </div>

                  {/* Drop Location Display */}
                  <div className="col-span-4 border border-gray-200 rounded-md p-3">
                    {projectData.supportItems.map((item, index) => (
                      <div key={index} className="mb-3 p-2 border rounded-md text-sm text-center">
                        {item.dropLocation}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Other Support Section */}
                <div className="mt-6 flex items-center gap-4">
                  <Label className="text-sm font-semibold text-blue-600">
                    Other Support:
                  </Label>
                  <div className="p-2 text-sm w-8/12">
                    {projectData.otherSupport}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </ScrollArea>
      </Card>
    </div>
  );
}