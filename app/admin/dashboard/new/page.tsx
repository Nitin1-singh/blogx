import Editor from "@/app/components/editor/Editor";
import React from "react";

const page = () => {
  return (
    <>
      <div className="bg-base-200 rounded-md p-2 m-2 sm:m-3 md:m-4 lg:m-5 xl:m-6">
        <h3
          className="flex justify-center text-xl md:text-2xl lg:text-3xl 
        tracking-wide font-semibold p-2"
        >
          Create Post
        </h3>
        <Editor />
      </div>
    </>
  );
};

export default page;
