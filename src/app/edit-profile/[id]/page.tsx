// EditProfilePage.tsx

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";
import { getAuthUser, getAuthToken } from "@/lib/clientAuth";
import { EditProfileForm } from "@/components/edit-profile";
import { Loader2 } from "lucide-react";

interface UpdateProfileData {
  name?: string;
  email?: string;
  aboutMe?: string;
  city?: string;
  state?: string;
  occupation?: string;
}

export default function EditProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = getAuthToken();
      const user = getAuthUser();

      if (!token || !user) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch(`/api/users/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setUserData(data.user);
        } else {
          toast.error("Failed to fetch user data");
        }
        setIsLoading(false);
      } catch (error) {
        toast.error("Error fetching user data");
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleUpdateProfile = async (formData: UpdateProfileData) => {
    const token = getAuthToken();
    const user = getAuthUser();

    if (!token || !user) {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        toast.success("Profile updated successfully");
        router.push(`/creator-profile/${user.id}`);
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || "Failed to update profile");
      }
    } catch (error) {
      toast.error("Error updating profile");
    }
  };



  return (
    isLoading ? (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-black">
        <div className="text-center space-y-4">
          <Loader2 className="w-16 h-16 text-white animate-spin mx-auto" />
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Loading...
          </h2>
          <p className="text-lg text-blue-300">
            Make an impact by doing your bit
          </p>
        </div>
      </div>
    ) :
      (<div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">

        <Toaster position="top-right" />
        <motion.div
          className="w-full max-w-3xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >

          {userData && (
            <EditProfileForm
              userData={userData}
              onSubmit={handleUpdateProfile}
            />)}


        </motion.div>
      </div>)
  );
}