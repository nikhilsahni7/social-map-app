"use client";

import React, { useRef } from "react";
import { MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import html2canvas from "html2canvas";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const ProjectDetails: React.FC = () => {
  const projectDetailsRef = useRef<HTMLDivElement>(null);

  const handleDownloadScreenshot = async () => {
    if (projectDetailsRef.current) {
      try {
        const canvas = await html2canvas(projectDetailsRef.current, {
          scale: 2,
          logging: false,
          useCORS: true,
        });
        const image = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = image;
        link.download = "Innovative_Map_Project_details.png";
        link.click();
      } catch (error) {
        console.error("Error generating screenshot:", error);
      }
    }
  };

  // Hard-coded data
  const creator = "John Doe";
  const title = "Social Impact Advocate & Digital Community Builder";
  const details =
    "This project is focused on creating an interactive map platform that helps users navigate and explore different regions. Our goal is to provide a user-friendly interface that combines detailed geographical data with real-time information, making it easier for people to discover and learn about various locations around the world.";

  const supportNeeded = [
    { id: "1", name: "Volunteers", quantity: 5, units: "", type: "Volunteers" },
    { id: "2", name: "Laptops", quantity: 3, units: "", type: "Items" },
    { id: "3", name: "Office Space", quantity: 500, units: "sqft", type: "Other" },
    { id: "4", name: "Funding", quantity: 10000, units: "USD", type: "Financial" },
  ];

  const location = "San Francisco, CA"; // You may want to display this somewhere.

  const others =
    "For more information about this project or to discuss potential collaborations, please don't hesitate to reach out to the project creator. We're always open to new ideas and partnerships that can help us improve and expand our platform.";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white text-gray-900 overflow-hidden">
      <div className="w-full max-w-2xl p-4" ref={projectDetailsRef}>
        <Card className="border-4 border-blue-200 rounded-lg shadow-lg overflow-hidden">
          <CardContent className="p-4 flex flex-col gap-4">
            {/* Project Creator Name */}
            <div className="text-left flex flex-row items-center space-x-2">
              <label className="text-md font-semibold text-blue-600">
                Project Creator Name:
              </label>
              <h2 className="text-xl font-semibold">{creator}</h2>
            </div>

            <div className="text-left items-center space-x-2 space-y-2">
              <label className="text-md font-semibold text-blue-600">
                Project Title/Objective:
              </label>
              <h2 className="text-lg font-semibold">{title}</h2>
            </div>

            {/* Project Tag Preview */}
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-2">
              <label className="text-md font-semibold text-blue-600">
                Project Tag Preview:
              </label>
              <h1 className="text-sm font-semibold">Mr. XXX wants to support Organization Name</h1>
            </div>


            {/* Project Details */}
            <div>
              <h3 className="text-md font-semibold text-blue-600 mb-2">Project Details</h3>
              <ScrollArea className="h-[100px] max-h-48 overflow-y-auto">
                <p className="text-sm font-medium text-black leading-tight">{details}</p>
              </ScrollArea>
            </div>

            {/* Category, Duration, and Photo Section */}
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-8 items-center -mt-2">
              {/* Category Section */}
              <div className="flex flex-col space-y-2 w-full md:w-1/4">
                <Label htmlFor="category" className="text-md font-semibold text-blue-600">
                  Category
                </Label>
                <Label htmlFor="category" className="text-md ml-2 font-semibold text-black">
                  NGO
                </Label>

              </div>

              {/* Duration Section */}
              <div className="flex flex-col space-y-2 w-full md:w-2/4">
                <Label htmlFor="duration" className="text-md font-semibold text-blue-600">
                  Duration
                </Label>
                <div className="flex space-x-2">
                  <h1 className="text-md font-semibold">21-4-2020</h1>
                  <span className="text-md font-semibold text-black">to</span>
                  <h1 className="text-md font-semibold">12-6-2020</h1>
                </div>
              </div>

              {/* Photo Section */}
              <div className="flex flex-col space-y-2 w-full md:w-1/4">
                <Label htmlFor="photo" className="text-md font-semibold text-blue-600">
                  Photo
                </Label>
                <div className="mt-2">
                  <Image
                    width={3}
                    height={3}
                    src=""
                    alt="Selected"
                    className="w-24 h-auto md:w-full rounded-md border border-gray-300"
                  />
                </div>
              </div>

            </div>
            <div className="text-left items-center space-x-2 space-y-2">
              <label className="text-md font-semibold text-blue-600">
                Support Provided
              </label>
              <ScrollArea className="h-[170px] max-h-44 overflow-y-auto">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                  {supportNeeded.map((item) => (
                    <Card key={item.id} className="p-2">
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        Quantity: {item.quantity} {item.units}
                      </p>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {item.type}
                      </Badge>
                    </Card>
                  ))}
                </div>
              </ScrollArea>



            </div>
          </CardContent>









        </Card>
      </div>
    </div>
  );
};

export default ProjectDetails;
