// components/SupportNotifications.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { getAuthUser } from "@/lib/clientAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Loader2 } from "lucide-react";

interface Notification {
  _id: string;
  sender: {
    _id: string;
    name: string;
    avatar: string;
  };
  project: {
    _id: string;
    title: string;
  };
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface SupportNotificationsProps {
  userId: string;
}

export default function SupportNotifications({
  userId,
}: SupportNotificationsProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const currentUser = getAuthUser();

  const fetchSupportNotifications = useCallback(async () => {
    try {
      const res = await fetch(`/api/users/${userId}/support/notifications`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();

      if (data.notifications) {
        setNotifications(data.notifications);
      }
    } catch (error) {
      console.error("Failed to fetch support notifications:", error);
    } finally {
      setLoading(false);
    }
  }, [userId]); // Add userId as a dependency

  // Call the function inside useEffect
  useEffect(() => {
    fetchSupportNotifications();
  }, [fetchSupportNotifications]);

  useEffect(() => {
    if (currentUser && currentUser.id === userId) {
      fetchSupportNotifications();
    }
  }, [userId, currentUser, fetchSupportNotifications]);

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
      </div>
    );
  }

  if (notifications.length === 0) {
    return <div>No support notifications at this time.</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Support Notifications</CardTitle>
      </CardHeader>
      <CardContent>
        {notifications.map((notification) => (
          <div
            key={notification._id}
            className="flex items-center space-x-4 mb-4"
          >
            <Avatar className="w-10 h-10">
              <AvatarImage
                src={notification.sender.avatar}
                alt={notification.sender.name}
              />
              <AvatarFallback>{notification.sender.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm text-gray-700">{notification.message}</p>
              <p className="text-xs text-gray-500">
                {new Date(notification.createdAt).toLocaleString()}
              </p>
            </div>
            <Link href={`/project-profile/${notification.project._id}`}>
              <Button variant="outline">View Project</Button>
            </Link>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
