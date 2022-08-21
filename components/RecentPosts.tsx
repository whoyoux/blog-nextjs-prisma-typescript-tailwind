import Link from "next/link";

import { PostType } from "../types";

const RecentPosts = ({ posts }: { posts: PostType[] }) => {
  return (
    <div className="flex sm:flex-row flex-col sm:flex-wrap sm:justify-between w-full mt-20 gap-8 sm:gap-4">
      {posts.map((post) => {
        return (
          <Link href={`posts/${post.id}`} key={post.id} passHref>
            <div className="w-full sm:w-[calc(50%-1rem)] bg p-10 rounded-lg hover-outline truncate">
              {post.title} &rarr;
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default RecentPosts;
