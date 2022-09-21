import React, { useState } from "react";

interface Props {
  imgSrc?: string;
  Icon?: any;
  text: string;
  onClick: () => void;
  isSide?: boolean;
  active: boolean;
}

const IconBtn = ({ imgSrc, Icon, text, onClick, isSide, active }: Props) => {
  const [showText, setShowText] = useState(false);

  return (
    <div className="relative">
      <button
        onMouseEnter={() => setShowText(true)}
        onMouseLeave={() => setShowText(false)}
        onClick={onClick}
        className={`${
          active ? "bg-blue-100" : "bg-gray-100"
        } flex h-10 w-10 items-center justify-center overflow-hidden rounded-full hover:bg-gray-200`}
      >
        {Icon ? (
          <Icon size={18} className={`${active && "text-blue-500"}`} />
        ) : (
          <img
            className="h-full w-full object-cover"
            loading="lazy"
            src={imgSrc}
            alt=""
          />
        )}
      </button>

      {showText && (
        <div
          className={`absolute z-30 ${
            !isSide ? "-bottom-10 left-1/2 -translate-x-1/2" : ""
          } rounded-lg bg-black/75 px-4 py-2 text-xs text-white`}
        >
          {text}
        </div>
      )}
    </div>
  );
};

export default IconBtn;
