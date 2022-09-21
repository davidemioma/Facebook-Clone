import React from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { setFormOpen } from "../store/store";
import { TiVideo } from "react-icons/ti";
import { IoMdPhotos } from "react-icons/io";
import { BiHappy } from "react-icons/bi";
import { User } from "../types";

interface Props {
  myAccount: User | null;
}

const Box = ({ myAccount }: Props) => {
  const dispatch = useDispatch();

  const openModalHandler = () => {
    dispatch(setFormOpen(true));
  };
  return (
    <div className="mt-5 rounded-xl bg-white px-3 py-2">
      <div className="flex items-center space-x-3 border-b pb-2">
        <Link href={`/profile/${myAccount?.id}`}>
          <img
            className="h-10 w-10 cursor-pointer rounded-full object-cover"
            src={
              myAccount?.photoUrl
                ? myAccount?.photoUrl
                : "https://www.instagram.com/static/images/anonymousUser.jpg/23e7b3b2a737.jpg"
            }
            alt=""
          />
        </Link>

        <button className="flex-1 rounded-full bg-gray-100 py-1.5 px-4 text-left text-xs sm:text-sm">
          What&apos;s on your mind
          <span className="hidden capitalize sm:inline">
            , {myAccount?.firstname}
          </span>
          ?
        </button>
      </div>

      <div className="grid grid-cols-2 pt-2 sm:grid-cols-3 sm:justify-items-center">
        <button
          onClick={openModalHandler}
          className="flex w-full items-center space-x-2 rounded-lg px-6 py-2 hover:bg-gray-100"
        >
          <TiVideo size={20} className="text-red-500" />

          <p className="whitespace-nowrap text-xs sm:text-sm">Live video</p>
        </button>

        <button
          onClick={openModalHandler}
          className="flex w-full items-center space-x-2 rounded-lg px-6 py-2 hover:bg-gray-100"
        >
          <IoMdPhotos size={20} className="text-green-500" />

          <p className="whitespace-nowrap text-xs sm:text-sm">Photo/video</p>
        </button>

        <button
          onClick={openModalHandler}
          className="hidden w-full items-center space-x-2 rounded-lg px-6 py-2 hover:bg-gray-100 sm:inline-flex"
        >
          <BiHappy size={20} className="text-yellow-500" />

          <p className="whitespace-nowrap text-xs sm:text-sm">
            Feeling/activity
          </p>
        </button>
      </div>
    </div>
  );
};

export default Box;
