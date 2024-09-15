import type { Metadata } from "next";
import {Nunito} from 'next/font/google'
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "../components/navbar/Navbar";
import ClientOnly from "@/components/ClientOnly";
import RegisterModal from "@/components/modals/RegisterModal";
import ToasterProvider from "@/providers/ToasterProvider";

const font = Nunito({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NewNews",
  description: "NewNews",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={font.className}
      >
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
          <ClientOnly>
            <ToasterProvider />
            <RegisterModal />
            <Navbar />
          </ClientOnly>
        </ThemeProvider>
        {children}
      </body>
    </html>
  );
}
