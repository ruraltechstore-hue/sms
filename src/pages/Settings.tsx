import { useState } from "react";
import { motion } from "framer-motion";
import { Settings as SettingsIcon, Building2, CalendarDays, Bell, Palette } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SchoolProfile } from "@/components/settings/SchoolProfile";
import { AcademicYearSettings } from "@/components/settings/AcademicYearSettings";
import { NotificationPreferences } from "@/components/settings/NotificationPreferences";
import { ThemeCustomization } from "@/components/settings/ThemeCustomization";

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold">Settings</h2>
        <p className="text-muted-foreground">Configure school profile, academic year, and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile" className="gap-1.5"><Building2 className="h-3.5 w-3.5" />School Profile</TabsTrigger>
          <TabsTrigger value="academic" className="gap-1.5"><CalendarDays className="h-3.5 w-3.5" />Academic Year</TabsTrigger>
          <TabsTrigger value="notifications" className="gap-1.5"><Bell className="h-3.5 w-3.5" />Notifications</TabsTrigger>
          <TabsTrigger value="theme" className="gap-1.5"><Palette className="h-3.5 w-3.5" />Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="profile"><SchoolProfile /></TabsContent>
        <TabsContent value="academic"><AcademicYearSettings /></TabsContent>
        <TabsContent value="notifications"><NotificationPreferences /></TabsContent>
        <TabsContent value="theme"><ThemeCustomization /></TabsContent>
      </Tabs>
    </div>
  );
}
