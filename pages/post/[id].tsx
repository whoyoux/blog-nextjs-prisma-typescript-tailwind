import type {
  NextPage,
  GetServerSideProps,
  GetServerSidePropsContext,
} from "next";
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
  images: {
    id: string;
    url: string;
  }[];
};

const PostPage: NextPage<{ post: Post }> = ({ post }) => {
  const [selectedImgUrl, setImageSelectedUrl] = useState(
    post.images[0]?.url || ""
  );

  const handleSelectImg = () => {};

  return (
    <div>
      {post.images.length > 0 && (
        <div className="w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={selectedImgUrl}
            alt="img"
            width={200}
            height={200}
            className="rounded-lg mx-auto my-10"
          />

          <div className="flex flex-row w-full justify-center gap-5 mb-10">
            {post.images.length > 1 &&
              post.images.map((image) => {
                return (
                  <div key={image.id}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image.url}
                      alt="image"
                      width={50}
                      height={50}
                      className="rounded cursor-pointer"
                      onMouseEnter={() => setImageSelectedUrl(image.url)}
                    />
                  </div>
                );
              })}
          </div>
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

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const id = context.params?.id;

  if (!id || typeof id !== "string") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const post = await prisma.post.findUnique({
    where: {
      id: id,
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
          profilePicture: true,
        },
      },
      images: {
        select: {
          id: true,
          url: true,
        },
      },
    },
  });

  // @ts-ignore
  post.createdAt = post?.createdAt.toJSON();
  // @ts-ignore
  post.updatedAt = post?.updatedAt.toJSON();

  return { props: { post } };
};

export default PostPage;
