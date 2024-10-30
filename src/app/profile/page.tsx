"use client";

import React, { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";

const ProjectDetails: React.FC = () => {
  const projectDetailsRef = useRef<HTMLDivElement>(null);
  const supportItems = [
    { item: "Laptop", quantity: "1", byWhen: "2024-12-01", dropLocation: "Library" },
    { item: "Stationery", quantity: "10", byWhen: "2024-11-15", dropLocation: "Classroom" },
    { item: "Projector", quantity: "1", byWhen: "2024-11-25", dropLocation: "Main Hall" },
  ];
  const specifySupport = "Additional funding for resources and materials to enhance project outcomes and ensure the availability of necessary tools.";

  return (

    <div className="w-full max-w-full p-2" ref={projectDetailsRef}>
      <Card className="border-2 border-blue-200 rounded-lg overflow-hidden w-full h-full">
        <ScrollArea className="h-full">
          <CardContent className="p-4 grid grid-cols-1 gap-4">
            <div className="space-y-4">
              {/* Project Creator Name */}
              <div className="flex flex-row items-center space-x-2">
                <label className="text-sm font-semibold text-blue-600">
                  Project Creator Name:
                </label>
                <span className="text-sm">John Doe</span>
              </div>

              {/* Project Title/Objective */}
              <div className="flex flex-row items-center space-x-2">
                <h3 className="text-sm font-semibold text-blue-600">
                  Project Title/Objective:
                </h3>
                <span className="text-sm">Innovative Mapping Project</span>
              </div>

              {/* Project Tag Preview */}
              <div className="flex flex-row items-center space-x-2">
                <label className="text-sm font-semibold text-blue-600">
                  Project Tag Preview:
                </label>
                <div className="flex space-x-2 items-center w-9/12">
                  <h1 className="text-sm font-medium">Mr. XXX wants to</h1>
                  <span className="text-sm">explore new areas.</span>
                </div>
              </div>

              {/* Project Details */}
              <div className="flex flex-col items-start space-y-2">
                <h3 className="text-sm font-semibold text-blue-600 text-left">
                  Project Details:
                </h3>
                <span className="text-sm">
                  This project aims to utilize advanced mapping techniques to visualize unexplored territories and promote awareness among local communities. By engaging with local stakeholders, we will gather valuable insights that can inform decision-making processes and drive meaningful change.
                </span>
              </div>

              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 items-center w-full">
                {/* Category Section */}
                <div className="flex flex-row space-x-2 items-center w-full md:w-1/3">
                  <Label htmlFor="category" className="text-sm font-semibold text-blue-600">
                    Category:
                  </Label>
                  <span className="text-sm">Humans</span>
                </div>

                {/* Duration Section */}
                <div className="flex flex-row space-x-2 items-center w-full md:w-1/3">
                  <Label htmlFor="duration" className="text-sm font-semibold text-blue-600">
                    Duration:
                  </Label>
                  <div className="flex space-x-2 w-full">
                    <span className="text-sm">From: 2024-01-01</span>
                    <span className="text-sm">to 2024-12-31</span>
                  </div>
                </div>

                {/* Photo Section */}
                <div className="flex flex-row space-x-2 items-center w-full md:w-1/3">
                  <Label htmlFor="photo" className="text-sm font-semibold text-blue-600">
                    Image:
                  </Label>
                  <span className="text-sm">project_image.png</span>
                </div>
              </div>

              {/* Support Needed */}
              <div>
                <h3 className="text-sm font-semibold text-blue-600 mb-2">
                  Support Needed
                </h3>

                {/* Support Item Rows */}
                {supportItems.map((support, index) => (
                  <div
                    key={index}
                    className="flex flex-row space-x-2 mb-2 p-2 border rounded-md w-full"
                  >
                    {/* Static for Item */}
                    <div className="flex flex-col w-6/12">
                      <div className="flex flex-row items-center">
                        <Label htmlFor={`supportItem-${index}`} className="text-xs font-medium text-gray-700 mr-2">
                          Item
                        </Label>
                        <span className="text-sm">{support.item}</span>
                      </div>
                    </div>

                    {/* Static for Quantity Needed */}
                    <div className="flex flex-col w-8/12">
                      <div className="flex flex-row items-center">
                        <Label htmlFor={`supportQuantity-${index}`} className="text-xs font-medium text-gray-700 mr-2">
                          Quantity Needed
                        </Label>
                        <span className="text-sm">{support.quantity}</span>
                      </div>
                    </div>

                    {/* Static for By When */}
                    <div className="flex flex-col w-8/12">
                      <div className="flex flex-row items-center">
                        <Label htmlFor={`supportByWhen-${index}`} className="text-xs font-medium text-gray-700 mr-2">
                          By When
                        </Label>
                        <span className="text-sm">{support.byWhen}</span>
                      </div>
                    </div>

                    {/* Static for Drop Location */}
                    <div className="flex flex-col w-8/12">
                      <div className="flex flex-row items-center">
                        <Label htmlFor={`supportDropLocation-${index}`} className="text-xs font-medium text-gray-700 mr-2">
                          Drop Location
                        </Label>
                        <span className="text-sm">{support.dropLocation}</span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Specify Support Section */}
                <div className="flex flex-col mb-4">
                  <Label htmlFor="specifySupport" className="text-sm font-semibold text-blue-600">
                    Specify Support Needed:
                  </Label>
                  <span className="text-sm">{specifySupport}</span>
                </div>
              </div>

              {/* Additional Information */}
              <div className="flex flex-col">
                <h3 className="text-sm font-semibold text-blue-600 mb-2">
                  Additional Information
                </h3>
                <span className="text-sm">
                  This project aims to utilize advanced mapping techniques to visualize unexplored territories and promote awareness among local communities. This project not only focuses on mapping but also emphasizes the importance of community involvement and education. Through workshops and outreach programs, we aim to empower individuals to utilize mapping tools and technologies for their benefit. Our goal is to foster a culture of collaboration and innovation, ultimately contributing to sustainable development in the region.
                </span>
              </div>
            </div>
          </CardContent>
        </ScrollArea>
      </Card>
    </div>

  );
};

export default ProjectDetails;
