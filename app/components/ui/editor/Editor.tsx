"use client";
import React, { useEffect, useState } from "react";
import Tiptap from "./Tiptap";
import Loader from "../Loader";
import EditorSkeleton from "../skeleton/EditorSkeleton";
import * as z from "zod";
import { ErrorMessage } from "../../ProfileForm";
import { useSession } from "next-auth/react";

const Editor = ({ id }: { id?: number }) => {
  const { data: userData } = useSession();
  const [content, setContent] = useState<string>("");
  const [image, setImage] = useState("");
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    title: "",
    content: "",
    image: "",
  });

  const fetchData = async (id: number) => {
    try {
      setIsLoading(true);
      const headers = new Headers();
      const response = await fetch(`/api/post/${id}`, {
        method: "GET",
        headers,
      });
      const data = await response.json();
      setTitle(data.post.title);
      setContent(data.post.content || "");
      setImage(data.post.image || "");
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const updatePost = async (
    id: number,
    formData: { title: string; content: string; image: string; id: number }
  ) => {
    try {
      setSubmitLoading(true);
      const data = JSON.stringify(formData);
      const headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append("Authorization", userData?.user.username || "");

      const response = await fetch(`/api/admin/post`, {
        method: "PUT",
        headers: headers,
        body: data,
      });
      if (response.ok) {
        setSubmitLoading(false);
        const data = await response.json();
        fetchData(data.post.id);
      } else {
        const responseData = await response.json();
        setError(responseData.message);
      }
    } catch (error: any) {
      console.log(error);
      setError("something went wrong");
      setSubmitLoading(false);
    }
  };
  const createPost = async (formData: {
    title: string;
    content: string;
    image: string;
  }) => {
    try {
      setSubmitLoading(true);
      const data = JSON.stringify(formData);
      const headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append("Authorization", userData?.user.username || "");

      const response = await fetch(`/api/admin/post`, {
        method: "POST",
        headers: headers,
        body: data,
      });
      if (response.ok) {
        setSubmitLoading(false);
        const data = await response.json();
        fetchData(data.post.id);
      } else {
        const responseData = await response.json();
        setError(responseData.message);
      }
    } catch (error: any) {
      console.log(error);
      setError("something went wrong");
      setSubmitLoading(false);
    }
  };
  useEffect(() => {
    if (id) {
      fetchData(id);
    }
  }, [id]);

  const formSchema = z.object({
    title: z
      .string()
      .min(1, "title is required")
      .max(100, "maximum 100 characters only"),
    content: z.string().min(1, "content is required"),
    image: z.string(),
  });

  const handleContentChange = (text: any) => {
    setContent(text);
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = {
      title: title,
      content: content,
      image: image,
    };
    try {
      const validated = formSchema.parse(formData);
      setValidationErrors({
        title: "",
        content: "",
        image: "",
      });
    } catch (error: any) {
      const validationErrorMessages: Record<string, string> = {};
      (error.errors || []).forEach((err: any) => {
        validationErrorMessages[err.path[0]] = err.message;
      });
      setValidationErrors({
        title: validationErrorMessages["title"] || "",
        content: validationErrorMessages["content"] || "",
        image: validationErrorMessages["image"] || "",
      });
      return;
    }

    if (id) {
      const data = { id, ...formData };
      await updatePost(id, data);
    } else {
      await createPost(formData);
    }
  };
  return (
    <div>
      {isLoading ? (
        <EditorSkeleton />
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto ">
            <div className="w-full ">
              <div className="">
                <div className="grid grid-cols-1 grid-rows-1 xl:gap-4">
                  <div className="p-2">
                    <label className="block mb-2 text-sm font-medium">
                      Cover photo
                    </label>
                    <div className="flex flex-row flex-wrap lg:flex-col items-center gap-2 md:justify-between lg:items-start">
                      <div className="w-64 carousel ">
                        <div
                          className="carousel-item hover:-translate-y-2 group bg-neutral-50 duration-500 
                          h-fit w-fit flex text-neutral-600 flex-col justify-center items-center relative 
                         overflow-hidden shadow-md lg:mt-0 md:h-fit md:w-fit lg:w-fit lg:h-fit"
                        >
                          <img
                            src={image}
                            alt="cover"
                            className="w-full object-cover "
                          />
                        </div>
                      </div>

                      <input
                        type="text"
                        name="image"
                        value={image}
                        placeholder="paste image link here"
                        className="border sm:text-sm rounded-lg block w-full p-2.5 max-w-xs"
                        onChange={(e) => setImage(e.target.value)}
                      />
                    </div>
                    {validationErrors.image != "" && (
                      <ErrorMessage text={validationErrors.image} />
                    )}
                  </div>
                  <div className="p-2">
                    <label className="block mb-2 text-sm font-medium">
                      Title
                    </label>
                    <input
                      className="border sm:text-sm rounded-lg block w-full p-2.5"
                      id="title"
                      name="title"
                      type="text"
                      placeholder="Enter post title here"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                    {validationErrors.title != "" && (
                      <ErrorMessage text={validationErrors.title} />
                    )}
                  </div>
                  <div className="p-2">
                    <label className="block mb-2 text-sm font-medium">
                      Content
                    </label>
                    <Tiptap
                      content={content}
                      onChange={(newContent: string) =>
                        handleContentChange(newContent)
                      }
                    />
                  </div>
                </div>
                <div className="w-full mt-4 pt-2 md:mt-1 lg:mt-4">
                  {submitLoading ? (
                    <Loader />
                  ) : (
                    <button
                      className="w-full bg-base-100 hover:bg-base-300 focus:ring-4 focus:outline-none
                       focus:ring-base-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center focus:ring-base-600 "
                      type="submit"
                    >
                      Save Draft
                    </button>
                  )}
                  {error && <ErrorMessage text={error} classes="text-center" />}
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default Editor;
