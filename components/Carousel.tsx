import React, { useRef, useState } from "react";
import { PostFiles } from "../types";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/outline";

interface Props {
  files: PostFiles[];
}

const Carousel = ({ files }: Props) => {
  const [index, setIndex] = useState(0);

  return (
    <div className="relative h-72 w-full bg-black">
      {files.map((file, i) => (
        <div
          className={`${
            index === i
              ? "opacity-100 transition-opacity duration-1000"
              : "opacity-0 transition-opacity duration-1000"
          }`}
        >
          {index === i && (
            <div className="absolute top-0 flex h-full w-full">
              {file?.type.includes("video") ? (
                <video
                  className="h-full w-full object-cover"
                  src={file.postContentUrl}
                  loop
                  controls
                />
              ) : (
                <img
                  className="h-full w-full object-cover"
                  loading="lazy"
                  src={file.postContentUrl}
                  alt=""
                />
              )}
            </div>
          )}
        </div>
      ))}

      {index !== 0 && (
        <button
          className="controls left-3"
          onClick={() => setIndex((prev) => prev - 1)}
        >
          <ChevronLeftIcon className="h-6 text-blue-500" />
        </button>
      )}

      {index !== files.length - 1 && (
        <button
          className="controls right-3"
          onClick={() => setIndex((prev) => prev + 1)}
        >
          <ChevronRightIcon className="h-6 text-blue-500" />
        </button>
      )}
    </div>
  );
};

export default Carousel;
