declare global {
  var prisma: PrismaClient;
}

type PostType = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  images: [
    {
      id: string;
      url: string;
    }
  ];
};

export { PostType };
