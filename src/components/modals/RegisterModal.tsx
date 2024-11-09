"use client";

import axios from "axios";
import { AiFillGithub } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { useCallback, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Modal from "./Modal";
import Heading from "../Heading";
import Input from "../inputs/Input";
import useRegisterModal from "@/hooks/useRegisterModal";
import { toast } from "react-hot-toast";
import Button from "../Button";
import useLoginModal from "@/hooks/useLoginModal";
import apiClient from "@/app/api/axios";

const RegisterModal = () => {
  const registerModal = useRegisterModal();
  const LoginModal = useLoginModal();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      //   username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      setIsLoading(true);

      // Add explicit headers to the request
      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      };

      const response = await apiClient.post("/register", data, config);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);

        // Set the token for subsequent requests
        apiClient.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.token}`;
      }

      toast.success("Account created successfully.");
      registerModal.onClose();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error(
            "Server Error:",
            error.response.status,
            error.response.data
          );
          const errorMessage =
            error.response.data?.message ||
            error.response.data?.error ||
            "Registration failed.";
          toast.error(errorMessage);
        } else if (error.request) {
          console.error("Network Error:", error.request);
          toast.error("Network error. Please check your connection.");
        } else {
          console.error("Error:", error.message);
          toast.error("An unexpected error occurred.");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };
  const loginOpen = () => {
    LoginModal.onOpen();
    registerModal.onClose();
  };

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading
        title="Welcome to NewNews"
        subtitle="Create an account to get started!"
      />
      <Input
        id="email"
        label="Email"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="name"
        label="Name"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="password"
        type="password"
        label="Password"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
    </div>
  );

  const footerContent = (
    <div className="flex flex-col gap-4 mt-3">
      <hr className="dark:border-white" />
      <Button
        outline
        label="Continue with Google"
        icon={FcGoogle}
        onClick={() => {}}
      />
      <Button
        outline
        label="Continue with Github"
        icon={AiFillGithub}
        onClick={() => {}}
      />
      <div className="text-neutral-500 text-center mt-4 font-light">
        <div className="justify-center flex fex-row items-center gap-2">
          <div>Already have an account?</div>
          <div
            onClick={loginOpen}
            className="text-neutral-800 cursor-pointer hover:underline dark:text-white"
          >
            Log in
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={registerModal.isOpen}
      title="Register"
      actionlabel="Continue"
      onClose={registerModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default RegisterModal;
