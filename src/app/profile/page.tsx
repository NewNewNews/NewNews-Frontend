"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Avatar from "@/components/Avatar";
import { useSession } from "next-auth/react";

const ProfilePage = () => {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300 bg-neutral-100 dark:bg-neutral-900">
      <div className="container mx-auto p-4 sm:p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card
            className="lg:col-span-1 overflow-hidden"
          >
            <CardContent className="p-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar/>
                <h2 className="text-xl sm:text-2xl font-semibold">
                  {session?.user?.name.split("@")[0]}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {session?.user?.email}
                </p>
                <Card className="w-full bg-white dark:bg-neutral-700">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-medium">User Profile Card</h3>
                    </div>
                    <div
                      className={`transition-all duration-300`}
                    >
                      <p className="text-sm mb-1">ID: {session?.user?.id}</p>
                      <p className="text-sm">Role: {session?.user?.isAdmin? "admin" : "user"}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
          </div>
        </div>
    </div>
  );
};

export default ProfilePage;
