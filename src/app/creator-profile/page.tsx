"use client"

import React from 'react';
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Briefcase, Mail, Phone, ChevronRight } from 'lucide-react';

interface Project {
    id: string;
    title: string;
    description: string;
    category: string;
    image: string;
}

interface PersonData {
    firstName: string;
    lastName: string;
    title: string;
    location: string;
    email: string;
    phone: string;
    bio: string;
    avatar: string;
    projects: Project[];
}

const personData: PersonData = {
    firstName: "John",
    lastName: "Doe",
    title: "Software Engineer",
    location: "San Francisco, CA",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    bio: "Passionate software engineer with 5+ years of experience in web development. Specializing in React and Node.js.",
    avatar: "/placeholder.svg?height=200&width=200",
    projects: [
        {
            id: "2",
            title: "AI-Powered Chatbot",
            description: "An intelligent chatbot using natural language processing for customer support.",
            category: "Artificial Intelligence",
            image: "/placeholder.svg?height=200&width=300"
        },
        {
            id: "2",
            title: "AI-Powered Chatbot",
            description: "An intelligent chatbot using natural language processing for customer support.",
            category: "Artificial Intelligence",
            image: "/placeholder.svg?height=200&width=300"
        },
        {
            id: "3",
            title: "Eco-Friendly Smart Home System",
            description: "IoT-based system for optimizing energy consumption in homes.",
            category: "Internet of Things",
            image: "/placeholder.svg?height=200&width=300"
        }
    ]
};

export default function PersonProfile() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <Card className="overflow-hidden">
                    <CardContent className="p-0">
                        <div className="relative h-48 bg-blue-600">
                            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent"></div>
                        </div>
                        <div className="relative px-6 pb-8">
                            <Avatar className="w-32 h-32 border-4 border-white rounded-full absolute -top-16 left-6">
                                <AvatarImage src={personData.avatar} alt={`${personData.firstName} ${personData.lastName}`} />
                                <AvatarFallback>{personData.firstName[0]}{personData.lastName[0]}</AvatarFallback>
                            </Avatar>
                            <div className="pt-20">
                                <h1 className="text-3xl font-bold text-gray-900">{personData.firstName} {personData.lastName}</h1>
                                <p className="text-xl text-blue-600 font-medium mt-1">{personData.title}</p>
                                <div className="flex flex-wrap gap-4 mt-4">
                                    <div className="flex items-center text-gray-600">
                                        <MapPin className="w-5 h-5 mr-2" />
                                        <span>{personData.location}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <Mail className="w-5 h-5 mr-2" />
                                        <span>{personData.email}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <Phone className="w-5 h-5 mr-2" />
                                        <span>{personData.phone}</span>
                                    </div>
                                </div>
                                <p className="mt-6 text-gray-600 leading-relaxed">{personData.bio}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="mt-12">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">Projects</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {personData.projects.map((project) => (
                            <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                <CardContent className="p-0">
                                    <div className="relative h-48">
                                        <Image
                                            src={project.image}
                                            alt={project.title}
                                            layout="fill"
                                            objectFit="cover"
                                        />
                                        <div className="absolute top-4 right-4">
                                            <Badge className="bg-white/90 text-blue-600 hover:bg-white">
                                                {project.category}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        <h3 className="text-xl font-semibold text-gray-900">{project.title}</h3>
                                        <p className="text-gray-600">{project.description}</p>
                                        <Link href={`/projects/${project.id}`} passHref>
                                            <Button variant="outline" className="w-full">
                                                View Project
                                                <ChevronRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}