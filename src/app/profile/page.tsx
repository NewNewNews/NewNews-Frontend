"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Avatar from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import CircularProgress from "@mui/material/CircularProgress";
import toast from "react-hot-toast";
import { useUser } from "@/hooks/useUser";

const ProfilePage = () => {
  const { user, isLoading } = useUser();
  const isAdmin = user?.isAdmin;
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const scrapeNews = async () => {
    setLoading(true);
    setMessage(""); // Reset previous messages
    const res = await fetch(`/api/scrape`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: "" }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        setMessage("Scraping successful!"); // Feedback for success
        toast.success("Scraping successful!");
      } else {
        setMessage("Scraping failed!"); // Feedback for failure
        toast.error("Scraping failed!");
      }
    } else {
      setMessage("Error during scraping!"); // Feedback for error
    }
    setLoading(false);
  };

  const updateProfile = async () => {
    // Implement update profile
  }
  

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300 bg-neutral-100 dark:bg-neutral-900">
      <div className="container mx-auto p-4 sm:p-6 space-y-6 flex flex-col items-center justify-center">
        <div className="w-full max-w-md">
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar />
                <h2 className="text-xl sm:text-2xl font-semibold">
                  {user?.name.split("@")[0]}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {user?.email}
                </p>
                <Card className="w-full bg-white dark:bg-neutral-700">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-medium">User Profile Card</h3>
                    </div>
                    <div className="transition-all duration-300">
                      <p className="text-sm mb-1">ID: {user?.id}</p>
                      <p className="text-sm">
                        Role: {isAdmin ? "admin" : "user"}
                      </p>
                    </div>
                    {isAdmin && (
                      <div className="flex flex-col items-center">
                        <Button
                          onClick={scrapeNews}
                          className="mt-4 px-4 py-2 rounded transition-colors duration-300"
                          disabled={loading}
                        >
                          {loading ? (
                            <CircularProgress size={24} color="inherit" />
                          ) : (
                            "Scrape News"
                          )}
                        </Button>
                        {/* Message Display */}
                        {message && (
                          <p
                            className={`mt-2 text-sm ${
                              message.includes("Error") ||
                              message.includes("failed")
                                ? "text-red-500"
                                : "text-green-500"
                            }`}
                          >
                            {message}
                          </p>
                        )}
                      </div>
                    )}
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
