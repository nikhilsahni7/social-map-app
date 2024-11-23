"use client";

import { LucideIcon } from 'lucide-react';

interface SectionHeaderProps {
  icon: LucideIcon;
  title: string;
}

export function SectionHeader({ icon: Icon, title }: SectionHeaderProps) {
  return (
    <div className="flex items-center space-x-2 text-blue-600">
      <Icon className="h-5 w-5" />
      <h3 className="text-lg font-semibold">{title}</h3>
    </div>
  );
}