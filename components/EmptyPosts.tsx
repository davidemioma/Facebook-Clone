import React from "react";
import { useDispatch } from "react-redux";
import { setFormOpen } from "../store/store";

const EmptyPosts = () => {
  const dispatch = useDispatch();

  return (
    <div className="mt-5 mb-10 rounded-lg bg-white p-4 text-center">
      <h2 className="text-xl font-medium">No more posts</h2>

      <p className="mb-2">Add a post on your feed</p>

      <button
        onClick={() => dispatch(setFormOpen(true))}
        className="w-36 rounded-lg bg-blue-500 py-1 font-medium text-white"
      >
        Add Post
      </button>
    </div>
  );
};

export default EmptyPosts;
