import { IconType } from "react-icons";

interface ButtonProps {
  label: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  outline?: boolean;
  small?: boolean;
  icon?: IconType;
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  disabled,
  outline,
  small,
  icon: Icon
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative disabled:opacity-80 disabled:cursor-not-allowed rounded-lg 
        transition w-full 
        ${outline 
          ? "bg-white text-black border-black hover:bg-neutral-200 dark:bg-black dark:text-white dark:hover:bg-neutral-800" 
          : "bg-black text-white border-white hover:bg-black hover:opacity-80 dark:bg-white dark:text-black dark:border-black dark:hover:bg-neutral-200"} 
        ${small ? "py-1 text-sm font-light border-[1px]" : "py-3 text-md font-semibold border-2"}
      `}
    >
      {Icon && <Icon size={24} className="absolute left-4 top-3" />}
      {label}
    </button>
  );
};

export default Button;
