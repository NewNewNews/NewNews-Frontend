"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { toast } from "react-hot-toast";
import useLogoutModal from "@/hooks/useLogoutModal";
import Modal from "./Modal";
import Heading from "../Heading";

const LogoutModal = () => {
  const router = useRouter();
  const logoutModal = useLogoutModal();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async () => {
    setIsLoading(true);

    try {
      const result = await signOut({ redirect: false, callbackUrl: "/" });

      toast.success("Logged out successfully");
      router.push("/"); // Redirect to home page
      logoutModal.onClose();
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading title="Are you sure you want to log out?" subtitle="You will be logged out of your account." />
      <p>Please confirm that you want to log out. If you wish to continue, click the "Log Out" button below. Otherwise, click "Cancel" to return to your account.</p>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={logoutModal.isLogoutOpen}
      title="Logout"
      actionlabel="Confirm"
      onClose={logoutModal.onClose}
      onSubmit={onSubmit}
      body={bodyContent}
      secondaryLabel="Cancel"
      secondaryAction={logoutModal.onClose}
    />
  );
};

export default LogoutModal;
