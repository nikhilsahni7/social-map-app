"use client";

import React, { useState, useRef, ChangeEvent, useEffect } from "react";
import {
  PlusCircle,
  Trash2,
  Upload,
  Calendar,
  User,
  FileText,
  Target,
  Tag,
  Clock,
  Box,
  Loader2,
  HelpCircle,
  MapPin,
} from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import {
  LinkedinIcon,
  TwitterIcon,
  Users,
  Eye,
  ChevronRight,
  UserCircle,
  LogOut,
  Info,
  Mail,
  UserPlus
} from "lucide-react";
import Link from "next/link";
import { Search, X, Menu, ZoomIn, ZoomOut, Compass, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LocationInput } from "@/components/LocationInput";
import { toast as hotToast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { getAuthToken, logout, getAuthUser } from "@/lib/clientAuth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

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
  coordinates: {
    lat: number;
    lng: number;
  } | null;
}

export default function ProjectDetailsForm() {
  const [supportItems, setSupportItems] = useState<SupportItem[]>([
    { item: "", quantity: "0", byWhen: "", dropLocation: "" },
  ]);

  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);


  useEffect(() => {
    setToken(getAuthToken());
    const user = getAuthUser();
    const currentUser = user;
  }, []);

  const currentUser = getAuthUser();

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

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleInputChange = (
    rowIndex: number,
    field: keyof SupportItem,
    value: string
  ) => {
    setSupportItems((prev) => {
      const newItems = [...prev];
      newItems[rowIndex][field] = value;
      return newItems;
    });
  };

  const CurvedText = () => {
    const text = "Provoke Goodness";
    const radius = 30;
    
    return (
      <div className="relative w-24 h-24 scale-125 ml-14 -mt-5">
        {text.split('').map((char, i) => {
          const angle = (i * 360 / text.length);
          const radian = angle * (Math.PI / 180);
          const x = radius * Math.cos(radian);
          const y = radius * Math.sin(radian);
          
          return (
            <span
              key={i}
              className="absolute text-blue-600 font-semibold text-sm transform-gpu"
              style={{
                left: `${50 + x}%`,
                top: `${50 + y}%`,
                transform: `rotate(${angle + 90}deg)`,
              }}
            >
              {char}
            </span>
          );
        })}
      </div>
    );
  };
  

  const handleFormInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); 
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
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
      { item: "", quantity: "0", byWhen: "", dropLocation: "" },
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

  const handleLocationSelect = (address: string, lat: number, lng: number) => {
    setFormData((prev) => ({
      ...prev,
      address,
      coordinates: { lat, lng },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getAuthToken();

    if (!token) {
      hotToast.error("Please login to create a project");
      router.push("/login");
      return;
    }

    setIsLoading(true);

    try {
      const formDataToSend = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "pictureOfSuccess" && key !== "coordinates") {
          formDataToSend.append(key, value);
        }
      });

      if (file) {
        formDataToSend.append("pictureOfSuccess", file);
      }

      formDataToSend.append("supportItems", JSON.stringify(supportItems));

      if (formData.coordinates) {
        formDataToSend.append("latitude", formData.coordinates.lat.toString());
        formDataToSend.append("longitude", formData.coordinates.lng.toString());
      }

      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        hotToast.success("Project created successfully")
        setFormData({
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
        })
        router.push("/");
      } else {
        hotToast.error(data.error || "Failed to create project");
      }
    } catch (error) {
      console.error("Error creating project:", error);
      hotToast.error("An unexpected error occurred while creating project. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-gradient-to-br from-red-50 to-indigo-50 bg-cover bg-center">
      <div className="min-h-screen bg-gray-100">
        
        <div className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm shadow-md">
          <div className="max-w-7xl mx-auto px-4 py-2">
            <div className="flex items-center justify-between">
              {/* Logo and Slogan Section */}
              {!isMobile && (
              <div className="flex items-center gap-4">
                <button onClick={() => router.push("/")}>
                  <Image
                    src="/logo.png"
                    alt="logo"
                    width={65}
                    height={80}
                    className="object-contain"
                  />
                  <span className='text-sm font-bold text-blue-700'>Did<span className='text-sm font-bold text-yellow-500'>My</span>Bit</span>
                </button>
                <div className="hidden md:block">
                  <p className="text-blue-600 font-semibold text-lg">DidMyBit</p>
                  <p className="text-gray-600 text-sm">Make an impact, one bit at a time</p>
                </div>
                <div className="hidden md:block ml-36">
                  <p className="text-blue-600 font-semibold text-lg">Find Someone to Support you Bit!</p>
                  <p className="text-gray-600 text-sm">Find any social project one the map</p>
                </div>
              </div>
              )}

              {isMobile && (
        <div className='flex flex-row items-start ml-4'>
          <div className="flex flex-col items-center">
            <Image 
              src="/logo.png"
              alt="logo"
              width={60}
              height={80}
              className="object-contain -py-4"
            />
            <span className='text-sm font-bold text-blue-700 ml-2'>
              Did<span className='text-sm font-bold text-yellow-500'>My</span>Bit
            </span>
          </div>
          <div className="scale-75">
            <CurvedText />
          </div>
          
        </div>
      )}

              <div className="flex items-center gap-3">
                {token && currentUser ? (
                  <div></div>
                ) : (
                  <>
                    
                  </>
                )}
                {/* Menu Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-white hover:bg-gray-100 p-2 rounded-full shadow-sm hover:shadow-md transition-all duration-300"
                  onClick={() => {
                    setIsMenuOpen(!isMenuOpen);

                  }}
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </div>

              
            </div>
          </div>
        </div>
        
        
      <div className="space-y-8 mt-24">
        <div className="text-center space-y-2">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-indigo-600 bg-clip-text text-transparent">
            Create Your Project
          </h2>
          <p className="text-gray-600">Make a Difference By Doing your Bit</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full">
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
            <ScrollArea className="h-full">
              <CardContent className="p-6 md:p-8 space-y-8">
                {/* Personal Information */}
                <div className="space-y-6">
                  <CardHeader className="p-0">
                    <CardTitle className="flex items-center space-x-2 text-red-600">
                      <User className="h-5 w-5 text-2xl font-bold" />
                      <span className="text-2xl font-bold">
                        Personal Information
                      </span>
                    </CardTitle>
                  </CardHeader>

                  <div className="flex flex-col md:flex-row w-full gap-12">
                    <div className="flex flex-col">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <Input
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleFormInputChange}
                        placeholder="Enter your First name"
                        className="w-56"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <Input
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleFormInputChange}
                        placeholder="Enter your Last name"
                        className="w-56"
                      />
                    </div>
                  </div>
                </div>

                {/* Project Details */}
                <div className="space-y-6">
                  <CardHeader className="p-0">
                    <CardTitle className="flex items-center space-x-2 text-red-600">
                      <FileText className="h-5 w-5" />
                      <span className="text-2xl font-bold">
                        Project Details
                      </span>
                    </CardTitle>
                  </CardHeader>
                  {/* Category Selection */}
                  <div className="">
                    <CardHeader className="p-0">
                      <CardTitle className="flex items-center text-red-600">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Category
                        </label>
                      </CardTitle>
                    </CardHeader>
                    <div className="flex flex-wrap gap-3">
                      {["👨 Human", "🌳 Plant", "🐕 Animal"].map((category) => (
                        <Button
                          key={category}
                          type="button"
                          onClick={() => handleCategorySelect(category)}
                          variant={
                            formData.category === category
                              ? "default"
                              : "outline"
                          }
                        >
                          {category}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Project Title
                      </label>
                      <Input
                        name="title"
                        value={formData.title}
                        onChange={handleFormInputChange}
                        placeholder="Enter a compelling title for your project"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Project Objective
                      </label>
                      <Textarea
                        name="objective"
                        value={formData.objective}
                        onChange={handleFormInputChange}
                        placeholder="What do you want to achieve?"
                        rows={4}
                      />
                    </div>

                    <Card className="bg-gradient-to-r from-red-50 to-indigo-50 border-red-100">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Tag className="h-4 w-4 text-red-600" />
                          <span className="text-sm font-medium text-red-800">
                            Project Preview
                          </span>
                        </div>
                        <p className="text-gray-700 font-medium">
                          {formData.firstName
                            ? `${formData.firstName} wants to ${formData.objective}`
                            : "Mr. Aakash wants to donate 500 blankets."}
                        </p>
                        <p className="text-gray-700 text-xs">
                          (This is how it will appear on website)
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Duration */}
                <div className="space-y-4">
                  <CardHeader className="p-0">
                    <CardTitle className="flex items-center space-x-2 text-red-600">
                      <Clock className="h-5 w-5" />
                      <span className="text-2xl font-bold">Duration</span>
                    </CardTitle>
                  </CardHeader>
                  <div className="flex gap-10 flex-col md:flex-row">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date
                      </label>
                      <div className="relative">
                        <Input
                          type="date"
                          name="startDate"
                          value={formData.startDate}
                          onChange={handleFormInputChange}
                          className="md:w-w-40"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Date
                      </label>
                      <div className="relative">
                        <Input
                          type="date"
                          name="endDate"
                          value={formData.endDate}
                          onChange={handleFormInputChange}
                          className="md:w-w-40"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location Details */}
                <div className="flex flex-col space-y-2">
                  <h3 className="text-2xl font-bold text-red-600">
                    Location Details
                  </h3>
                  <LocationInput
                    defaultValue={formData.address}
                    onLocationSelect={(location) => handleLocationSelect(
                      location.address,
                      location.coordinates[0],
                      location.coordinates[1]
                    )}
                  />
                </div>

                {/* Project Description and Image */}
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
                  <div className="flex flex-col w-full md:w-6/12">
                    <h3 className="text-md font-bold text-red-600">
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
                    <h3 className="text-md font-bold text-red-600">
                      Picture Of Success ~ Help People See What You Have In Mind
                    </h3>
                    <div
                      className={`relative h-48 border-2 border-dashed rounded-xl transition-all ${isDragActive
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300 hover:border-red-400"
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
                            fill
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                            <p className="text-white text-sm">
                              Click to change
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <Upload className="h-8 w-8 text-red-500 mb-2" />
                          <p className="text-sm text-gray-600">
                            Drag & drop your image here, or click to upload
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
                    <CardTitle className="flex items-center space-x-2 text-red-600">
                      <Box className="h-5 w-5" />
                      <span className="text-xl font-bold">Support Items</span>
                    </CardTitle>
                  </CardHeader>

                  {/* Desktop view */}
                  <div className="hidden md:block">
                    <div className="grid grid-cols-12 gap-4 mb-4 px-4">
                      <div className="col-span-3 text-sm font-medium text-gray-600">
                        Item
                      </div>
                      <div className="col-span-2 text-sm font-medium text-gray-600">
                        Quantity
                      </div>
                      <div className="col-span-3 text-sm font-medium text-gray-600">
                        By When
                      </div>
                      <div className="col-span-4 text-sm font-medium text-gray-600">
                        Drop Location
                      </div>
                    </div>

                    {supportItems.map((item, index) => (
                      <div key={index} className="grid grid-cols-12 gap-4 mb-4">
                        <div className="col-span-3">
                          <Input
                            value={item.item}
                            onChange={(e) =>
                              handleInputChange(index, "item", e.target.value)
                            }
                            placeholder="Enter item"
                          />
                        </div>
                        <div className="col-span-2">
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
                            placeholder="0"
                          />
                        </div>
                        <div className="col-span-3">
                          <Input
                            type="date"
                            value={item.byWhen}
                            onChange={(e) =>
                              handleInputChange(index, "byWhen", e.target.value)
                            }
                          />
                        </div>
                        <div className="col-span-4 flex gap-2">
                          <Input
                            value={item.dropLocation}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "dropLocation",
                                e.target.value
                              )
                            }
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
                            onChange={(e) =>
                              handleInputChange(index, "item", e.target.value)
                            }
                            placeholder="Enter item"
                          />
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
                            placeholder="Quantity"
                          />
                          <Input
                            type="date"
                            value={item.byWhen}
                            onChange={(e) =>
                              handleInputChange(index, "byWhen", e.target.value)
                            }
                          />
                          <Input
                            value={item.dropLocation}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "dropLocation",
                                e.target.value
                              )
                            }
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Other Support
                    </label>
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
                  {" "}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsPreviewOpen(true)}
                    disabled={isLoading}
                  >
                    Preview
                  </Button>{" "}
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    {" "}
                    {isLoading ? (
                      <>
                        {" "}
                        <Loader2 className="animate-spin mr-2 h-4 w-4" />{" "}
                        Creating Project...{" "}
                      </>
                    ) : (
                      "Submit Project"
                    )}{" "}
                  </Button>{" "}
                </div>
              </CardContent>
            </ScrollArea>
          </Card>
        </form>

        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-center">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-indigo-600 bg-clip-text text-transparent">
                  Project Preview
                </h2>
                <p className="text-sm text-gray-600 mt-2">Review your project details before submission</p>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-8 p-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="flex items-center text-xl font-bold text-red-600">
                  <User className="h-5 w-5 mr-2" />
                  Personal Information
                </h3>
                <div className="bg-white/50 rounded-lg p-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{formData.firstName} {formData.lastName}</h4>
                      <p className="text-sm text-gray-600">Project Creator</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Project Details */}
              <div className="space-y-4">
                <h3 className="flex items-center text-xl font-bold text-red-600">
                  <FileText className="h-5 w-5 mr-2" />
                  Project Details
                </h3>
                <div className="bg-white/50 rounded-lg p-4 space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold">{formData.title}</h4>
                    <Badge className="mt-2">{formData.category}</Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Objective</p>
                      <p className="mt-1 text-gray-800">{formData.objective}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500">Description</p>
                      <p className="mt-1 text-gray-800">{formData.description}</p>
                    </div>
                  </div>

                  {imagePreview && (
                    <div className="relative h-64 w-full rounded-lg overflow-hidden">
                      <Image
                        src={imagePreview}
                        alt="Project Image"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Duration */}
              <div className="space-y-4">
                <h3 className="flex items-center text-xl font-bold text-red-600">
                  <Clock className="h-5 w-5 mr-2" />
                  Duration
                </h3>
                <div className="bg-white/50 rounded-lg p-4">
                  <div className="flex gap-8">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Start Date</p>
                      <p className="mt-1 text-gray-800">{formData.startDate}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">End Date</p>
                      <p className="mt-1 text-gray-800">{formData.endDate}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-4">
                <h3 className="flex items-center text-xl font-bold text-red-600">
                  <MapPin className="h-5 w-5 mr-2" />
                  Location
                </h3>
                <div className="bg-white/50 rounded-lg p-4">
                  <p className="text-gray-800">{formData.address}</p>
                </div>
              </div>

              {/* Support Items */}
              <div className="space-y-4">
                <h3 className="flex items-center text-xl font-bold text-red-600">
                  <Box className="h-5 w-5 mr-2" />
                  Support Items
                </h3>
                <div className="bg-white/50 rounded-lg p-4 space-y-4">
                  {supportItems.map((item, index) => (
                    item.item && (
                      <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-gray-800">{item.item}</p>
                            <p className="text-sm text-gray-600 mt-1">Drop at: {item.dropLocation}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant="secondary" className="mb-1">{item.quantity} units</Badge>
                            <p className="text-xs text-gray-500">Need by: {item.byWhen}</p>
                          </div>
                        </div>
                      </div>
                    )
                  ))}

                  {formData.otherSupport && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-500">Additional Support Needed</p>
                      <p className="mt-1 text-gray-800">{formData.otherSupport}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        {isMenuOpen && (
          <motion.div
            initial={{ x: 300 }}
            animate={{ x: 0 }}
            exit={{ x: 300 }}
            className="fixed -top-9 right-0 h-full w-80 bg-white shadow-lg z-50"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-6 bg-blue-600 text-white">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Menu</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-white hover:bg-blue-700 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </Button>
                </div>
                {token && currentUser ? (
                  <div className="bg-gray-50 p-4 rounded-lg mb-2">
                    <p className="text-lg font-semibold text-gray-800">
                      {currentUser.name}
                    </p>
                    <p className="text-sm text-gray-600 mb-3">{currentUser.email}</p>
                    <ul className="space-y-2">
                      <li>
                        <Button
                          variant="outline"
                          onClick={() => {
                            router.push(`/creator-profile/${currentUser.id}`);
                          }}
                          className="w-full justify-start text-white font-semibold bg-[#7E57C2] hover:text-white hover:bg-[#6B4DAA]"
                        >
                          <UserCircle className="mr-3 h-5 w-5" />
                          View Profile
                        </Button>
                      </li>
                      <li>
                        <Button
                          variant="outline"
                          onClick={handleLogout}
                          className="w-full justify-start text-white font-semibold bg-red-600 hover:text-white hover:bg-red-700"
                        >
                          <LogOut className="mr-3 h-5 w-5" />
                          Logout
                        </Button>
                      </li>
                    </ul>
                  </div>
                ) : (
                  <>
                    <div>
                      <h3 className="font-semibold text-lg">Did My Bit</h3>
                      <p className="text-sm text-blue-100">
                        Make an impact, one bit at a time
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Menu Items */}
              <nav className="flex-grow p-6 space-y-2">
                <div>
                  {token && currentUser ? (
                    <></>
                  ) : (
                    <ul className="space-y-3">
                      <li>
                        <Link href="/login">
                          <Button
                            variant="outline"
                            className="w-full justify-start text-white font-semibold bg-[#7E57C2] hover:text-white hover:bg-[#6B4DAA]"
                          >
                            <LogIn className="mr-3 h-5 w-5" />
                            Login
                          </Button>
                        </Link>
                      </li>
                      <li>
                        <Link href="/signup">
                          <Button
                            variant="outline"
                            className="w-full justify-start text-white font-semibold bg-[#7E57C2] hover:text-white hover:bg-[#6B4DAA]"
                          >
                            <UserPlus className="mr-3 h-5 w-5" />
                            Sign Up
                          </Button>
                        </Link>
                      </li>
                    </ul>
                  )}
                </div>

                {/* About Us */}
                <div className="">
                  <h4 className="text-sm font-semibold text-gray-500 mb-2">
                    ABOUT US
                  </h4>
                  <ul className="space-y-4">
                    <li>
                      <Link href="/about">
                        <Button
                          variant="outline"
                          className="w-full justify-start text-white font-semibold bg-[#7E57C2] hover:text-white hover:bg-[#6B4DAA] rounded-lg transition-all duration-200"
                        >
                          <Info className="mr-3 h-5 w-5" />
                          About Us
                        </Button>
                      </Link>
                    </li>
                    <li>
                      <Link href="/contact">
                        <Button
                          variant="outline"
                          className="w-full justify-start text-white font-semibold bg-[#7E57C2] hover:text-white hover:bg-[#6B4DAA] rounded-lg transition-all duration-200"
                        >
                          <Mail className="mr-3 h-5 w-5" />
                          Contact Us
                        </Button>
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Support */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 mb-2">
                    SUPPORT
                  </h4>
                  <ul className="space-y-4">
                    <li>
                      <Link href="/faq">
                        <Button
                          variant="outline"
                          className="w-full justify-start text-white font-semibold bg-[#7E57C2] hover:text-white hover:bg-[#6B4DAA] rounded-lg transition-all duration-200"
                        >
                          <HelpCircle className="mr-3 h-5 w-5" />
                          Help & FAQ
                        </Button>
                      </Link>
                    </li>
                  </ul>
                </div>
              </nav>

              {/* Footer */}
              <div className="p-6 bg-gray-50">
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    2024 Did My Bit. All rights reserved.
                  </p>
                  <p className="text-xs text-blue-600 font-medium mt-1">
                    Making the world better, one bit at a time
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
    </div>
  );
}
