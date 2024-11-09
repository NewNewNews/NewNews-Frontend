// src/components/ClientProviders.tsx
"use client"; // This component is a client component

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/theme-provider"; // Make sure this is a client component
import React from "react";

import { ReactNode } from "react";
import { AuthProvider } from "@/providers/AuthProvider";

interface ClientProvidersProps {
  children: ReactNode;
}

const ClientProviders = ({ children }: ClientProvidersProps) => {
  return (
    <SessionProvider>
      <AuthProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </AuthProvider>
    </SessionProvider>
  );
};

export default ClientProviders;
