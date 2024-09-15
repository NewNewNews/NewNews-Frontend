"use client";

import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

interface InputProps {
    id: string;
    label: string;
    type?: string;
    disabled?: boolean;
    formatPrice?: boolean;
    required?: boolean;
    register: UseFormRegister<FieldValues>;
    errors?: FieldErrors;
}

const Input: React.FC<InputProps> = ({
    id,
    label,
    type = "text",
    disabled,
    formatPrice,
    required,
    register,
    errors,
}) => {
    return (
        <div className="w-full relative">
            <input
                id={id}
                type={type}
                disabled={disabled}
                {...(register ? register(id, { required }) : {})}
                placeholder=" "
                className={`peer w-full p-4 pt-6 font-light bg-white dark:bg-neutral-800 border-2 rounded-md outline-none transition disabled:opacity-80 disabled:cursor-not-allowed ${formatPrice ? 'pl-9' : 'pl-4' } ${errors && errors[id] ? "border-red-600 dark:border-red-600" : "border-neutral-300 dark:border-neutral-600"} ${errors && errors[id] ? "focus:border-red-600 dark:focus:border-red-600" : "focus:border-black dark:focus:border-white"}`}
            />
            <label
                className={`absolute text-md duration-150 transform -translate-y-3 top-5 z-10 origin-[0] ${formatPrice ? 'left-9' : 'left-4' } peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 ${errors && errors[id] ? "text-red-600 dark:text-red-500" : "text-zinc-400 dark:text-neutral-400"}`}
            >
                {label}
            </label>
        </div>
    );
}

export default Input;
