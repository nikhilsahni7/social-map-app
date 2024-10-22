"use client"
import React, { useState, FormEvent } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Building2, MapPin, FileText, Check, AlertCircle } from "lucide-react";

interface Organization {
    orgName: string;
    orgType: string;
    location: string;
    description: string;
}

interface FormErrors {
    orgName?: string;
    orgType?: string;
    location?: string;
    description?: string;
}

const SocialOrgCreation = () => {
    const [formData, setFormData] = useState<Organization>({
        orgName: "",
        orgType: "",
        location: "",
        description: "",
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const organizationTypes = [
        { id: "non-profit", label: "Non-profit Organization" },
        { id: "charity", label: "Charitable Foundation" },
        { id: "community", label: "Community Group" },
        { id: "ngo", label: "Non-Governmental Organization" },
        { id: "social-enterprise", label: "Social Enterprise" },
        { id: "advocacy", label: "Advocacy Group" },
        { id: "others", label: "Other Organization Type" }
    ];

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus('idle');

        const formErrors: FormErrors = {};
        if (!formData.orgName.trim()) formErrors.orgName = "Organization name is required";
        if (!formData.orgType) formErrors.orgType = "Please select an organization type";
        if (!formData.location.trim()) formErrors.location = "Location is required";
        if (!formData.description.trim()) formErrors.description = "Please provide a description";

        setErrors(formErrors);

        if (Object.keys(formErrors).length === 0) {
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));
                setSubmitStatus('success');
                console.log("Form submitted:", formData);
            } catch (error) {
                setSubmitStatus('error');
            }
        }
        setIsSubmitting(false);
    };

    const handleInputChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <Card className="max-w-2xl mx-auto">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-3xl font-bold">Create a Social Organization</CardTitle>
                    <CardDescription>
                        Fill out the form below to register your social organization. All fields are required.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    {submitStatus === 'success' && (
                        <Alert className="mb-6 bg-green-50 text-green-700 border-green-200">
                            <Check className="h-4 w-4" />
                            <AlertDescription>
                                Organization successfully created! You will receive a confirmation email shortly.
                            </AlertDescription>
                        </Alert>
                    )}

                    {submitStatus === 'error' && (
                        <Alert className="mb-6 bg-red-50 text-red-700 border-red-200">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                There was an error creating your organization. Please try again.
                            </AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="orgName" className="flex items-center gap-2">
                                <Building2 className="h-4 w-4" />
                                Organization Name
                            </Label>
                            <Input
                                id="orgName"
                                placeholder="Enter your organization's name"
                                value={formData.orgName}
                                onChange={(e) => handleInputChange('orgName', e.target.value)}
                                className={errors.orgName ? "border-red-500" : ""}
                            />
                            {errors.orgName && (
                                <p className="text-sm text-red-500">{errors.orgName}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="orgType" className="flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                Organization Type
                            </Label>
                            <Select
                                value={formData.orgType}
                                onValueChange={(value) => handleInputChange('orgType', value)}
                            >
                                <SelectTrigger className={errors.orgType ? "border-red-500" : ""}>
                                    <SelectValue placeholder="Select organization type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {organizationTypes.map((type) => (
                                        <SelectItem key={type.id} value={type.id}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.orgType && (
                                <p className="text-sm text-red-500">{errors.orgType}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="location" className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                Location
                            </Label>
                            <Input
                                id="location"
                                placeholder="City, Country"
                                value={formData.location}
                                onChange={(e) => handleInputChange('location', e.target.value)}
                                className={errors.location ? "border-red-500" : ""}
                            />
                            {errors.location && (
                                <p className="text-sm text-red-500">{errors.location}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description" className="flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                Description
                            </Label>
                            <Textarea
                                id="description"
                                placeholder="Describe your organization's mission and goals..."
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                className={`min-h-[120px] ${errors.description ? "border-red-500" : ""}`}
                            />
                            {errors.description && (
                                <p className="text-sm text-red-500">{errors.description}</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Creating..." : "Create Organization"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default SocialOrgCreation;