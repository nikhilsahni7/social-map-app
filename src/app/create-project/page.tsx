"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusCircle } from "lucide-react";

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

                {/* Project Tag Preview */}
                <div className="flex space-x-4 items-center">
                  <label className="text-sm font-semibold text-blue-600">
                    Project Tag Preview:
                  </label>
                  <div className="flex flex-col items-center justify-end space-x-2 mt-4">
                    <h1 className="text-sm font-medium whitespace-nowrap">Mr. Aakash wants to donate 500 blankets.</h1>
                    <p className="text-xs text-gray-500">
                      (This is how it will appear on the website.)
                    </p>
                  </div>

                </div>



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

                {/* Describe What You Want To Achieve and Picture of Success */}
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
                  <div className="flex flex-col w-full md:w-6/12">
                    <h3 className="text-sm font-semibold text-blue-600">
                      Describe What You Want To Achieve
                    </h3>
                    <Textarea
                      placeholder="Enter project details..."
                      className="text-sm"
                    />
                  </div>

                  <div className="flex flex-col w-full md:w-6/12">
                    <h3 className="text-sm font-semibold text-blue-600">
                      Picture Of Success
                    </h3>
                    <div
                      className={`w-10/12 h-48 border-2 border-gray-300 rounded-lg flex justify-center items-center cursor-pointer ${isDragActive ? "border-blue-500" : ""
                        }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() =>
                        document.getElementById("fileInput")?.click()
                      }
                    >
                      {file ? (
                        <p className="text-sm text-gray-600">
                          {file.name} <br />
                          <span className="text-xs text-blue-600">
                            Click to change
                          </span>
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
                </div>

                {/* Supports Needed */}

                <h2 className="text-lg font-semibold text-blue-600 mb-6">
                  Supports Needed
                </h2>
                <div className="w-full p-6">
                  <div className="grid grid-cols-12 gap-4 mb-4">
                    <div className="col-span-1 font-medium text-gray-600 text-sm pt-2 text-center"></div>
                    <div className="col-span-4 font-medium text-gray-600 text-sm text-center pt-2 pl-6">Item</div>
                    <div className="col-span-2 font-medium text-gray-600 text-sm text-center pt-2">Quantity</div>
                    <div className="col-span-2 font-medium text-gray-600 text-sm text-center pt-2">By When</div>
                    <div className="col-span-3 font-medium text-gray-600 text-sm text-center pt-2">Drop Location</div>
                  </div>

                  <div className="grid grid-cols-12 gap-4">
                    {/* Serial Numbers Column */}
                    <div className="col-span-1 mt-2">
                      {supportItems.map((_, index) => (
                        <div key={index} className="flex items-center justify-center text-sm text-gray-600 h-9 mb-3">
                          {index + 1 + "."}
                        </div>
                      ))}
                    </div>

                    {/* Items Column */}
                    <div className="col-span-4 border border-gray-200 rounded-md p-3">
                      {supportItems.map((item, index) => (
                        <div key={index} className="mb-3">
                          <Input
                            id={`item-${index}`}
                            value={item.item}
                            onChange={(e) => handleInputChange(index, 'item', e.target.value)}
                            className="w-full h-9 text-sm"
                            placeholder="Enter item"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Quantity Column */}
                    <div className="col-span-2 border border-gray-200 rounded-md p-3">
                      {supportItems.map((item, index) => (
                        <div key={index} className="mb-3">
                          <Input
                            type="number"
                            id={`quantity-${index}`}
                            value={item.quantity}
                            onChange={(e) => handleInputChange(index, 'quantity', e.target.value)}
                            className="w-full h-9 text-sm text-center"
                            placeholder="Quantity"
                          />
                        </div>
                      ))}
                    </div>

                    {/* By When Column */}
                    <div className="col-span-2 border border-gray-200 rounded-md p-3">
                      {supportItems.map((item, index) => (
                        <div key={index} className="mb-3">
                          <Input
                            type="date"
                            id={`byWhen-${index}`}
                            value={item.byWhen}
                            onChange={(e) => handleInputChange(index, 'byWhen', e.target.value)}
                            className="w-full h-9 text-sm text-center"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Drop Location Column */}
                    <div className="col-span-3 border border-gray-200 rounded-md p-3">
                      {supportItems.map((item, index) => (
                        <div key={index} className="mb-3">
                          <Input
                            id={`dropLocation-${index}`}
                            value={item.dropLocation}
                            onChange={(e) => handleInputChange(index, 'dropLocation', e.target.value)}
                            className="w-full h-9 text-sm text-center"
                            placeholder="Location"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Add Row Button */}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddRow}
                    className="mt-4 text-sm font-medium text-black hover:text-blue-700 hover:bg-blue-50"
                  >
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Add Support Items
                  </Button>

                  {/* Other Support Section */}
                  <div className="mt-6 flex items-center gap-4">
                    <span className="text-sm font-medium text-blue-600">
                      Specify Other Support:
                    </span>
                    <Input
                      placeholder="Other support needed..."
                      className="w-96 h-9 text-sm"
                    />
                  </div>
                </div>





              </div>
            </CardContent>
          </ScrollArea>
        </Card>

        <div className="flex flex-row justify-center gap-6">
          <div className="flex justify-center mt-3">
            <Button
              type="submit"
              className="text-sm w-12px max-w-xs bg-blue-600 hover:bg-blue-700 text-white"
            >
              Preview
            </Button>
          </div>
          <div className="flex justify-center mt-3">
            <Button
              type="submit"
              className="text-sm w-12px max-w-xs bg-blue-600 hover:bg-blue-700 text-white"
            >
              Submit
            </Button>
          </div>
        </div>

      </form >
    </div >
  );
}
