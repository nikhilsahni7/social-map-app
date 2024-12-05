import React from "react";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
}

export function Loader({ size = "md" }: LoaderProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div
      className={`animate-spin rounded-full border-t-2 border-b-2 border-blue-500 ${sizeClasses[size]}`}
    ></div>
  );
}
