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
  Upload,
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

export default function CreateProjectDetails() {
  const [formData, setFormData] = useState({
    creator: "",
    title: "",
    preview: "/placeholder.svg?height=400&width=800",
    details: "",
    category: "",
    photoCaption: "",
    others: "",
  });
  const [supportItems, setSupportItems] = useState<SupportItem[]>([]);
  const [newItemName, setNewItemName] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState(1);
  const [newItemType, setNewItemType] = useState(supportTypes[0]);
  const [newItemUnits, setNewItemUnits] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const projectDetailsRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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
        link.download = `${formData.title.replace(
          /\s+/g,
          "_"
        )}_project_details.png`;
        link.click();
      } catch (error) {
        console.error("Error generating screenshot:", error);
      }
    }
  };
  "use client"
  import React, { useState } from 'react';
  import { Calendar, MapPin, PlusCircle } from 'lucide-react';
  import { Button } from "@/components/ui/button";
  import { Card, CardContent } from "@/components/ui/card";
  import { Input } from "@/components/ui/input";
  import { Textarea } from "@/components/ui/textarea";
  import { Separator } from "@/components/ui/separator";

  const ProjectDetailsForm = () => {
    const [supportItems, setSupportItems] = useState([{}, {}]);

    const handleAddMore = () => {
      setSupportItems([...supportItems, {}]);
    };

    return (
      <div className="h-screen w-screen bg-gradient-to-b from-blue-50 to-white text-gray-900 overflow-hidden">
        <div className="h-full w-full p-4">
          <Card className="h-full border-4 border-blue-200 rounded-lg shadow-lg overflow-hidden">
            <CardContent className="h-full p-4 grid grid-cols-2 gap-12">
              <div className="space-y-4">
                <div className="text-left">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Your Name:</label>
                    <Input placeholder="Enter your name" className="w-full" />
                  </div>

                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">Project Duration</h3>
                  <div className="flex justify-between text-sm gap-4">
                    <div className="w-full">
                      <p className="font-semibold mb-1">Start:</p>
                      <Input type="date" className="w-full" />
                    </div>
                    <div className="w-full">
                      <p className="font-semibold mb-1">End:</p>
                      <Input type="date" className="w-full" />
                    </div>
                  </div>
                </div>
                <Input
                  name="photoCaption"
                  placeholder="Enter photo caption"
                  value={formData.photoCaption}
                  onChange={handleInputChange}
                  className="text-sm text-gray-500 mt-2 text-center"
                />
                <div className="mt-4">
                  <Label htmlFor="preview-upload">Upload Preview Image</Label>
                  <Input
                    id="preview-upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setFormData((prev) => ({
                            ...prev,
                            preview: reader.result as string,
                          }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-blue-600 mb-2">Project Details</h3>
                <Textarea
                  placeholder="Enter project details..."
                  className="w-full h-"
                />
              </div>

              <div className="flex flex-wrap gap-4 mb-8 justify-center">
                <Input
                  name="category"
                  placeholder="Enter project category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="text-lg py-1 px-3"
                />
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-blue-600 mb-4">
                  Project Duration
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* // date but without date picker */}
                  <div>
                    <Label htmlFor="start-date">Start Date</Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={format(startDate as Date, "yyyy-MM-dd")}
                      onChange={(e) => setStartDate(new Date(e.target.value))}
              <div>
                      <h3 className="text-lg font-semibold text-blue-600 mb-2">Location</h3>
                      <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 w-full">
                        <MapPin className="h-4 w-4 text-gray-600" />
                        <Input
                          placeholder="Enter location"
                          className="border-none bg-transparent p-0 focus-visible:ring-0"
                        />

                        <Label htmlFor="end-date">End Date</Label>
                        <Input
                          id="end-date"
                          type="date"
                          value={format(endDate as Date, "yyyy-MM-dd")}
                          onChange={(e) => setEndDate(new Date(e.target.value))}
                </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-blue-600 mb-2">Deadline</h3>

                      <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">

                        <Input
                          type="date"
                          className="flex-1 border-none bg-transparent focus-visible:ring-0"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-blue-600 mb-4">
                      Project Details
                    </h3>
                    <Textarea
                      name="details"
                      placeholder="Enter project details"
                      value={formData.details}
                      onChange={handleInputChange}
                      className="w-full h-32"
                    />
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
                      <h4 className="font-semibold text-2xl mb-2">
                        Add New Support Item
                      </h4>
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
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-lg font-semibold text-blue-600 mb-2">Support Needed</h3>
                            <div className="grid grid-cols-2 gap-2">
                              {supportItems.map((_, index) => (
                                <Card key={index} className="p-2">
                                  <Input
                                    placeholder="Item name"
                                    className="font-medium text-sm mb-1"
                                  />
                                  <div className="flex gap-2 items-center">
                                    <Input
                                      type="number"
                                      placeholder="Quantity"
                                      className="text-xs w-20"
                                    />
                                    <Input
                                      placeholder="Units"
                                      className="text-xs flex-1"
                                    />
                                  </div>
                                  <Input
                                    placeholder="Type (e.g., Volunteers, Items)"
                                    className="mt-1 text-xs"
                                  />
                                </Card>
                              ))}
                            </div>
                            <Button
                              onClick={handleAddMore}
                              variant="outline"
                              className="mt-2 w-full flex items-center justify-center gap-2"
                            >
                              <PlusCircle className="h-4 w-4" />
                              Add More Support Items
                            </Button>
                          </div>

                          <div className="mb-8">
                            <h3 className="text-xl font-semibold text-blue-600 mb-4">
                              Additional Information
                            </h3>
                            <Textarea
                              name="others"
                              placeholder="Enter additional information"
                              value={formData.others}
                              onChange={handleInputChange}
                              className="w-full h-32"
                            />
                            <div>
                              <h3 className="text-lg font-semibold text-blue-600 mb-2">Additional Information</h3>
                              <Textarea
                                placeholder="Enter any additional information..."
                                className="w-full h-32"
                              />
                            </div>

                            <Button className="w-full">Submit</Button>
                          </div>
                        </CardContent>
                    </Card>
                  </div>
                </div>
                );
}

                );
};

                export default ProjectDetailsForm;