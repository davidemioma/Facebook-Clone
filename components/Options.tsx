import React from "react";
import Link from "next/link";
import { User } from "../types";
import { IoMdLogOut } from "react-icons/io";
import { signOut } from "@firebase/auth";
import { auth } from "../firebase";

interface Props {
  myAccount: User | null;
}

const Options = ({ myAccount }: Props) => {
  return (
    <div className="relative h-[60vh] w-[75vw] max-w-sm rounded-lg bg-white py-4 shadow-md">
      <div className="mx-3 rounded-lg px-3 py-4 shadow-md">
        <Link href={`/profile/${myAccount?.id}`}>
          <div className="flex cursor-pointer items-center space-x-2 border-b border-gray-300 pb-2">
            <img
              className="h-8 w-8 rounded-full object-cover"
              loading="lazy"
              src={
                myAccount?.photoUrl
                  ? myAccount.photoUrl
                  : "https://www.instagram.com/static/images/anonymousUser.jpg/23e7b3b2a737.jpg"
              }
              alt=""
            />

            <p className="font-semibold capitalize">{myAccount?.displayName}</p>
          </div>
        </Link>

        <Link href={`/profile/${myAccount?.id}`}>
          <p className="cursor-pointer pt-2 text-sm font-semibold text-blue-500">
            View Profile
          </p>
        </Link>
      </div>

      <div className="my-5 mx-1">
        <button className="profileBtn" onClick={() => signOut(auth)}>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
            <IoMdLogOut className="h-6" />
          </div>

          <p>Log Out</p>
        </button>
      </div>

      <p className="absolute bottom-3 px-3 text-sm text-gray-400">
        <span className="link">Privacy</span> .{" "}
        <span className="link">Terms</span> .{" "}
        <span className="link">Advertising</span> .{" "}
        <span className="link">Ad choices</span> .{" "}
        <span className="link">Cookies</span> .{" "}
        <span className="link">More</span> . <span className="link">Meta</span>{" "}
        © 2022
      </p>
    </div>
  );
};

export default Options;
