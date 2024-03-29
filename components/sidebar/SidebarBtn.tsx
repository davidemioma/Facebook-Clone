import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

interface Props {
  Icon?: any;
  imgSrc?: string;
  text?: string;
  href: string;
  active?: boolean;
  onClick?: () => void;
}

const SidebarBtn = ({ Icon, imgSrc, text, href, active, onClick }: Props) => {
  const router = useRouter();

  return (
    <Link href={href}>
      <div
        className={`group relative h-10 border-l-4 ${
          active && " border-blue-600"
        }`}
        onClick={onClick}
      >
        <div
          className={`ml-1.5 flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg hover:bg-gray-100 ${
            router.asPath === "/" &&
            " lg:w-full lg:justify-start lg:space-x-3 lg:pl-2 lg:hover:bg-gray-300"
          }`}
        >
          {Icon && (
            <Icon size={20} className={`h-6 ${active && "text-blue-500"}`} />
          )}

          {imgSrc && (
            <div className="relative h-6 w-6 overflow-hidden rounded-full">
              <Image className="object-cover" src={imgSrc} fill alt="" />
            </div>
          )}

          <p className={`hidden ${router.asPath === "/" && "lg:inline"}`}>
            {text}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default SidebarBtn;
