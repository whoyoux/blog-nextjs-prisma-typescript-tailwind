import type { NextApiRequest, NextApiResponse } from "next";

import prisma from "../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.query.secret !== process.env.REVALIDATION_TOKEN) {
    return res.status(401).json({ message: "Invalid token" });
  }

  try {
    const posts = await prisma.post.findMany({
      select: {
        id: true,
      },
    });

    console.log(posts);

    const revalidatePaths = posts.map((post) => {
      res.revalidate(`/post/${post.id}`);
    });

    console.log(revalidatePaths);

    await Promise.all(revalidatePaths);

    return res.json({ revalidated: true });
  } catch (err) {
    return res.status(500).send("Error revalidating");
  }
}
