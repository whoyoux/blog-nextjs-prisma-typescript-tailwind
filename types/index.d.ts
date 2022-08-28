// import { Post } from "@prisma/client";

declare global {
  var prisma: PrismaClient;
}

export type PostType = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  published: boolean;
  accepted: boolean;
  images: [
    {
      id: string;
      url: string;
    }
  ];
};
