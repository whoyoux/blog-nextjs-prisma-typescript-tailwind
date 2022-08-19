import { createArray } from "dummy-array";

const RecentPosts = () => {
  return (
    <div className="flex sm:flex-row flex-col sm:flex-wrap sm:justify-between w-full mt-20 gap-8 sm:gap-4">
      {createArray({ to: 6 }).map((index: number) => {
        return (
          <div
            className="w-full sm:w-[calc(50%-1rem)] bg p-10 rounded-lg"
            key={index}
          >
            Siema {index} &rarr;
          </div>
        );
      })}
    </div>
  );
};

export default RecentPosts;
