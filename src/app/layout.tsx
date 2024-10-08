import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "../components/navbar/Navbar";
import ClientOnly from "@/components/ClientOnly";
import RegisterModal from "@/components/modals/RegisterModal";
import ToasterProvider from "@/providers/ToasterProvider";
import LoginModal from "@/components/modals/LoginModal";
import ClientProviders from "@/components/client-provider";
import LogoutModal from "@/components/modals/LogoutModal";

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
      <body className={font.className}>
        <ClientOnly>
          <ClientProviders>
            <ToasterProvider />
            <LoginModal />
            <RegisterModal />
            <LogoutModal />
            <Navbar />
            <div className="pb-20 pt-24 dark:bg-neutral-900">{children}</div>
          </ClientProviders>
        </ClientOnly>
      </body>
    </html>
  );
}
