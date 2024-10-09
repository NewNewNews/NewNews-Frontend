"use client";

import Container from "../Container";
import Logo from "./Logo";
import Search from "./Search";
import UserMenu from "./UserMenu";
import { ModeToggle } from "./ModeToggle";
import { useSession } from "next-auth/react";
import { use, useState, useEffect } from "react";
import axios from "axios";

interface User {
  message: String;
  hashedPassword: String;
  isAdmin: Boolean;
}

interface NavbarProps {
  currentUser?: User;
}

const Navbar: React.FC<NavbarProps> = () => {
  const { data: session } = useSession();
  console.log(session?.user.isAdmin);

  return (
    <div className="fixed top-0 z-10 w-full bg-white dark:bg-black shadow-sm border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="py-4 border-b-[1px]">
        <Container>
          <div className="flex flex-row items-center justify-between gap-3 md:gap-0 md:flex">
            <div className="flex items-center gap-5">
              <Logo />
              <Search />
            </div>
            <div className="flex items-center gap-3">
              <ModeToggle />
              <UserMenu />
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Navbar;
