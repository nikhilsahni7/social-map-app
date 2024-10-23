// src/app/profile/page.tsx
"use client";

import React from "react";
import ProjectDetails from "@/components/ProjectDetails"; 

const ProfilePage = () => {

  const projectDetails = {
    creator: "John Doe",
    title: "Innovative Map Project",
    preview: "/placeholder.svg?height=400&width=800",
    details:
      "This project is focused on creating an interactive map platform that helps users navigate and explore different regions. Our goal is to provide a user-friendly interface that combines detailed geographical data with real-time information, making it easier for people to discover and learn about various locations around the world.",
    category: "HDA, Duralin",
    photoCaption: "Preview of the interactive map project interface",
    others:
      "For more information about this project or to discuss potential collaborations, please don't hesitate to reach out to the project creator. We're always open to new ideas and partnerships that can help us improve and expand our platform.",
    supportNeeded: [
      {
        id: "1",
        name: "Volunteers",
        quantity: 5,
        units: "",
        type: "Volunteers",
      },
      { id: "2", name: "Laptops", quantity: 3, units: "", type: "Items" },
      {
        id: "3",
        name: "Office Space",
        quantity: 500,
        units: "sqft",
        type: "Other",
      },
      {
        id: "4",
        name: "Funding",
        quantity: 10000,
        units: "USD",
        type: "Financial",
      },
    ],
  };

  return <ProjectDetails {...projectDetails} />;
};

export default ProfilePage;
