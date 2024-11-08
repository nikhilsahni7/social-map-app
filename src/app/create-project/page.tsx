"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, PlusCircle } from "lucide-react";
import { getAuthToken } from "@/lib/clientAuth";
import { toast } from "react-hot-toast";
import Image from "next/image";

interface FormData {
  firstName: string;
  lastName: string;
  title: string;
  objective: string;
  description: string;
  category: string;
  startDate: string;
  endDate: string;
  pictureOfSuccess: File | null;
  otherSupport: string;
  address: string;
  latitude: string;
  longitude: string;
}

export default function ProjectDetailsForm() {
  const [supportItems, setSupportItems] = useState([
    { item: "", quantity: "", byWhen: "", dropLocation: "" },
    { item: "", quantity: "", byWhen: "", dropLocation: "" },
    { item: "", quantity: "", byWhen: "", dropLocation: "" }
  ]);

  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedCategory, setSelectedCategory] = useState("Human");
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    title: "",
    objective: "",
    description: "",
    category: "Human",
    startDate: "",
    endDate: "",
    pictureOfSuccess: null,
    otherSupport: "",
    address: "",
    latitude: "",
    longitude: "",
  });

  const handleInputChange = (
    rowIndex: number,
    field: keyof (typeof supportItems)[0],
    value: string
  ) => {
    setSupportItems((prev) => {
      const newItems = [...prev];
      newItems[rowIndex][field] = value;
      return newItems;
    });
  };

  const handleFormInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddRow = () => {
    setSupportItems((prev) => [
      ...prev,
      { item: "", quantity: "", byWhen: "", dropLocation: "" },
      
    ]);
  };

  const handleFileChange = (file: File) => {
    setFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    setFormData((prev) => ({
      ...prev,
      pictureOfSuccess: file,
    }));
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      handleFileChange(files[0]);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getAuthToken();

    if (!token) {
      toast.error("Please login to create a project");
      return;
    }

    setIsLoading(true);

    try {
      const formDataToSend = new FormData();

      // Append all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "pictureOfSuccess") {
          formDataToSend.append(key, value);
        }
      });

      if (file) {
        formDataToSend.append("pictureOfSuccess", file);
      }

      formDataToSend.append("supportItems", JSON.stringify(supportItems));
      formDataToSend.append("category", selectedCategory);

      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Project created successfully!");
        // Reset form or redirect
      } else {
        toast.error(data.error || "Failed to create project");
      }
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("An error occurred while creating the project");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-full p-2">
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
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleFormInputChange}
                      placeholder="Enter your first name"
                      className="text-sm"
                    />
                  </div>
                  <div className="flex flex-col w-full md:w-1/6">
                    <label className="text-sm font-semibold text-blue-600">
                      Last Name
                    </label>
                    <Input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleFormInputChange}
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
                    name="title"
                    value={formData.title}
                    onChange={handleFormInputChange}
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
                    name="objective"
                    value={formData.objective}
                    onChange={handleFormInputChange}
                    placeholder="Enter project objective..."
                    className="text-sm"
                  />
                </div>

                {/* Project Tag Preview */}
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                  <label className="text-sm font-semibold text-blue-600">
                    Project Tag Preview:
                  </label>
                  <div className="flex flex-col items-start md:items-center justify-end space-y-1 md:space-y-0 md:space-x-2">
                    <h1 className="text-sm font-medium">
                      {formData.firstName
                        ? `${formData.firstName} wants to ${formData.objective}`
                        : "Mr. Aakash wants to donate 500 blankets."}
                    </h1>
                    <p className="text-xs text-gray-500">
                      (This is how it will appear on the website)
                    </p>
                  </div>
                </div>

                {/* Category and Duration */}
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-2 md:space-x-2 w-full">
                  <div className="flex flex-col w-full md:w-1/3 gap-1">
                    <label className="text-sm font-semibold text-blue-600">
                      Category:
                    </label>
                    <div className="flex space-x-4 flex-wrap">
                      {["Human", "Plant", "Animal"].map((category) => (
                        <Button
                          key={category}
                          type="button"
                          variant={
                            selectedCategory === category
                              ? "default"
                              : "outline"
                          }
                          className="text-sm"
                          onClick={() => setSelectedCategory(category)}
                        >
                          {category}
                        </Button>
                      ))}
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
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleFormInputChange}
                        className="w-4/12 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-200 text-sm"
                      />
                      <span className="text-sm font-semibold text-black">
                        to
                      </span>
                      <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleFormInputChange}
                        className="w-4/12 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-200 text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Location Fields */}
                <div className="flex flex-col space-y-2">
                  <h3 className="text-sm font-semibold text-blue-600">
                    Location Details
                  </h3>
                  <Input
                    name="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleFormInputChange}
                    className="text-sm"
                  />
                  <div className="flex space-x-2">
                    <Input
                      name="latitude"
                      placeholder="Latitude"
                      value={formData.latitude}
                      onChange={handleFormInputChange}
                      className="text-sm"
                      type="number"
                      step="any"
                    />
                    <Input
                      name="longitude"
                      placeholder="Longitude"
                      value={formData.longitude}
                      onChange={handleFormInputChange}
                      className="text-sm"
                      type="number"
                      step="any"
                    />
                  </div>
                </div>

                {/* Describe What You Want To Achieve and Picture of Success */}
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
                  <div className="flex flex-col w-full md:w-6/12">
                    <h3 className="text-sm font-semibold text-blue-600">
                      Describe What You Want To Achieve
                    </h3>
                    <Textarea
                      name="description"
                      value={formData.description}
                      onChange={handleFormInputChange}
                      placeholder="Enter project details..."
                      className="text-sm h-48"
                    />
                  </div>

                  <div className="flex flex-col w-full md:w-6/12">
                    <h3 className="text-sm font-semibold text-blue-600">
                      Picture Of Success ~ Help People See What You Have In Mind
                    </h3>
                    <div
                      className={`w-10/12 h-48 border-2 border-gray-300 rounded-lg flex justify-center items-center cursor-pointer ${isDragActive ? "border-blue-500" : ""
                        }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {imagePreview ? (
                        <div className="w-full h-full relative">
                          <Image
                            width={20}
                            height={20}
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-full object-contain"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity">
                            <p className="text-white text-sm">
                              Click to change
                            </p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-600">
                          Drag & drop your file here, or click to upload
                        </p>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handleFileChange(e.target.files[0]);
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
                  {/* Desktop view */}
                  <div className="hidden md:block">
                    <div className="grid grid-cols-12 gap-4 mb-4">
                      <div className="font-medium text-sm w-2 pt-2 text-center"></div>
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
                      {/* Serial Numbers Column */}
                      <div className="w-2 mt-2">
                        {supportItems.map((_, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-center text-sm text-gray-600 h-9 mb-3"
                          >
                            {index + 1 + "."}
                          </div>
                        ))}
                      </div>

                      {/* Items Column */}
                      <div className="col-span-3 border border-gray-200 rounded-md p-3">
                        {supportItems.map((item, index) => (
                          <div key={index} className="mb-3">
                            <Input
                              id={`item-${index}`}
                              value={item.item}
                              onChange={(e) =>
                                handleInputChange(index, "item", e.target.value)
                              }
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
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "quantity",
                                  e.target.value
                                )
                              }
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
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "byWhen",
                                  e.target.value
                                )
                              }
                              className="w-full h-9 text-sm text-center"
                            />
                          </div>
                        ))}
                      </div>

                      {/* Drop Location Column */}
                      <div className="col-span-4 border border-gray-200 rounded-md p-3">
                        {supportItems.map((item, index) => (
                          <div key={index} className="mb-3">
                            <Input
                              id={`dropLocation-${index}`}
                              value={item.dropLocation}
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "dropLocation",
                                  e.target.value
                                )
                              }
                              className="w-full h-9 text-sm text-center"
                              placeholder="Location"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Mobile view */}
                  <div className="md:hidden space-y-4">
                    {supportItems.map((item, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-md p-4 space-y-2"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-blue-600">
                            Item {index + 1}
                          </span>
                          <Input
                            value={item.item}
                            onChange={(e) =>
                              handleInputChange(index, "item", e.target.value)
                            }
                            className="w-2/3 p-2 text-sm"
                            placeholder="Enter item"
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-blue-600">
                            Quantity
                          </span>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "quantity",
                                e.target.value
                              )
                            }
                            className="w-2/3 p-2 text-sm"
                            placeholder="Quantity"
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-blue-600">
                            By When
                          </span>
                          <Input
                            type="date"
                            value={item.byWhen}
                            onChange={(e) =>
                              handleInputChange(index, "byWhen", e.target.value)
                            }
                            className="w-2/3 p-2 text-sm"
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-blue-600">
                            Drop Location
                          </span>
                          <Input
                            value={item.dropLocation}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "dropLocation",
                                e.target.value
                              )
                            }
                            className="w-2/3 p-2 text-sm"
                            placeholder="Location"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col justify-end mt-4 gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddRow}
                      className="text-sm w-48"
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Any Other Support
                    </Button>

                    <div className="flex items-center space-x-2">
                      <label className="text-sm text-gray-600">
                        Other Support:
                      </label>
                      <Input
                        name="otherSupport"
                        value={formData.otherSupport}
                        onChange={handleFormInputChange}
                        placeholder="Enter other support"
                        className="text-sm w-6/12"
                      />


                    </div>
                    <div className="flex flex-row gap-4 justify-center items-center mt-4 -mb-4">
                      <Button

                        className="text-sm w-40 bg-blue-600 hover:bg-blue-700"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating Project...
                          </>
                        ) : (
                          "Preview"
                        )}
                      </Button>
                      <Button
                        type="submit"
                        className="text-sm w-40 bg-blue-600 hover:bg-blue-700"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating Project...
                          </>
                        ) : (
                          "Create Project"
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </ScrollArea>
        </Card>
      </form>
    </div>
  );
}
