import React from "react";
import Image from "next/image";
import { NotificationProps } from "../types";
import Notification from "./Notification";

interface Props {
  notifications: NotificationProps[];
}

const Notifications = ({ notifications }: Props) => {
  return (
    <div className="h-[85vh] w-[75vw] max-w-sm rounded-lg bg-white px-3 py-5 shadow-md">
      <h1 className="text-xl font-bold">Notifications</h1>

      {notifications.length > 0 ? (
        <div className="mt-3 h-[70vh] space-y-2 overflow-y-scroll scrollbar-hide">
          {notifications?.map((item) => (
            <Notification key={item.id} notification={item} />
          ))}
        </div>
      ) : (
        <div className="flex h-[75vh] items-center justify-center">
          <div className="flex flex-col items-center">
            <Image
              src="/assets/empty.svg"
              width={150}
              height={150}
              objectFit="contain"
            />

            <p className="text-lg font-bold">You have no notifications</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
