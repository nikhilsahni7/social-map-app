"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle, Trash2 } from "lucide-react";
import Link from "next/link";

// Mock data for the organization
const orgData = {
  name: "Social Work Org 1",
  description: "Helping communities thrive",
  address: "123 Main St, New York, NY 10001",
  phone: "+1 (555) 123-4567",
  email: "contact@org1.com",
  donationInfo: "Support our cause with a donation",
};

// Mock data for potential donors
const initialDonors = [
  { id: 1, name: "John Doe", email: "john@example.com", phone: "123-456-7890" },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "098-765-4321",
  },
];

const SocialWorkerDashboard = () => {
  const [donors, setDonors] = useState(initialDonors);
  const [newDonor, setNewDonor] = useState({ name: "", email: "", phone: "" });

  const addDonor = () => {
    if (newDonor.name && newDonor.email && newDonor.phone) {
      setDonors([...donors, { id: donors.length + 1, ...newDonor }]);
      setNewDonor({ name: "", email: "", phone: "" });
    }
  };

  const removeDonor = (id) => {
    setDonors(donors.filter((donor) => donor.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-100 to-indigo-100 p-8">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto"
      >
        <header className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-teal-800">
            {orgData.name} Dashboard
          </h1>
          <Button asChild variant="outline">
            <Link href="/">Home</Link>
          </Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Organization Information</CardTitle>
              <CardDescription>
                Key details about your organization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>
                  <strong>Description:</strong> {orgData.description}
                </p>
                <p>
                  <strong>Address:</strong> {orgData.address}
                </p>
                <p>
                  <strong>Phone:</strong> {orgData.phone}
                </p>
                <p>
                  <strong>Email:</strong> {orgData.email}
                </p>
                <p>
                  <strong>Donation Info:</strong> {orgData.donationInfo}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Add Potential Donor</CardTitle>
              <CardDescription>
                Enter information for a new potential donor
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newDonor.name}
                    onChange={(e) =>
                      setNewDonor({ ...newDonor, name: e.target.value })
                    }
                    placeholder="Enter donor's name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newDonor.email}
                    onChange={(e) =>
                      setNewDonor({ ...newDonor, email: e.target.value })
                    }
                    placeholder="Enter donor's email"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={newDonor.phone}
                    onChange={(e) =>
                      setNewDonor({ ...newDonor, phone: e.target.value })
                    }
                    placeholder="Enter donor's phone"
                  />
                </div>
                <Button onClick={addDonor} className="w-full">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Donor
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Potential Donors</CardTitle>
            <CardDescription>
              Manage your list of potential donors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {donors.map((donor) => (
                  <TableRow key={donor.id}>
                    <TableCell>{donor.name}</TableCell>
                    <TableCell>{donor.email}</TableCell>
                    <TableCell>{donor.phone}</TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeDonor(donor.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SocialWorkerDashboard;
