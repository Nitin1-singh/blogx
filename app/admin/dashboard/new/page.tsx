import React from 'react';
import Editor from '@/app/components/editor/Editor';

const page = () => {
  return (
    <>
      <div className="m-2 rounded-md bg-base-200 p-2 sm:m-3 md:m-4 lg:m-5 xl:m-6">
        <h3
          className="flex justify-center p-2 text-xl font-semibold 
        tracking-wide md:text-2xl lg:text-3xl"
        >
          Create Post
        </h3>
        <Editor />
      </div>
    </>
  );
};

export default page;
