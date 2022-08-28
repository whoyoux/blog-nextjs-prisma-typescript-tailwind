import type { NextPage, GetStaticPaths, GetStaticProps } from "next";
import { ParsedUrlQuery } from "querystring";
import { useState } from "react";

import prisma from "../../lib/prisma";

type Post = {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: string;
    name: string;
    profilePicture: string;
  };
  imageUrl: string;
};

const PostPage: NextPage<{ post: Post }> = ({ post }) => {
  return (
    <div>
      {post.imageUrl && (
        <div className="w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.imageUrl}
            alt="img"
            width={200}
            height={200}
            className="rounded-lg mx-auto my-10"
          />
        </div>
      )}
      <h1 className="text-3xl mb-10">{post.title}</h1>
      <p className="text-white/90">{post.content}</p>
      <div className="flex flex-row w-full justify-between my-10 text-xs">
        <p>Author:</p>
        <p>{post.author.name}</p>
      </div>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await prisma.post.findMany({
    where: {
      published: true,
    },
    select: {
      id: true,
    },
  });

  const paths = posts.map((post) => ({
    params: { id: post.id },
  }));

  return { paths, fallback: "blocking" };
};

interface IParams extends ParsedUrlQuery {
  id: string;
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { id } = context.params as IParams;

  const post = await prisma.post.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      updatedAt: true,
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      imageUrl: true,
    },
  });

  if (!post) {
    return {
      notFound: true,
    };
  }

  // @ts-ignore
  post.createdAt = post?.createdAt.toJSON();
  // @ts-ignore
  post.updatedAt = post?.updatedAt.toJSON();

  return {
    props: { post },
  };
};

export default PostPage;
