"use client";

import React, { useState, useRef, useEffect } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LocationInput } from "@/components/LocationInput";
import { getAuthToken } from "@/lib/clientAuth";
import { toast as hotToast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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

export default function EditProjectForm() {
    const params = useParams();
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

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const res = await fetch(`/api/projects/${params.id}`);
                const data = await res.json();
                if (data) {
                    setFormData({
                        firstName: data.firstName || "",
                        lastName: data.lastName || "",
                        title: data.title || "",
                        objective: data.objective || "",
                        description: data.description || "",
                        category: data.category || "Human",
                        startDate: data.startDate || "",
                        endDate: data.endDate || "",
                        pictureOfSuccess: null,
                        otherSupport: data.otherSupport || "",
                        address: data.location?.address || "",
                        coordinates: data.location?.coordinates ? {
                            lat: data.location.coordinates[1],
                            lng: data.location.coordinates[0]
                        } : null,
                    });
                    if (data.pictureOfSuccess?.url) {
                        setImagePreview(data.pictureOfSuccess.url);
                    }
                    if (data.supportItems) {
                        setSupportItems(data.supportItems);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch project:", error);
                hotToast.error("Failed to load project details");
            }
        };

        if (params.id) {
            fetchProject();
        }
    }, [params.id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = getAuthToken();

        if (!token) {
            hotToast.error("Please login to update the project");
            router.push("/login");
            return;
        }

        setIsLoading(true);

        try {
            const formDataToSend = new FormData();

            // Add all form fields
            formDataToSend.append("firstName", formData.firstName);
            formDataToSend.append("lastName", formData.lastName);
            formDataToSend.append("title", formData.title);
            formDataToSend.append("objective", formData.objective);
            formDataToSend.append("description", formData.description);
            formDataToSend.append("category", formData.category);
            formDataToSend.append("startDate", formData.startDate);
            formDataToSend.append("endDate", formData.endDate);
            formDataToSend.append("otherSupport", formData.otherSupport);
            formDataToSend.append("address", formData.address);

            // Add coordinates if they exist
            if (formData.coordinates) {
                formDataToSend.append("coordinates", JSON.stringify([
                    formData.coordinates.lng,
                    formData.coordinates.lat
                ]));
            }

            // Add support items (filter out empty items)
            const filteredSupportItems = supportItems
                .filter(item => item.item.trim() !== "")
                .map(item => ({
                    ...item,
                    quantity: parseInt(item.quantity) || 0
                }));
            formDataToSend.append("supportItems", JSON.stringify(filteredSupportItems));

            // Add file if it exists
            if (file) {
                formDataToSend.append("pictureOfSuccess", file);
            }

            // Log the data being sent
            console.log("Sending form data:", Object.fromEntries(formDataToSend.entries()));

            const response = await fetch(`/api/projects/${params.id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formDataToSend,
            });

            const data = await response.json();

            if (!response.ok) {
                console.error("Server response:", data);
                throw new Error(data.details || data.error || "Failed to update project");
            }

            hotToast.success("Project updated successfully");
            router.push(`/project-profile/${params.id}`);
        } catch (error) {
            console.error("Error updating project:", error);
            hotToast.error(error instanceof Error ? error.message : "An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const handleFormInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCategorySelect = (category: string) => {
        setFormData(prev => ({
            ...prev,
            category: category
        }));
    };

    const handleLocationSelect = (address: string, lng: number, lat: number) => {
        setFormData(prev => ({
            ...prev,
            address: address,
            coordinates: { lat, lng }
        }));
    };

    const handleInputChange = (index: number, field: keyof SupportItem, value: string) => {
        const newItems = [...supportItems];
        newItems[index] = {
            ...newItems[index],
            [field]: value
        };
        setSupportItems(newItems);
    };

    const handleAddRow = () => {
        setSupportItems([...supportItems, { item: "", quantity: "0", byWhen: "", dropLocation: "" }]);
    };

    const handleRemoveRow = (index: number) => {
        setSupportItems(supportItems.filter((_, i) => i !== index));
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragActive(true);
    };

    const handleDragLeave = () => {
        setIsDragActive(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragActive(false);
        if (e.dataTransfer.files?.[0]) {
            handleFileChange(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (file: File) => {
        setFile(file);
        setFormData(prev => ({
            ...prev,
            pictureOfSuccess: file
        }));
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleDelete = async () => {
        try {
            const token = getAuthToken();
            const response = await fetch(`/api/projects/${params.id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                hotToast.success('Project deleted successfully');
                router.push('/');
            } else {
                throw new Error('Failed to delete project');
            }
        } catch (error) {
            console.error('Error deleting project:', error);
            hotToast.error('Failed to delete project');
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto p-6 bg-gradient-to-br from-red-50 to-indigo-50 bg-cover bg-center">
            <div className="space-y-8">
                <div className="absolute top-6 right-6 scale-110">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                type="button"
                                variant="destructive"
                                className="bg-red-600 hover:bg-red-700"
                            >
                                Delete Project
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your project.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete}>
                                    Delete Project
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>

                <div className="text-center space-y-4">
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-indigo-600 bg-clip-text text-transparent">
                        Update Your Project
                    </h2>
                    <p className="text-gray-600">Make Changes To Your Project</p>
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
                                        onLocationSelect={(location) => handleLocationSelect(location.address, location.coordinates[0], location.coordinates[1])}
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
                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="bg-red-600 hover:bg-red-700 text-white"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                                                Updating Project...
                                            </>
                                        ) : (
                                            "Update Project"
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </ScrollArea>
                    </Card>
                </form>
            </div>
        </div>
    );
} 