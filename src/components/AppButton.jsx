import React from "react";

const AppButton = ({
  Icon,
  children,
  onClick,
  className = "",
  type = "button",
  disabled = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`outline-none rounded-md px-3 py-1 transition duration-100 h-10 bg-primaryDark text-white hover:bg-primary hover:text-dark text-sm lg:text-base ${className}`}
    >
      {Icon && <Icon />}
      {children}
    </button>
  );
};

export default AppButton;
