// EditProfileForm.tsx

"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  aboutMe: z.string().max(500, "About Me must be 500 characters or less"),
  city: z.string().optional(),
  state: z.string().optional(),
  occupation: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface EditProfileFormProps {
  userData: Partial<FormData>;
  onSubmit: (data: FormData) => void;
}

export function EditProfileForm({ userData, onSubmit }: EditProfileFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: userData.name || "",
      aboutMe: userData.aboutMe || "",
      city: userData.city || "",
      state: userData.state || "",
      occupation: userData.occupation || "",
    },
  });

  return (
    <Card className="bg-white shadow-xl">
      <CardHeader className="bg-blue-600 text-white rounded-t-lg">
        <CardTitle className="text-3xl font-bold">Edit Profile</CardTitle>
        <CardDescription className="text-blue-100">
          Update your profile information below.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="border-blue-200 focus:border-blue-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="aboutMe"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>About Me</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="border-blue-200 focus:border-blue-400 min-h-[100px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="border-blue-200 focus:border-blue-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="border-blue-200 focus:border-blue-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="occupation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Occupation</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="border-blue-200 focus:border-blue-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            >
              Save Changes
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
