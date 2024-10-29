"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  Send,
  Linkedin,
  Twitter,
  Facebook,
  Check,
  AlertCircle,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    inquiryType: "",
  });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const inquiryTypes = [
    { id: "general", label: "General Inquiry" },
    { id: "partnership", label: "Partnership Opportunity" },
    { id: "support", label: "Technical Support" },
    { id: "feedback", label: "Feedback" },
    { id: "other", label: "Other" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStatus("success");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        inquiryType: "",
      });
    } catch (error) {
      setStatus("error");
    }
  };

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">


      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-16">
        <Link href="/">
          <Button variant="secondary" className="absolute top-4 left-4 flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />

          </Button>
        </Link>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
          <p className="text-xl text-blue-100">
            We&apos;re here to help and answer any questions you might have
          </p>
        </div>
      </section>

      {/* Contact Information Cards */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="rounded-full bg-blue-100 p-3 w-12 h-12 mx-auto mb-4">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Email Us</h3>
                <p className="text-gray-600 mb-2">contact@example.com</p>
                <p className="text-gray-600">support@example.com</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="rounded-full bg-blue-100 p-3 w-12 h-12 mx-auto mb-4">
                  <Phone className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Call Us</h3>
                <p className="text-gray-600 mb-2">+1 (555) 123-4567</p>
                <p className="text-gray-600">Mon-Fri 9am-6pm EST</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="rounded-full bg-blue-100 p-3 w-12 h-12 mx-auto mb-4">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Visit Us</h3>
                <p className="text-gray-600 mb-2">123 Innovation Drive</p>
                <p className="text-gray-600">San Francisco, CA 94107</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-5xl mb-4 font-bold text-center">
                Send Us a Message
              </CardTitle>
            </CardHeader>
            <CardContent>
              {status === "success" && (
                <Alert className="mb-6 bg-green-50 text-green-700 border-green-200">
                  <Check className="h-4 w-4" />
                  <AlertDescription>
                    Your message has been sent successfully! We&apos;ll get back
                    to you soon.
                  </AlertDescription>
                </Alert>
              )}

              {status === "error" && (
                <Alert className="mb-6 bg-red-50 text-red-700 border-red-200">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    There was an error sending your message. Please try again.
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inquiryType">Type of Inquiry</Label>
                  <Select
                    value={formData.inquiryType}
                    onValueChange={(value) =>
                      handleChange("inquiryType", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select inquiry type" />
                    </SelectTrigger>
                    <SelectContent>
                      {inquiryTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => handleChange("subject", e.target.value)}
                    placeholder="What is this regarding?"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    placeholder="Your message here..."
                    className="min-h-[150px]"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={status === "loading"}
                >
                  {status === "loading" ? (
                    <span className="flex items-center gap-2">
                      Sending... <Send className="h-4 w-4 animate-pulse" />
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Send Message <Send className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Office Hours & Social Links */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  Office Hours
                </h3>
                <div className="space-y-2 text-gray-600">
                  <p>Monday - Friday: 9:00 AM - 6:00 PM EST</p>
                  <p>Saturday: 10:00 AM - 2:00 PM EST</p>
                  <p>Sunday: Closed</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                  Connect With Us
                </h3>
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                  >
                    <Linkedin className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                  >
                    <Twitter className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                  >
                    <Facebook className="h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
