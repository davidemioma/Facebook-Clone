import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { MessageProps } from "../types";
import Moment from "react-moment";

interface Props {
  message: MessageProps;
}

const Message = ({ message }: Props) => {
  const [user] = useAuthState(auth);

  return (
    <div className="flex w-full overflow-hidden">
      <div
        className={`${
          message.userId === user?.uid
            ? "ml-auto rounded-tr-none bg-gray-100"
            : "rounded-tl-none bg-blue-500 text-white"
        } overflow-hidden rounded-lg px-4 py-2`}
      >
        <p className="max-w-[300px] break-all">
          {message.message}{" "}
          {message.timestamp && (
            <span className="text-xs">
              {
                <Moment
                  format={"LT"}
                  date={new Date(
                    message.timestamp?.seconds * 1000
                  ).toUTCString()}
                />
              }
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

export default Message;
