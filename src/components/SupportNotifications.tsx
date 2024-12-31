// components/SupportNotifications.tsx
"use client";

import { useEffect, useState } from "react";
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

  const fetchSupportNotifications = async () => {
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
  };
  useEffect(() => {
    if (currentUser?.id === userId) {
      fetchSupportNotifications();
    }
  }, [userId, currentUser?.id]);

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
        {[...notifications].reverse().map((notification) => (
          <div
            key={notification._id}
            className="flex items-center space-x-4 mb-4"
          >
            <Link href={`/creator-profile/${notification.sender._id}`}>
              <Avatar className="w-10 h-10 cursor-pointer hover:opacity-80">
                <AvatarImage
                  src={notification.sender.avatar}
                  alt={notification.sender.name}
                />
                <AvatarFallback>{notification.sender.name[0]}</AvatarFallback>
              </Avatar>
            </Link>
            <div className="flex-1">
              <Link href={`/creator-profile/${notification.sender._id}`}>
                <span className="text-sm font-medium text-blue-600 hover:underline cursor-pointer">
                  {notification.sender.name}
                </span>
              </Link>
              <p className="text-sm text-gray-700">{notification.message}</p>
              <p className="text-xs text-gray-500">
                {new Date(notification.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              {notification.project ? (
                <Link href={`/project-profile/${notification.project._id}`}>
                  <Button variant="outline">View Project</Button>
                </Link>
              ) : (
                <Button variant="outline" disabled>Project Unavailable</Button>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
