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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { useToast } from "@/hooks/use-toast";

import { Trash2, Edit } from "lucide-react";
import Link from "next/link";

interface Organization {
  id: number;
  name: string;
  address: string;
  description: string;
  phone: string;
  email: string;
}

const initialOrganizations: Organization[] = [
  {
    id: 1,
    name: "Social Work Org 1",
    address: "123 Main St, City, State, 12345",
    description: "Helping communities thrive",
    phone: "+1 (555) 123-4567",
    email: "contact@org1.com",
  },
  {
    id: 2,
    name: "Social Work Org 2",
    address: "456 Elm St, Town, State, 67890",
    description: "Supporting families in need",
    phone: "+1 (555) 987-6543",
    email: "info@org2.com",
  },
];

const AdminDashboard: React.FC = () => {
  const toast = useToast();
  const [organizations, setOrganizations] =
    useState<Organization[]>(initialOrganizations);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);

  const handleAddOrg = (newOrg: Omit<Organization, "id">) => {
    setOrganizations([...organizations, { ...newOrg, id: Date.now() }]);
    toast.toast({
      title: "Organization Added",
      description: `${newOrg.name} has been successfully added.`,
    });
  };

  const handleEditOrg = (updatedOrg: Organization) => {
    setOrganizations(
      organizations.map((org) => (org.id === updatedOrg.id ? updatedOrg : org))
    );
    setEditingOrg(null);
    toast.toast({
      title: "Organization Updated",
      description: `${updatedOrg.name} has been successfully updated.`,
    });
  };

  const handleDeleteOrg = (id: number) => {
    setOrganizations(organizations.filter((org) => org.id !== id));
    toast.toast({
      title: "Organization Deleted",
      description: "The organization has been successfully removed.",
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-8">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto"
      >
        <header className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-blue-800">Admin Dashboard</h1>
          <Button asChild variant="outline">
            <Link href="/">Home</Link>
          </Button>
        </header>

        <Tabs defaultValue="manage" className="space-y-4">
          <TabsList>
            <TabsTrigger value="manage">Manage Organizations</TabsTrigger>
            <TabsTrigger value="add">Add Organization</TabsTrigger>
          </TabsList>
          <TabsContent value="manage">
            <Card>
              <CardHeader>
                <CardTitle>Manage Organizations</CardTitle>
                <CardDescription>
                  View, edit, and delete existing organizations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {organizations.map((org) => (
                      <TableRow key={org.id}>
                        <TableCell>{org.name}</TableCell>
                        <TableCell>{org.address}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setEditingOrg(org)}
                                >
                                  <Edit className="h-4 w-4 mr-2" /> Edit
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Edit Organization</DialogTitle>
                                  <DialogDescription>
                                    Make changes to the organization details
                                    here.
                                  </DialogDescription>
                                </DialogHeader>
                                <OrgForm
                                  org={editingOrg}
                                  onSubmit={handleEditOrg}
                                />
                              </DialogContent>
                            </Dialog>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm">
                                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Are you sure?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will
                                    permanently delete the organization.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteOrg(org.id)}
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="add">
            <Card>
              <CardHeader>
                <CardTitle>Add New Organization</CardTitle>
                <CardDescription>
                  Enter details for a new social work organization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <OrgForm onSubmit={handleAddOrg} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

interface OrgFormProps {
  org?: Organization | null;
  onSubmit: (org: Organization | Omit<Organization, "id">) => void;
}

const OrgForm: React.FC<OrgFormProps> = ({ org, onSubmit }) => {
  const [formData, setFormData] = useState<Omit<Organization, "id">>({
    name: org?.name || "",
    address: org?.address || "",
    description: org?.description || "",
    phone: org?.phone || "",
    email: org?.email || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(org ? { ...formData, id: org.id } : formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Organization Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <Button type="submit">
        {org ? "Update Organization" : "Add Organization"}
      </Button>
    </form>
  );
};

export default AdminDashboard;
