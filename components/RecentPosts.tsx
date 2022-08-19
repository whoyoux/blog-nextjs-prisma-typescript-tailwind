import { createArray } from "dummy-array";
import Link from "next/link";

const RecentPosts = () => {
  return (
    <div className="flex sm:flex-row flex-col sm:flex-wrap sm:justify-between w-full mt-20 gap-8 sm:gap-4">
      {createArray({ to: 6 }).map((index: number) => {
        return (
          <Link href={`posts/${index}`} key={index} passHref>
            <div className="w-full sm:w-[calc(50%-1rem)] bg p-10 rounded-lg hover-outline">
              Siema {index} &rarr;
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default RecentPosts;
