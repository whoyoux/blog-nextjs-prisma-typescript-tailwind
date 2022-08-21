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

import { TrashSimple, PencilSimple } from "phosphor-react";

type EditorPageType = {
  posts: PostType[];
};

const Editor: NextPage<EditorPageType> = ({ posts }) => {
  console.table(posts);
  return (
    <div>
      <div className="w-full flex flex-row items-center justify-between mb-8">
        <h1 className="text-3xl">List of posts:</h1>
        <button className="btn bg">Create</button>
      </div>
      <div className="flex flex-col gap-5">
        {posts.map((post) => {
          return (
            <div
              key={post.id}
              className="flex flex-row items-center justify-between"
            >
              <div>
                <h2 className="text-xl">{post.title}</h2>
                <h4 className="text-white/50 text-xs">
                  {dateFormatter.format(Date.parse(post.createdAt))}
                </h4>
              </div>
              <div className="flex gap-4">
                <button className="btn bg-blue-600 text-xl">
                  <PencilSimple />
                </button>
                <button className="btn bg-red-600 text-xl">
                  <TrashSimple />
                </button>
              </div>
            </div>
          );
        })}
      </div>
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
