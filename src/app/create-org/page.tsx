"use client";

import React, { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function ProjectDetailsForm() {
  const [supportItems, setSupportItems] = useState<{
    item: string;
    quantity: string;
    byWhen: string;
    dropLocation: string;
  }[]>([
    { item: "", quantity: "", byWhen: "", dropLocation: "" },
    { item: "", quantity: "", byWhen: "", dropLocation: "" },
  ]);

  const [specifySupport, setSpecifySupport] = useState('');

  const handleInputChange = (
    rowIndex: number,
    field: keyof typeof supportItems[0],
    value: string
  ) => {
    setSupportItems((prev) => {
      const newItems = [...prev];
      newItems[rowIndex][field] = value;
      return newItems;
    });
  };

  const handleAddRow = () => {
    setSupportItems((prev) => [
      ...prev,
      { item: "", quantity: "", byWhen: "", dropLocation: "" },
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted", supportItems);
  };

  return (
    <div className="w-full max-w-full p-2">
      <form onSubmit={handleSubmit} className="w-full">
        <Card className="border-2 border-blue-200 rounded-lg overflow-hidden w-full">
          <ScrollArea className="h-full">
            <CardContent className="p-4 grid grid-cols-1 gap-4">
              <div className="space-y-2">
                {/* Project Creator Name */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                  <label className="text-sm font-semibold text-blue-600">
                    Project Creator Name:
                  </label>
                  <Input
                    placeholder="Enter your name"
                    className="w-full sm:w-10/12 text-sm"
                  />
                </div>

                {/* Project Title/Objective */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                  <h3 className="text-sm font-semibold text-blue-600">
                    Project Title/Objective:
                  </h3>
                  <Textarea
                    placeholder="Enter project details..."
                    className="w-full sm:w-10/12 h-10 border border-gray-300 rounded-md text-sm"
                  />
                </div>

                {/* Project Tag Preview */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                  <label className="text-sm font-semibold text-blue-600">
                    Project Tag Preview:
                  </label>
                  <div className="flex space-x-2 items-center w-full sm:w-9/12">
                    <h1 className="text-sm font-medium">Mr. XXX wants to</h1>
                    <Input placeholder="" className="w-full sm:w-60 text-sm" />
                  </div>
                </div>

                {/* Project Details */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                  <h3 className="text-sm font-semibold text-blue-600">
                    Project Details:
                  </h3>
                  <Textarea
                    placeholder="Enter project details..."
                    className="w-full sm:w-10/12 h-10 border border-gray-300 rounded-md text-sm"
                  />
                </div>

                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 w-full">
                  {/* Category Section */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full md:w-1/3">
                    <Label
                      htmlFor="category"
                      className="text-sm font-semibold text-blue-600"
                    >
                      Category:
                    </Label>
                    <Select>
                      <SelectTrigger id="category" className="w-full sm:w-8/12 text-sm">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Humans">Humans</SelectItem>
                        <SelectItem value="Animal">Animal</SelectItem>
                        <SelectItem value="Plants">Plants</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Duration Section */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full md:w-1/3">
                    <Label
                      htmlFor="duration"
                      className="text-sm font-semibold text-blue-600"
                    >
                      Duration:
                    </Label>
                    <div className="flex space-x-2 w-full">
                      <input
                        type="date"
                        id="fromDate"
                        name="fromDate"
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-200 text-sm"
                      />
                      <span className="text-sm font-semibold text-black">to</span>
                      <input
                        type="date"
                        id="toDate"
                        name="toDate"
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-200 text-sm"
                      />
                    </div>
                  </div>

                  {/* Photo Section */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full md:w-1/3">
                    <Label
                      htmlFor="photo"
                      className="text-sm font-semibold text-blue-600"
                    >
                      Image:
                    </Label>
                    <input
                      type="file"
                      id="photo"
                      name="photo"
                      accept="image/*"
                      className="block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                  </div>
                </div>

                {/* Support Needed */}
                <div>
                  <h3 className="text-sm font-semibold text-blue-600 mb-2">
                    Support Nedded
                  </h3>

                  {/* Support Item Rows */}
                  {supportItems.map((support, index) => (
                    <div
                      key={index}
                      className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-2 p-2 border rounded-md w-full"
                    >
                      {/* Input for Item */}
                      <div className="flex flex-col w-full md:w-6/12">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center">
                          <Label
                            htmlFor={`supportItem-${index}`}
                            className="text-xs font-medium text-gray-700 mr-2"
                          >
                            Item
                          </Label>
                          <Input
                            id={`supportItem-${index}`}
                            value={support.item}
                            onChange={(e) =>
                              handleInputChange(index, "item", e.target.value)
                            }
                            placeholder="Enter item"
                            className="w-full sm:w-9/12 text-sm"
                          />
                        </div>
                      </div>

                      {/* Input for Quantity Needed */}
                      <div className="flex flex-col w-full md:w-8/12">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center">
                          <Label
                            htmlFor={`supportQuantity-${index}`}
                            className="text-xs font-medium text-gray-700 mr-2"
                          >
                            Quantity Needed
                          </Label>
                          <Input
                            id={`supportQuantity-${index}`}
                            value={support.quantity}
                            onChange={(e) =>
                              handleInputChange(index, "quantity", e.target.value)
                            }
                            placeholder="Enter quantity"
                            className="w-full sm:w-6/12 text-sm"
                          />
                        </div>
                      </div>

                      {/* Input for By When */}
                      <div className="flex flex-col w-full md:w-8/12">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center">
                          <Label
                            htmlFor={`supportByWhen-${index}`}
                            className="text-xs font-medium text-gray-700 mr-2"
                          >
                            By When Needed
                          </Label>
                          <Input
                            id={`supportByWhen-${index}`}
                            value={support.byWhen}
                            onChange={(e) =>
                              handleInputChange(index, "byWhen", e.target.value)
                            }
                            placeholder="Enter date"
                            className="w-full sm:w-6/12 text-sm"
                          />
                        </div>
                      </div>

                      {/* Input for Drop Location */}
                      <div className="flex flex-col w-full md:w-8/12">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center">
                          <Label
                            htmlFor={`supportDropLocation-${index}`}
                            className="text-xs font-medium text-gray-700 mr-2"
                          >
                            Drop Location
                          </Label>
                          <Input
                            id={`supportDropLocation-${index}`}
                            value={support.dropLocation}
                            onChange={(e) =>
                              handleInputChange(index, "dropLocation", e.target.value)
                            }
                            placeholder="Enter location"
                            className="w-full sm:w-6/12 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-end">
                    <Button type="button" onClick={handleAddRow} variant="ghost">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Row
                    </Button>
                  </div>
                </div>

                {/* Specify Other Support */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                  <h3 className="text-sm font-semibold text-blue-600">
                    Specify Other Support:
                  </h3>
                  <Textarea
                    placeholder="Other support needed..."
                    className="w-full sm:w-10/12 h-10 border border-gray-300 rounded-md text-sm"
                    value={specifySupport}
                    onChange={(e) => setSpecifySupport(e.target.value)}
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-center w-full">
                  <Button type="submit" className="bg-blue-600 text-white">
                    Submit
                  </Button>
                </div>
              </div>
            </CardContent>
          </ScrollArea>
        </Card>
      </form>
    </div>
  );
}
