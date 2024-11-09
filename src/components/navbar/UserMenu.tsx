"use client";

import { AiOutlineMenu } from "react-icons/ai";
import { useCallback, useState, useEffect } from "react";
import Avatar from "../Avatar";
import MenuItem from "./MenuItem";
import useRegisterModal from "@/hooks/useRegisterModal";
import useLoginModal from "@/hooks/useLoginModal";
import useLogoutModal from "@/hooks/useLogoutModal";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";

export default function UserMenu() {
  const { user, isLoading } = useUser();
  const isAdmin = user?.isAdmin;
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();
  const logoutModal = useLogoutModal();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = useCallback(() => {
    setIsOpen((value) => !value);
  }, []);

  const handleHomePage = () => {
    router.push("/");
    setIsOpen(false);
  };

  const handleProfile = () => {
    router.push("/profile");
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div className="flex flex-row items-center gap-3">
        <div
          onClick={handleHomePage}
          className="hidden md:block text-sm font-semibold py-3 px-4 rounded-full hover:bg-neutral-100 dark:bg-black dark:hover:bg-neutral-800 transition cursor-pointer"
        >
          NewNews your home
        </div>
        <div
          onClick={toggleMenu}
          className="p-4 md:py-1 md:px-2 border-[1px] border-neutral-200 dark:border-neutral-700  flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition"
        >
          <AiOutlineMenu className="text-black dark:text-white" />
          <div className="hidden md:block">
            <Avatar />
          </div>
        </div>
        {isOpen && (
          <div className="absolute rounded-xl shadow-md w-[40vw] md:w-3/4 bg-white dark:bg-neutral-900 overflow-hidden right-0 top-12 text-sm">
            <div className="flex flex-col cursor-pointer">
              {user ? (
                <>
                  <MenuItem
                    label={`Welcome, ${user?.email}`}
                    onClick={() => {}}
                  />
                  <hr />
                  <MenuItem label="My Favourites" onClick={() => {}} />
                  {isAdmin ? (
                    <>
                      <MenuItem label="Admin Panel" onClick={handleProfile} />
                      <hr />
                    </>
                  ) : (
                    <>
                      <MenuItem label="My Profile" onClick={handleProfile} />
                      <hr />
                    </>
                  )}
                  <MenuItem onClick={logoutModal.onOpen} label="Logout" />
                </>
              ) : (
                <>
                  <MenuItem onClick={loginModal.onOpen} label="Login" />
                  <MenuItem onClick={registerModal.onOpen} label="Sign up" />
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
