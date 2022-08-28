import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextPage,
} from "next";

import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";

import { Role } from "@prisma/client";
import prisma from "../lib/prisma";

import dateFormatter from "../lib/dateFormatter";
import makeRequest from "../lib/makeRequest";
import { PostType } from "../types";

import { ArrowsClockwise, PencilSimple, TrashSimple } from "phosphor-react";

import { useRouter } from "next/router";
import { useState } from "react";

import Switch from "../components/ToggleSwitch";

type EditorPageType = {
  posts: PostType[];
  role: "WRITER" | "MODERATOR" | "ADMIN";
};

const Editor: NextPage<EditorPageType> = ({ posts, role }) => {
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<PostType | null>(null);

  console.log(posts);

  const [isRevalidating, setIsRevalidating] = useState<boolean>(false);

  const [publishedSwitchValue, setPublishedSwitchValue] =
    useState<boolean>(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const router = useRouter();

  const handleUpdateButton = (id: string) => {
    setEditingPostId(id);
    const selectedPost = posts.find((post) => post.id === id);

    if (!selectedPost) return;
    setSelectedPost(selectedPost);

    setTitle(selectedPost.title);
    setContent(selectedPost.content);
    setPublishedSwitchValue(selectedPost.published);

    console.log(`Updated post of id: ${id}`);
  };

  const handleDeleteButton = async (id: string) => {
    if (confirm("Are you sure?")) {
      await makeRequest({
        url: `/api/posts/delete`,
        method: "DELETE",
        body: {
          id,
        },
        loadingText: "Removing...",
        errorText: "Error!",
        successText: "Updated!",
        fnAfterSuccess: router.reload,
      });
    }
  };

  const handleSubmitEditPost = async () => {
    await makeRequest({
      url: `/api/posts/update`,
      method: "PUT",
      body: {
        id: editingPostId,
        title,
        content,
        published: publishedSwitchValue,
      },
      loadingText: "Editing...",
      errorText: "Error!",
      successText: "Updated!",
      fnAfterSuccess: router.reload,
    });
  };

  const handleGoBackToList = () => {
    setEditingPostId(null);
    setSelectedPost(null);
  };

  const handleRevalidate = async () => {
    await makeRequest({
      url: `/api/posts/revalidate`,
      method: "POST",
      loadingText: "Loading...",
      errorText: "Error!",
      successText: "Revalidated!",
      setPending: setIsRevalidating,
    });
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
            <div>
              <Switch
                enabled={publishedSwitchValue}
                onClick={() => {
                  setPublishedSwitchValue((prev) => !prev);
                }}
                withText
                textLabel="Published"
              />
            </div>
            <div className="flex gap-2 justify-end">
              {!selectedPost?.accepted && (
                <button
                  className="btn bg-indigo-600 hover:bg-indigo-700 transition-all"
                  onClick={handleSubmitEditPost}
                >
                  Accept
                </button>
              )}
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
              {role === "ADMIN" && (
                <button
                  className="btn bg disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleRevalidate}
                  disabled={isRevalidating}
                >
                  <div className="flex flex-row items-center gap-1">
                    Revalidate{" "}
                    <ArrowsClockwise
                      className={`text-xl ${isRevalidating && "animate-spin"}`}
                    />
                  </div>
                </button>
              )}
            </div>
          </div>
          <div className="sm:px-5 text-xs italic text-white/80 mb-2">
            <p>/ Deleting make post not published /</p>
          </div>
          <div className="flex flex-col gap-4 sm:gap-1">
            {posts.map((post) => {
              return (
                <div
                  key={post.id}
                  className="flex flex-row items-center justify-between hover-outline sm:p-5 py -2 rounded-lg"
                >
                  <div>
                    <h2
                      className={`text-xl cursor-pointer hover:underline`}
                      onClick={() => router.push(`/posts/${post.id}`)}
                    >
                      {post.title}{" "}
                      {!post.accepted && (
                        <span className="text-red-500 italic text-xs">
                          NOT ACCEPTED
                        </span>
                      )}
                    </h2>
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

  if (!user || !user.email || user.role === Role.USER) {
    console.log(user?.role);
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  let findPostsQuery = {
    where: {
      published: true,
      author: {
        id: user.id,
      },
    },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      published: true,
      images: true,
      accepted: true,
      author: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  };

  if (user.role === Role.ADMIN) {
    // @ts-ignore
    delete findPostsQuery.where;
  }

  const posts = await prisma.post.findMany(findPostsQuery);

  posts.forEach((post) => {
    // @ts-ignore
    post.createdAt = post.createdAt.toJSON();
    // @ts-ignore
    // post.updatedAt = post.updatedAt.toJSON();
  });

  return {
    props: { posts, role: user.role },
  };
};

export default Editor;
