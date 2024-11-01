"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusCircle } from "lucide-react";
import { Label } from "@/components/ui/label";

export default function ProjectDetailsForm() {
  const [supportItems, setSupportItems] = useState([
    { item: "", quantity: "", byWhen: "", dropLocation: "" },
  ]);

  const [file, setFile] = useState<File | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);

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

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      setFile(files[0]);
    }
    setIsDragActive(false);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted", supportItems);
  };

  return (
    <div className="w-full max-w-full p-2">
      {/* Create Your Own Project Header */}
      <h2 className="text-2xl font-bold text-center mb-4 text-blue-600">
        Create Your Own Project
      </h2>

      <form onSubmit={handleSubmit} className="w-full">
        <Card className="border-2 border-blue-200 rounded-lg overflow-hidden w-full">
          <ScrollArea className="h-full">
            <CardContent className="p-4 grid grid-cols-1 gap-4">
              <div className="space-y-3">
                {/* First Name and Last Name */}
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
                  <div className="flex flex-col w-full md:w-1/6">
                    <label className="text-sm font-semibold text-blue-600">
                      First Name
                    </label>
                    <Input
                      placeholder="Enter your first name"
                      className="text-sm"
                    />
                  </div>
                  <div className="flex flex-col w-full md:w-1/6">
                    <label className="text-sm font-semibold text-blue-600">
                      Last Name
                    </label>
                    <Input
                      placeholder="Enter your last name"
                      className="text-sm"
                    />
                  </div>
                </div>

                {/* Project Title */}
                <div className="flex flex-col">
                  <h3 className="text-sm font-semibold text-blue-600">
                    Project Title
                  </h3>
                  <Input
                    placeholder="Enter your Project Title"
                    className="text-sm"
                  />
                </div>

                {/* Project Objective */}
                <div className="flex flex-col">
                  <h3 className="text-sm font-semibold text-blue-600">
                    Project Objective
                  </h3>
                  <Textarea
                    placeholder="Enter project objective..."
                    className="text-sm"
                  />
                </div>

                <div className="flex space-x-6 items-center">
                  <label className="text-sm font-semibold text-blue-600">
                    Project Tag Preview:
                  </label>
                  <div className="flex items-center space-x-2">
                    <h1 className="text-sm font-medium whitespace-nowrap">Mr. XXX wants to</h1>
                    <Input placeholder="Enter objective" className="text-sm w-64" />
                  </div>
                </div>

                {/* Describe What You Want To Achieve */}
                <div className="flex flex-col">
                  <h3 className="text-sm font-semibold text-blue-600">
                    Describe What You Want To Achieve
                  </h3>
                  <Textarea
                    placeholder="Enter project details..."
                    className="text-sm"
                  />
                </div>

                {/* Category Selection */}
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 w-full">
                  <div className="flex flex-col w-full md:w-1/3">
                    <label className="text-sm font-semibold text-blue-600">
                      Category:
                    </label>
                    <div className="flex space-x-4 flex-wrap">
                      <Button variant="outline" className="text-sm">
                        Human
                      </Button>
                      <Button variant="outline" className="text-sm">
                        Plant
                      </Button>
                      <Button variant="outline" className="text-sm">
                        Animal
                      </Button>
                    </div>
                  </div>

                  {/* Duration Section */}
                  <div className="flex flex-col w-full md:w-2/4">
                    <label className="text-sm font-semibold text-blue-600">
                      Duration
                    </label>
                    <div className="flex space-x-4 w-8/12">
                      <input
                        type="date"
                        id="fromDate"
                        name="fromDate"
                        className="w-4/12 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-200 text-sm"
                      />
                      <span className="text-sm font-semibold text-black">to</span>
                      <input
                        type="date"
                        id="toDate"
                        name="toDate"
                        className="w-4/12 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-200 text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Picture of Success - Drag and Drop Area */}
                <div className="flex flex-col">
                  <h3 className="text-sm font-semibold text-blue-600">
                    Image
                  </h3>
                  <div
                    className={`w-full md:w-4/12 h-44 border-2 border-gray-300 rounded-lg flex justify-center items-center cursor-pointer ${isDragActive ? "border-blue-500" : ""
                      }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById("fileInput")?.click()}
                  >
                    {file ? (
                      <p className="text-sm text-gray-600">
                        {file.name} <br />
                        <span className="text-xs text-blue-600">Click to change</span>
                      </p>
                    ) : (
                      <p className="text-sm text-gray-600">
                        Drag & drop your file here, or click to upload
                      </p>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      id="fileInput"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files) {
                          setFile(e.target.files[0]);
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Support Needed */}
                <div>
                  <h3 className="text-sm font-semibold text-blue-600 mb-2">
                    Support Needed
                  </h3>

                  {supportItems.map((support, index) => (
                    <div
                      key={index}
                      className="flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-2 mb-2 p-2 border rounded-md w-full"
                    >
                      <span className="text-sm mr-2">{index + 1 + "."}</span>
                      <div className="flex flex-row items-center w-full md:w-6/12">
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
                          className="text-xs w-8/12"
                        />
                      </div>

                      <div className="flex flex-row items-center w-full md:w-6/12">
                        <Label
                          htmlFor={`supportQuantity-${index}`}
                          className="text-xs font-medium text-gray-700 mr-2"
                        >
                          Quantity
                        </Label>
                        <Input
                          id={`supportQuantity-${index}`}
                          value={support.quantity}
                          onChange={(e) =>
                            handleInputChange(index, "quantity", e.target.value)
                          }
                          className="text-xs w-8/12"
                        />
                      </div>

                      <div className="flex flex-row items-center w-full md:w-6/12">
                        <Label
                          htmlFor={`supportByWhen-${index}`}
                          className="text-xs font-medium text-gray-700 mr-2"
                        >
                          By When
                        </Label>
                        <Input
                          id={`supportByWhen-${index}`}
                          value={support.byWhen}
                          onChange={(e) =>
                            handleInputChange(index, "byWhen", e.target.value)
                          }
                          className="text-xs w-8/12"
                        />
                      </div>

                      <div className="flex flex-row items-center w-full md:w-6/12">
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
                          className="text-xs w-8/12"
                        />
                      </div>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddRow}
                    className="flex items-center text-sm mb-2"
                  >
                    <PlusCircle className="mr-2" />
                    Add Support Item
                  </Button>
                </div>
              </div>
            </CardContent>
          </ScrollArea>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-center mt-4">
          <Button
            type="submit"
            className="text-sm w-12px max-w-xs bg-blue-600 hover:bg-blue-700 text-white"
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
}
