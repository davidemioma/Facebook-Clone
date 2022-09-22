import React from "react";
import { HomeIcon } from "@heroicons/react/solid";
import { LogoutIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import SidebarBtn from "./SidebarBtn";
import { User } from "../types";
import { signOut } from "@firebase/auth";
import { auth } from "../firebase";

interface Props {
  myAccount: User | null;
}

const Sidebar = ({ myAccount }: Props) => {
  const router = useRouter();

  return (
    <div
      className={`${
        router.asPath !== "/"
          ? "w-14"
          : "w-14 xl:w-64 xl:border-none xl:bg-transparent"
      } sticky top-12 z-10 h-[calc(100vh-48px)] border bg-white`}
    >
      <div className="mt-5 space-y-3">
        <SidebarBtn
          Icon={HomeIcon}
          href="/"
          text="Home"
          active={router.asPath === "/"}
        />

        <SidebarBtn
          imgSrc={
            myAccount?.photoUrl
              ? myAccount.photoUrl
              : "https://www.instagram.com/static/images/anonymousUser.jpg/23e7b3b2a737.jpg"
          }
          href={`/profile/${myAccount?.id}`}
          text="profile"
          active={router.asPath === `/profile/${myAccount?.id}`}
        />

        <SidebarBtn
          imgSrc="/assets/friends.png"
          href="/friends/requests"
          text="Friends"
          active={router.asPath === "/friends/requests"}
        />

        <div className="sm:hidden">
          <SidebarBtn
            Icon={LogoutIcon}
            href=""
            text="Logout"
            active={false}
            onClick={() => signOut(auth)}
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
