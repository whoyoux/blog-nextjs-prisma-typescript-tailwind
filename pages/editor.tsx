import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextPage,
} from "next";

import { authOptions } from "./api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";

import prisma from "../lib/prisma";
import { Role } from "@prisma/client";

import dateFormatter from "../lib/dateFormatter";
import { PostType } from "../types";

import { TrashSimple, PencilSimple, ArrowsClockwise } from "phosphor-react";

import toast from "react-hot-toast";
import { useState } from "react";

type EditorPageType = {
  posts: PostType[];
};

const Editor: NextPage<EditorPageType> = ({ posts }) => {
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<PostType | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleUpdateButton = (id: string) => {
    setEditingPostId(id);
    const selectedPost = posts.find((post) => post.id === id);

    if (!selectedPost) return;
    setSelectedPost(selectedPost);

    setTitle(selectedPost.title);
    setContent(selectedPost.content);

    console.log(`Updated post of id: ${id}`);
  };

  const handleDeleteButton = async (id: string) => {
    if (confirm("Are you sure?")) {
      const deleteToastId = toast.loading("Removing...");
      try {
        const response = await fetch(`/api/posts/delete`, {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id,
          }),
        });
        if (!response.ok) {
          toast.error("Error!", {
            id: deleteToastId,
          });
        } else {
          toast.success("Deleted!", {
            id: deleteToastId,
          });
        }
      } catch (err) {
        toast.error("Error!", {
          id: deleteToastId,
        });
        console.error(err);
      }
    }
  };

  const handleSubmitEditPost = async () => {
    const editingToastId = toast.loading("Editing...");
    try {
      const response = await fetch(`/api/posts/update`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingPostId,
          title,
          content,
        }),
      });
      if (!response.ok) {
        toast.error("Error!", {
          id: editingToastId,
        });
      } else {
        toast.success("Updated!", {
          id: editingToastId,
        });
        handleGoBackToList();
      }
    } catch (err) {
      toast.error("Error!", {
        id: editingToastId,
      });
      console.error(err);
    }
  };

  const handleGoBackToList = () => {
    setEditingPostId(null);
    setSelectedPost(null);
  };

  const handleRevalidate = async () => {
    const revalidateToastId = toast.loading("Loading...");
    try {
      const response = await fetch(`/api/posts/revalidate`);
      if (!response.ok) {
        toast.error("Error!", {
          id: revalidateToastId,
        });
      } else {
        toast.success("Revalidated!", {
          id: revalidateToastId,
        });
      }
    } catch (err) {
      toast.error("Error!", {
        id: revalidateToastId,
      });
      console.error(err);
    }
  };

  return (
    <div>
      {editingPostId ? (
        <div>
          <button onClick={handleGoBackToList}>&larr; Back to list</button>
          <div className="mt-10 pt-5 flex flex-col gap-5">
            <div>
              <label htmlFor="postTitle">Title</label>
              <input
                type="text"
                name="postTitle"
                id="postTitle"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-text"
              />
            </div>
            <div>
              <label htmlFor="postContent">Content</label>
              <textarea
                rows={10}
                name="postContent"
                id="postContent"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="input-text"
              />
            </div>
            <div className="flex justify-end">
              <button
                className="btn bg-green-600 hover:bg-green-700 transition-all"
                onClick={handleSubmitEditPost}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="w-full flex flex-col sm:flex-row gap-2 sm:gap-0 items-center justify-between mb-8 sm:px-5">
            <h1 className="text-3xl">List of posts:</h1>
            <div className="flex gap-5">
              <button className="btn bg">Create</button>
              <button className="btn bg" onClick={handleRevalidate}>
                <div className="flex flex-row items-center gap-1">
                  Revalidate <ArrowsClockwise className="text-xl" />
                </div>
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-4 sm:gap-1">
            {posts.map((post) => {
              return (
                <div
                  key={post.id}
                  className="flex flex-row items-center justify-between hover-outline sm:p-5 py -2 rounded-lg"
                >
                  <div>
                    <h2 className="text-xl">{post.title}</h2>
                    <h4 className="text-white/50 text-xs">
                      {dateFormatter.format(Date.parse(post.createdAt))}
                    </h4>
                  </div>
                  <div className="flex gap-4">
                    <button
                      className="btn bg-blue-600 text-xl hover:bg-blue-700 transition-all"
                      onClick={() => handleUpdateButton(post.id)}
                    >
                      <PencilSimple />
                    </button>
                    <button
                      className="btn bg-red-600 text-xl hover:bg-red-700 transition-all"
                      onClick={() => handleDeleteButton(post.id)}
                    >
                      <TrashSimple />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  if (
    !session ||
    !session.user ||
    !session.user.email ||
    typeof session.user.email !== "string"
  ) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user?.email,
    },
    select: {
      id: true,
      email: true,
      role: true,
    },
  });

  if (!user || !user.email || user.role !== (Role.ADMIN || Role.WRITER)) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const posts = await prisma.post.findMany({
    where: {
      author: {
        id: user.id,
      },
    },
    select: {
      id: true,
      title: true,
      content: true,
      published: true,
      createdAt: true,
    },
  });

  posts.forEach((post) => {
    // @ts-ignore
    post.createdAt = post.createdAt.toJSON();
    // @ts-ignore
    // post.updatedAt = post.updatedAt.toJSON();
  });

  return {
    props: { posts },
  };
};

export default Editor;
