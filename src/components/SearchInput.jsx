import React from "react";

const SearchInput = ({
  placeholder,
  onChange,
  Icon,
  className,
  onKeyPress,
  inputClassName,
}) => {
  return (
    <div
      className={`flex w-full h-10 px-1 items-center space-x-1 text-dark text-xs lg:text-sm border-2 border-r-0 border-darkGray/20 rounded-md rounded-r-none focus-within:border-primary transition duration-300 ${className}`}
    >
      <input
        type="text"
        className={`h-10 border-0 focus:ring-0 outline-none w-full bg-inherit ${inputClassName}`}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={(e) => onKeyPress(e)}
      />
      {Icon && <Icon className="w-6 h-6 " />}
    </div>
  );
};

export default SearchInput;
