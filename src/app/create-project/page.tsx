"use client";

import React, { useState, useRef, ChangeEvent } from "react";
import { PlusCircle, Trash2, Upload, Calendar, User, FileText, Target, Tag, Clock, Box, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface SupportItem {
  item: string;
  quantity: string;
  byWhen: string;
  dropLocation: string;
}

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
  coordinates: [number, number] | null;
}

export default function ProjectDetailsForm() {
  const [supportItems, setSupportItems] = useState<SupportItem[]>([
    { item: "", quantity: "0", byWhen: "", dropLocation: "" },
    { item: "", quantity: "0", byWhen: "", dropLocation: "" },
    { item: "", quantity: "0", byWhen: "", dropLocation: "" },
  ]);

  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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
    coordinates: null,
  });

  const handleInputChange = (rowIndex: number, field: keyof SupportItem, value: string) => {
    setSupportItems((prev) => {
      const newItems = [...prev];
      newItems[rowIndex][field] = value;
      return newItems;
    });
  };

  const handleFormInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategorySelect = (category: string) => {
    setFormData((prev) => ({
      ...prev,
      category,
    }));
  };

  const handleAddRow = () => {
    setSupportItems((prev) => [
      ...prev,
      { item: "", quantity: "", byWhen: "", dropLocation: "" },
    ]);
  };

  const handleRemoveRow = (index: number) => {
    setSupportItems((prev) => prev.filter((_, i) => i !== index));
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'pictureOfSuccess' && value instanceof File) {
          formDataToSend.append(key, value);
        } else if (typeof value === 'string' || value instanceof Blob) {
          formDataToSend.append(key, value);
        } else if (value !== null) {
          formDataToSend.append(key, JSON.stringify(value));
        }
      });
      formDataToSend.append('supportItems', JSON.stringify(supportItems));

      const response = await fetch('/api/projects', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Failed to create project');
      }

      const data = await response.json();
      toast({
        title: "Success",
        description: "Project created successfully!",
      });
      // Reset form or redirect to project page
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Create Your Project
          </h2>
          <p className="text-gray-600">Make a Difference By Doing your Bit</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full">
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
            <CardContent className="p-6 md:p-8 space-y-8">
              {/* Personal Information */}
              <div className="space-y-6">
                <CardHeader className="p-0">
                  <CardTitle className="flex items-center space-x-2 text-blue-600">
                    <User className="h-5 w-5" />
                    <span>Personal Information</span>
                  </CardTitle>
                </CardHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <Input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleFormInputChange}
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <Input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleFormInputChange}
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>
              </div>

              {/* Project Details */}
              <div className="space-y-6">
                <CardHeader className="p-0">
                  <CardTitle className="flex items-center space-x-2 text-blue-600">
                    <FileText className="h-5 w-5" />
                    <span>Project Details</span>
                  </CardTitle>
                </CardHeader>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
                    <Input
                      name="title"
                      value={formData.title}
                      onChange={handleFormInputChange}
                      placeholder="Enter a compelling title for your project"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Project Objective</label>
                    <Textarea
                      name="objective"
                      value={formData.objective}
                      onChange={handleFormInputChange}
                      placeholder="What do you want to achieve?"
                      rows={4}
                    />
                  </div>

                  <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Tag className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">Project Preview</span>
                      </div>
                      <p className="text-gray-700 font-medium">
                        {formData.firstName
                          ? `${formData.firstName} wants to ${formData.objective}`
                          : "Mr. Aakash wants to donate 500 blankets."}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Category Selection */}
              <div className="space-y-4">
                <CardHeader className="p-0">
                  <CardTitle className="flex items-center space-x-2 text-blue-600">
                    <Target className="h-5 w-5" />
                    <span>Category</span>
                  </CardTitle>
                </CardHeader>
                <div className="flex flex-wrap gap-3">
                  {["Human", "Plant", "Animal"].map((category) => (
                    <Button
                      key={category}
                      type="button"
                      onClick={() => handleCategorySelect(category)}
                      variant={formData.category === category ? "default" : "outline"}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div className="space-y-4">
                <CardHeader className="p-0">
                  <CardTitle className="flex items-center space-x-2 text-blue-600">
                    <Clock className="h-5 w-5" />
                    <span>Duration</span>
                  </CardTitle>
                </CardHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <div className="relative">
                      <Input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleFormInputChange}
                      />
                      <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <div className="relative">
                      <Input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleFormInputChange}
                      />
                      <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Project Description and Image */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <CardHeader className="p-0">
                    <CardTitle className="flex items-center space-x-2 text-blue-600">
                      <FileText className="h-5 w-5" />
                      <span>Project Description</span>
                    </CardTitle>
                  </CardHeader>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleFormInputChange}
                    placeholder="Describe your project in detail..."
                    rows={8}
                  />
                </div>

                <div className="space-y-4">
                  <CardHeader className="p-0">
                    <CardTitle className="flex items-center space-x-2 text-blue-600">
                      <Upload className="h-5 w-5" />
                      <span>Picture of Success</span>
                    </CardTitle>
                  </CardHeader>
                  <div
                    className={`relative h-[200px] border-2 border-dashed rounded-xl transition-all ${isDragActive
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:border-blue-400"
                      }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {imagePreview ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                          <p className="text-white text-sm">Click to change</p>
                        </div>
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <Upload className="h-8 w-8 text-blue-500 mb-2" />
                        <p className="text-sm text-gray-600">
                          Drag & drop your image here, or click to browse
                        </p>
                      </div>
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

              {/* Support Items */}
              <div className="space-y-6">
                <CardHeader className="p-0">
                  <CardTitle className="flex items-center space-x-2 text-blue-600">
                    <Box className="h-5 w-5" />
                    <span>Support Items</span>
                  </CardTitle>
                </CardHeader>

                {/* Desktop view */}
                <div className="hidden md:block">
                  <div className="grid grid-cols-12 gap-4 mb-4 px-4">
                    <div className="col-span-3 text-sm font-medium text-gray-600">Item</div>
                    <div className="col-span-2 text-sm font-medium text-gray-600">Quantity</div>
                    <div className="col-span-3 text-sm font-medium text-gray-600">By When</div>
                    <div className="col-span-4 text-sm font-medium text-gray-600">Drop Location</div>
                  </div>

                  {supportItems.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-4 mb-4">
                      <div className="col-span-3">
                        <Input
                          value={item.item}
                          onChange={(e) => handleInputChange(index, "item", e.target.value)}
                          placeholder="Enter item"
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleInputChange(index, "quantity", e.target.value)}
                          placeholder="Qty"
                        />
                      </div>
                      <div className="col-span-3">
                        <Input
                          type="date"
                          value={item.byWhen}
                          onChange={(e) => handleInputChange(index, "byWhen", e.target.value)}
                        />
                      </div>
                      <div className="col-span-4 flex gap-2">
                        <Input
                          value={item.dropLocation}
                          onChange={(e) => handleInputChange(index, "dropLocation", e.target.value)}
                          placeholder="Location"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => handleRemoveRow(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mobile view */}
                <div className="md:hidden space-y-6">
                  {supportItems.map((item, index) => (
                    <Card key={index}>
                      <CardContent className="p-4 space-y-4">
                        <div className="flex justify-between items-center">
                          <Badge variant="secondary">Item {index + 1}</Badge>
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => handleRemoveRow(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <Input
                          value={item.item}
                          onChange={(e) => handleInputChange(index, "item", e.target.value)}
                          placeholder="Enter item"
                        />
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleInputChange(index, "quantity", e.target.value)}
                          placeholder="Quantity"
                        />
                        <Input
                          type="date"
                          value={item.byWhen}
                          onChange={(e) => handleInputChange(index, "byWhen", e.target.value)}
                        />
                        <Input
                          value={item.dropLocation}
                          onChange={(e) => handleInputChange(index, "dropLocation", e.target.value)}
                          placeholder="Drop Location"
                        />
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddRow}
                  className="w-full md:w-auto"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Support Item
                </Button>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Other Support</label>
                  <Input
                    name="otherSupport"
                    value={formData.otherSupport}
                    onChange={handleFormInputChange}
                    placeholder="Any additional support needed?"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isLoading}
                >
                  Preview
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                      Creating Project...
                    </>
                  ) : (
                    "Submit Project"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}