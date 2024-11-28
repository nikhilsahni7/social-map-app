"use client"

import React from 'react';
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Mail, Phone, LinkedinIcon, GithubIcon, TwitterIcon, Users, Eye, ChevronRight } from 'lucide-react';

interface Project {
    id: string;
    title: string;
    description: string;
    category: string;
    image: string;
}

interface Experience {
    id: string;
    company: string;
    title: string;
    period: string;
    description: string;
    logo: string;
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
    banner: string;
    projects: Project[];
    experiences: Experience[];
    connections: number;
    profileViews: number;
    social: {
        linkedin: string;
        github: string;
        twitter: string;
    };
}

const personData: PersonData = {
    firstName: "John",
    lastName: "Doe",
    title: "Senior Software Engineer",
    location: "San Francisco, CA",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    bio: `Passionate software engineer with over 5 years of experience in full-stack web development. Specializing in React, Node.js, and cloud architecture.

I've led multiple successful projects and mentored junior developers throughout my career. My focus is on creating scalable, maintainable solutions that solve real-world problems.

Currently working on innovative projects that combine modern web technologies with artificial intelligence to create more intelligent and user-friendly applications.`,
    avatar: "/digital.jpg",
    banner: "/digital.jpg",
    connections: 500,
    profileViews: 247,
    social: {
        linkedin: "https://linkedin.com/in/johndoe",
        github: "https://github.com/johndoe",
        twitter: "https://twitter.com/johndoe"
    },
    experiences: [
        {
            id: "1",
            company: "Tech Innovators Inc",
            title: "Senior Software Engineer",
            period: "2021 - Present",
            description: "Leading a team of developers in building scalable cloud solutions and mentoring junior developers.",
            logo: "/digital.jpg"
        },
        {
            id: "2",
            company: "Digital Solutions Ltd",
            title: "Software Engineer",
            period: "2019 - 2021",
            description: "Developed and maintained multiple full-stack applications using React and Node.js.",
            logo: "/digital.jpg"
        }
    ],
    projects: [
        {
            id: "1",
            title: "AI-Powered Chatbot",
            description: "An intelligent chatbot using natural language processing for customer support automation and improved response times.",
            category: "Artificial Intelligence",
            image: "/digital.jpg"
        },
        {
            id: "2",
            title: "Smart Analytics Dashboard",
            description: "Real-time analytics dashboard with interactive visualizations and predictive insights for business intelligence.",
            category: "Data Analytics",
            image: "/digital.jpg"
        },
        {
            id: "3",
            title: "Eco-Friendly Smart Home",
            description: "IoT-based system for optimizing energy consumption in homes using machine learning algorithms.",
            category: "Internet of Things",
            image: "/digital.jpg"
        }
    ]
};

export default function PersonProfile() {



    return (
        <div className="min-h-screen bg-gray-100" style={{ backgroundImage: 'url("/digital.jpg")' }}>
            <main>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="space-y-6">
                        {/* Profile Header */}
                        <Card className="overflow-hidden">
                            <CardContent className="p-0">
                                <div className="relative h-60">
                                    <Image
                                        src={personData.banner}
                                        alt="Profile Banner"
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                    <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white/90 to-transparent"></div>
                                </div>
                                <div className="relative px-8 pb-8">
                                    <Avatar className="w-40 h-40 border-4 border-white rounded-full absolute -top-20 left-8 shadow-lg">
                                        <AvatarImage src={personData.avatar} alt={`${personData.firstName} ${personData.lastName}`} />
                                        <AvatarFallback>{personData.firstName[0]}{personData.lastName[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="pt-24">
                                        <div className="flex justify-between items-start flex-col gap-4">
                                            <div className="space-y-4">
                                                <div>
                                                    <h1 className="text-4xl font-bold text-gray-900">{personData.firstName} {personData.lastName}</h1>
                                                    <p className="text-xl text-gray-600 font-medium mt-1">{personData.title}</p>
                                                </div>

                                                <div className="flex items-center space-x-6 text-sm text-gray-500">
                                                    <div className="flex items-center">
                                                        <Users className="w-4 h-4 mr-1" />
                                                        <span>{personData.connections}+ connections</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Eye className="w-4 h-4 mr-1" />
                                                        <span>{personData.profileViews} profile views</span>
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap gap-6">
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
                                            </div>

                                            <div className="flex gap-3">
                                                <Button variant="default">Connect</Button>
                                                <Button variant="outline" size="icon" asChild>
                                                    <a href={personData.social.linkedin} target="_blank" rel="noopener noreferrer">
                                                        <LinkedinIcon className="w-5 h-5" />
                                                    </a>
                                                </Button>

                                                <Button variant="outline" size="icon" asChild>
                                                    <a href={personData.social.twitter} target="_blank" rel="noopener noreferrer">
                                                        <TwitterIcon className="w-5 h-5" />
                                                    </a>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>





                        {/* Projects Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-3xl">Projects</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {personData.projects.map((project) => (
                                        <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                            <CardContent className="p-0">
                                                <div className="relative h-48">
                                                    <Image
                                                        src={project.image}
                                                        alt={project.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                    <div className="absolute top-4 right-4">
                                                        <Badge variant="secondary" className="bg-white/90">
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
                            </CardContent>
                        </Card>

                        {/* About Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-3xl">About Me</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{personData.bio}</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}