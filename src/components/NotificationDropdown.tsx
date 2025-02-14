// components/NotificationDropdown.tsx
"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell } from "lucide-react";

interface Notification {
  _id: string;
  requester: {
    _id: string;
    name: string;
    avatar: string;
  };
  status: string;
}

interface NotificationDropdownProps {
  notifications?: Notification[]; 
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}

export function NotificationDropdown({
  notifications = [], 
  onAccept,
  onReject,
}: NotificationDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
              {notifications.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        {notifications.length === 0 ? (
          <DropdownMenuItem className="text-center text-gray-500 py-4">
            No new notifications
          </DropdownMenuItem>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem key={notification._id} className="p-4">
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={notification.requester.avatar} />
                  <AvatarFallback>
                    {notification.requester.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">
                      {notification.requester.name}
                    </span>{" "}
                    wants to connect with you
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => onAccept(notification._id)}
                      className="w-full"
                    >
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onReject(notification._id)}
                      className="w-full"
                    >
                      Decline
                    </Button>
                  </div>
                </div>
              </div>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
