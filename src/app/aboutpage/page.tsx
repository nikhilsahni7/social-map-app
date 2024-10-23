import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Heart,
  Globe2,
  Medal,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Twitter,
} from "lucide-react";

const AboutPage = () => {
  const stats = [
    { id: 1, label: "Organizations Helped", value: "500+", icon: Users },
    { id: 2, label: "Communities Served", value: "1M+", icon: Heart },
    { id: 3, label: "Countries Reached", value: "50+", icon: Globe2 },
    { id: 4, label: "Awards Won", value: "25+", icon: Medal },
  ];

  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "Founder & CEO",
      image: "/api/placeholder/150/150",
      bio: "Passionate about creating positive social impact through technology.",
    },
    {
      name: "Michael Chen",
      role: "Head of Operations",
      image: "/api/placeholder/150/150",
      bio: "Expert in scaling social initiatives across diverse communities.",
    },
    {
      name: "Elena Rodriguez",
      role: "Community Director",
      image: "/api/placeholder/150/150",
      bio: "Dedicated to building bridges between organizations and communities.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-blue-600 text-white py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Empowering Social Change
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Connecting organizations and communities for a better tomorrow
            </p>
            <Button variant="secondary" size="lg" className="group">
              Join Our Mission
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => {
              const IconComponent = stat.icon;
              return (
                <Card
                  key={stat.id}
                  className="text-center p-6 hover:shadow-lg transition-shadow"
                >
                  <CardContent className="pt-4">
                    <IconComponent className="h-8 w-8 mx-auto mb-4 text-blue-600" />
                    <div className="text-3xl font-bold mb-2 text-gray-900">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-8">Our Mission</h2>
          <p className="text-lg text-gray-600 mb-8">
            We believe in the power of connection to transform communities and
            create lasting social impact. Our platform brings together social
            organizations, volunteers, and resources to address the world&apos;s
            most pressing challenges. Through technology and collaboration,
            we&apos;re building a more inclusive and sustainable future for all.
          </p>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Our Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <Card
                key={member.name}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <Image
                  src={member.image}
                  alt={member.name}
                  width={128}
                  height={128}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <CardContent className="p-4">
                  <h3 className="text-xl font-semibold text-center mb-1">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 text-center mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-center">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Get in Touch</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Mail className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Email</h3>
              <p className="text-gray-600">contact@example.com</p>
            </div>
            <div className="flex flex-col items-center">
              <Phone className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Phone</h3>
              <p className="text-gray-600">+1 (555) 123-4567</p>
            </div>
            <div className="flex flex-col items-center">
              <MapPin className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Location</h3>
              <p className="text-gray-600">San Francisco, CA</p>
            </div>
          </div>
          <div className="flex justify-center gap-6 mt-12">
            <Button variant="ghost" size="icon">
              <Github className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Linkedin className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Twitter className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
