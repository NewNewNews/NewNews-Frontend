"use client";

import axios from "axios";
import { signIn } from "next-auth/react";
import { AiFillGithub } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { useCallback, useState } from "react";
import { FieldValues, set, SubmitHandler, useForm } from "react-hook-form";
import Modal from "./Modal";
import Heading from "../Heading";
import Input from "../inputs/Input";
// import useRegisterModal from "@/hooks/useRegisterModal";
import useLoginModal from "@/hooks/useLoginModal";
import { toast } from "react-hot-toast";
import Button from "../Button";
import { useRouter } from "next/navigation";

const LoginModal = () => {
  const router = useRouter();
  const loginModal = useLoginModal();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // const onSubmit : SubmitHandler<FieldValues> = async (data) => {
  //   setIsLoading(true);

  //   signIn('credentials', {
  //     ...data,
  //     redirect: false,
  //   })
  //   .then((callback) => {
  //       setIsLoading(false);

  //       if (callback?.ok) {
  //         toast.success('Logged in successfully');
  //         router.refresh();
  //         loginModal.onClose();
  //       }

  //       if (callback?.error) {
  //         toast.error(callback.error);
  //       }
  //   })
  // }

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);

    axios.post("http://localhost:8080/api/login", data)
        .then((callback) => {
            setIsLoading(false);
            
            if (callback.status === 200) {
                toast.success('Logged in successfully');
                localStorage.setItem('token', data.token);
                router.refresh();
                loginModal.onClose();
            }

            if (callback.status === 500) {
                toast.error('Invalid credentials');
            }
        })
        .catch((error) => {
            toast.error('Something went wrong.');
        })
        .finally(() => {
            setIsLoading(false);
        });
  }

  const bodyContent = (
    <div className="flex flex-col gap-4">
        <Heading
            title="Welcome back"
            subtitle="Login to your account!"
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
            id="hashedPassword"
            type="password"
            label="Password"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
        />
    </div>
    );

  return (
    <Modal
        disabled={isLoading}
        isOpen={loginModal.isLoginOpen}
        title="Login"
        actionlabel="Continue"
        onClose={loginModal.onClose}
        onSubmit={handleSubmit(onSubmit)}
        body={bodyContent}
    />
  );
};

export default LoginModal;
