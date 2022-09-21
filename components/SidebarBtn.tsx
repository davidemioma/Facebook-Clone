import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

interface Props {
  Icon?: any;
  imgSrc?: string;
  text: string;
  href: string;
  active: boolean;
}

const SidebarBtn = ({ Icon, imgSrc, text, href, active }: Props) => {
  const router = useRouter();

  const [showText, setShowText] = useState(false);

  return (
    <Link href={href}>
      <div
        className={`relative h-10 border-l-4 ${active && " border-blue-600"}`}
      >
        <div
          className={`ml-1.5 flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg hover:bg-gray-100 ${
            router.asPath === "/" &&
            " xl:w-full xl:justify-start xl:space-x-3 xl:pl-2 xl:hover:bg-gray-300"
          }`}
          onMouseEnter={() => setShowText(true)}
          onMouseLeave={() => setShowText(false)}
        >
          {Icon ? (
            <Icon className={`h-6 ${active && "text-blue-500"}`} />
          ) : (
            <img
              className="h-6 w-6 rounded-full object-cover"
              loading="lazy"
              src={imgSrc}
              alt=""
            />
          )}

          <p className={`hidden ${router.asPath === "/" && "xl:inline"}`}>
            {text}
          </p>
        </div>

        {showText && (
          <div className="absolute -right-16 top-1/2 z-20 -translate-y-1/2 rounded-lg bg-black/75 px-4 py-2 text-xs text-white xl:hidden">
            {text}
          </div>
        )}
      </div>
    </Link>
  );
};

export default SidebarBtn;
