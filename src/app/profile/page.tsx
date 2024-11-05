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
    projectObjective:
      "To provide educational resources to underserved communities",
    category: "Human",
    duration: {
      from: "2024-01-01",
      to: "2024-12-31",
    },
    achievement:
      "Creating a sustainable education model that can be replicated across different communities",
    pictureOfSuccess: "/project-success.jpg",
    supportItems: [
      {
        item: "Laptops",
        quantity: "10",
        byWhen: "2024-03-15",
        dropLocation: "Community Center",
      },
      {
        item: "Books",
        quantity: "100",
        byWhen: "2024-02-28",
        dropLocation: "Local Library",
      },
      {
        item: "Stationery",
        quantity: "50",
        byWhen: "2024-03-01",
        dropLocation: "School Office",
      },
    ],
    otherSupport:
      "Volunteers for weekly teaching sessions and technical support",
    MapLocation:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.073292073073!2d3.372073314266073!3d6.524379325292073!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8e7b7f1b1b3d%3A0x1b3b3b3b3b3b3b3b!2sLagos%20Island!5e0!3m2!1sen!2sng!4v1633663660007!5m2!1sen!2sng",
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
                  <div className="p-2 text-sm">{projectData.firstName}</div>
                </div>
                <div className="flex flex-col w-full md:w-1/6">
                  <Label className="text-sm font-semibold text-blue-600">
                    Last Name
                  </Label>
                  <div className="p-2 text-sm">{projectData.lastName}</div>
                </div>
              </div>

              {/* Project Title */}
              <div className="flex flex-col">
                <Label className="text-sm font-semibold text-blue-600">
                  Project Title
                </Label>
                <div className="p-2 text-sm">{projectData.projectTitle}</div>
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
              <div className="flex flex-col">
                <Label className="text-sm font-semibold text-blue-600">
                  Project Tag Preview:
                </Label>
                <div className="p-2 text-sm font-medium">
                  Mr. {projectData.lastName} wants to{" "}
                  {projectData.projectObjective.toLowerCase()}.
                </div>
              </div>

              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 w-full">
                {/* Category Section */}
                <div className="flex flex-col w-full md:w-1/3">
                  <Label className="text-sm font-semibold text-blue-600">
                    Category:
                  </Label>
                  <div className="p-2 text-sm">{projectData.category}</div>
                </div>

                {/* Duration Section */}
                <div className="flex flex-col w-full md:w-2/4">
                  <div className="flex flex-col space-y-2">
                    <Label className="text-sm font-semibold text-blue-600">
                      Duration
                    </Label>
                    <div className="flex items-center space-x-4">
                      <div className="text-sm">{projectData.duration.from}</div>
                      <span className="text-sm font-semibold text-black">
                        to
                      </span>
                      <div className="text-sm">{projectData.duration.to}</div>
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
                  <div className="p-2 text-sm h-28 md:h-48">
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
              <div className="hidden md:block w-full p-6">
                <div className="grid grid-cols-12 gap-4 mb-4">
                  <div className="w-2 font-medium text-sm pt-2 text-center"></div>
                  <div className="col-span-3 font-medium text-black text-md text-center pt-2">
                    Item
                  </div>
                  <div className="col-span-2 font-medium text-black text-md text-center pt-2">
                    Quantity
                  </div>
                  <div className="col-span-2 font-medium text-black text-md text-center pt-2">
                    By When
                  </div>
                  <div className="col-span-4 font-medium text-black text-md text-center pt-2">
                    Drop Location
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-4">
                  <div className="w-2 mt-2">
                    {projectData.supportItems.map((_, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-center text-sm text-gray-600 h-9 mb-3"
                      >
                        {index + 1 + "."}
                      </div>
                    ))}
                  </div>

                  <div className="col-span-3 border border-gray-200 rounded-md p-3">
                    {projectData.supportItems.map((item, index) => (
                      <div
                        key={index}
                        className="mb-3 p-2 border rounded-md text-sm"
                      >
                        {item.item}
                      </div>
                    ))}
                  </div>

                  <div className="col-span-2 border border-gray-200 rounded-md p-3">
                    {projectData.supportItems.map((item, index) => (
                      <div
                        key={index}
                        className="mb-3 p-2 border rounded-md text-sm text-center"
                      >
                        {item.quantity}
                      </div>
                    ))}
                  </div>

                  <div className="col-span-2 border border-gray-200 rounded-md p-3">
                    {projectData.supportItems.map((item, index) => (
                      <div
                        key={index}
                        className="mb-3 p-2 border rounded-md text-sm text-center"
                      >
                        {item.byWhen}
                      </div>
                    ))}
                  </div>

                  <div className="col-span-4 border border-gray-200 rounded-md p-3">
                    {projectData.supportItems.map((item, index) => (
                      <div
                        key={index}
                        className="mb-3 p-2 border rounded-md text-sm text-center"
                      >
                        {item.dropLocation}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-6 flex flex-row w-full items-center">
                  <Label className="text-sm font-semibold text-blue-600">
                    Other Support:
                  </Label>
                  <div className="p-2 text-sm w-8/12">
                    {projectData.otherSupport}
                  </div>
                  <div className="mt-6 flex flex-row w-full items-center">
                    <Label className="text-sm font-semibold text-blue-600">
                      Map Location
                    </Label>
                    <iframe
                      src={projectData.MapLocation}
                      width="100%"
                      height="450"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                    ></iframe>
                  </div>
                </div>
              </div>

              {/* Updated Mobile View */}
              <div className="md:hidden w-full p-4 space-y-4">
                {projectData.supportItems.map((supportItem, index) => (
                  <div
                    key={index}
                    className="border border-blue-200 p-4 rounded-lg shadow-md flex flex-col space-y-2"
                  >
                    <div className="flex items-center justify-start mb-2">
                      <span className="font-bold text-lg text-blue-600 mr-2">
                        {index + 1}.
                      </span>
                      <span className="block text-md font-semibold">
                        {supportItem.item}
                      </span>
                    </div>

                    <div>
                      <span className="block font-semibold text-sm text-blue-600">
                        Quantity:
                      </span>
                      <span className="block text-md font-medium">
                        {supportItem.quantity}
                      </span>
                    </div>

                    <div>
                      <span className="block font-semibold text-sm text-blue-600">
                        By When:
                      </span>
                      <span className="block text-md font-medium">
                        {supportItem.byWhen}
                      </span>
                    </div>

                    <div>
                      <span className="block font-semibold text-sm text-blue-600">
                        Drop Location:
                      </span>
                      <span className="block text-md font-medium">
                        {supportItem.dropLocation}
                      </span>
                    </div>
                  </div>
                ))}
                <div className="mt-6 flex flex-col md:flex-row items-start md:items-center w-full">
                  <Label className="text-sm font-semibold text-blue-600">
                    Other Support:
                  </Label>
                  <div className="p-2 text-sm w-full md:w-8/12">
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
