"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  Calendar,
  User,
  Tag as TagIcon,
  Download,
  Plus,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { format } from "date-fns";
import html2canvas from "html2canvas";

interface ProjectDetailsProps {
  creator: string;
  title: string;
  preview: string;
  details: string;
  category: string;
  photoCaption: string;
  others: string;
  supportNeeded: SupportItem[];
}

interface SupportItem {
  id: string;
  name: string;
  quantity: number;
  units: string;
  type: string;
}

const supportTypes = [
  "Items",
  "Medical Support",
  "Financial Support",
  "Volunteers",
  "Other",
];

export default function ProjectDetails({
  creator,
  title,
  preview,
  details,
  category,
  photoCaption,
  others,
  supportNeeded,
}: ProjectDetailsProps) {
  const [supportItems, setSupportItems] =
    useState<SupportItem[]>(supportNeeded);
  const [newItemName, setNewItemName] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState(1);
  const [newItemType, setNewItemType] = useState(supportTypes[0]);
  const [newItemUnits, setNewItemUnits] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const projectDetailsRef = useRef<HTMLDivElement>(null);

  const handleAddSupportItem = () => {
    if (newItemName && newItemQuantity > 0) {
      setSupportItems([
        ...supportItems,
        {
          id: Date.now().toString(),
          name: newItemName,
          quantity: newItemQuantity,
          units: newItemUnits,
          type: newItemType,
        },
      ]);
      setNewItemName("");
      setNewItemQuantity(1);
      setNewItemUnits("");
      setNewItemType(supportTypes[0]);
    }
  };

  const handleDownloadPDF = async () => {
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
        link.download = `${title.replace(/\s+/g, "_")}_project_details.png`;
        link.click();
      } catch (error) {
        console.error("Error generating screenshot:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-gray-900">
      <div className="max-w-4xl mx-auto p-6" ref={projectDetailsRef}>
        <Card className="border-4 border-blue-200 rounded-lg shadow-lg overflow-hidden">
          <CardContent className="p-8">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold mb-2">{creator}</h2>
              <p className="text-gray-600">Project Creator</p>
            </div>

            <Separator className="my-8" />

            <div className="mb-8">
              <div className="relative w-full h-64 rounded-lg overflow-hidden shadow-md">
                <Image
                  src={preview}
                  alt={`${title} Preview`}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 hover:scale-105"
                />
              </div>
              <p className="text-sm text-gray-500 mt-2 text-center">
                {photoCaption}
              </p>
            </div>

            <div className="flex flex-wrap gap-4 mb-8 justify-center">
              <Badge variant="secondary" className="text-lg py-1 px-3">
                <TagIcon size={18} className="mr-2 inline-block" />
                {category}
              </Badge>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-blue-600 mb-4">
                Project Duration
              </h3>
              <div className="flex flex-wrap gap-4 justify-between">
                <div className="w-full md:w-auto">
                  <Label htmlFor="start-date" className="mb-2 block">
                    Start Date
                  </Label>
                  <DatePicker
                    selected={startDate}
                    onSelect={setStartDate}
                    customInput={
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {startDate
                          ? format(startDate, "PPP")
                          : "Pick a start date"}
                      </Button>
                    }
                  />
                </div>
                <div className="w-full md:w-auto mt-4 md:mt-0">
                  <Label htmlFor="end-date" className="mb-2 block">
                    End Date
                  </Label>
                  <DatePicker
                    selected={endDate}
                    onSelect={setEndDate}
                    customInput={
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP") : "Pick an end date"}
                      </Button>
                    }
                  />
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-blue-600 mb-4">
                Project Details
              </h3>
              <p className="text-gray-700 leading-relaxed">{details}</p>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-blue-600 mb-4">
                Support Needed
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {supportItems.map((item) => (
                  <Card key={item.id} className="p-4">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity} {item.units}
                    </p>
                    <Badge variant="outline" className="mt-2">
                      {item.type}
                    </Badge>
                  </Card>
                ))}
              </div>
              <Card className="p-4">
                <h4 className="font-semibold mb-2">Add New Support Item</h4>
                <div className="space-y-2">
                  <Select value={newItemType} onValueChange={setNewItemType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select support type" />
                    </SelectTrigger>
                    <SelectContent>
                      {supportTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Support item name"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                  />
                  <div className="flex space-x-2">
                    <Input
                      type="number"
                      placeholder="Quantity"
                      value={newItemQuantity}
                      onChange={(e) =>
                        setNewItemQuantity(parseInt(e.target.value))
                      }
                      min={1}
                      className="w-1/2"
                    />
                    <Input
                      placeholder="Units"
                      value={newItemUnits}
                      onChange={(e) => setNewItemUnits(e.target.value)}
                      className="w-1/2"
                    />
                  </div>
                  <Button onClick={handleAddSupportItem} className="w-full">
                    <Plus className="mr-2 h-4 w-4" /> Add Support Item
                  </Button>
                </div>
              </Card>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-blue-600 mb-4">
                Additional Information
              </h3>
              <p className="text-gray-700 leading-relaxed">{others}</p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 flex justify-end">
          <Button
            onClick={handleDownloadPDF}
            className="bg-green-600 hover:bg-green-700"
          >
            <Download className="mr-2 h-4 w-4" /> Download Screenshot
          </Button>
        </div>
      </div>
    </div>
  );
}

ProjectDetails.defaultProps = {
  creator: "John Doe",
  title: "Innovative Map Project",
  preview: "/placeholder.svg?height=400&width=800",
  details:
    "This project is focused on creating an interactive map platform that helps users navigate and explore different regions. Our goal is to provide a user-friendly interface that combines detailed geographical data with real-time information, making it easier for people to discover and learn about various locations around the world.",
  category: "HDA, Duralin",
  photoCaption: "Preview of the interactive map project interface",
  others:
    "For more information about this project or to discuss potential collaborations, please don't hesitate to reach out to the project creator. We're always open to new ideas and partnerships that can help us improve and expand our platform.",
  supportNeeded: [
    { id: "1", name: "Volunteers", quantity: 5, units: "", type: "Volunteers" },
    { id: "2", name: "Laptops", quantity: 3, units: "", type: "Items" },
    {
      id: "3",
      name: "Office Space",
      quantity: 500,
      units: "sqft",
      type: "Other",
    },
    {
      id: "4",
      name: "Funding",
      quantity: 10000,
      units: "USD",
      type: "Financial",
    },
  ],
};
