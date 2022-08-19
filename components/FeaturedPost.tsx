import Link from "next/link";
import dateFormatter from "../lib/dateFormatter";

type FeaturedPostType = {
  title: string;
  body: string;
  createdAt: Date;
  updatedAt?: Date;
  imgUrl: string;
};

const FeaturedPost = ({
  title,
  body,
  createdAt,
  updatedAt,
  imgUrl,
}: FeaturedPostType) => {
  return (
    <Link href={`posts/featured`} passHref>
      <article className="bg w-full flex flex-col gap-8 sm:flex-row rounded-lg hover-outline">
        <div className="sm:flex-1 pt-8 sm:pt-10 px-10 sm:rounded-l-lg">
          <h1 className="text-2xl cursor-pointer">{title}</h1>
          <h4 className="text-white/50 text-xs mb-3">
            {dateFormatter.format(createdAt)}
          </h4>
          <p className="line-clamp-3 text-white/70 text-sm">{body}</p>
        </div>
        <div className="sm:flex-1 sm:rounded-r-lg px-10 max-w-sm sm:max-w-none mx-auto sm:grid sm:place-content-center sm:py-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imgUrl}
            alt="Post image"
            className="h-auto pb-10 sm:p-0 rounded"
          />
        </div>
      </article>
    </Link>
  );
};

export default FeaturedPost;
