import type { NextApiRequest, NextApiResponse } from "next";

import prisma from "../../../lib/prisma";

import { authOptions } from "../auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import { Role } from "@prisma/client";

import rateLimit from "../../../lib/rateLimit";

const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 100, // Max 100 users per second
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await limiter.check(res, 10, "CACHE_TOKEN"); // 10 requests per minute

    const session = await unstable_getServerSession(req, res, authOptions);

    if (
      !session ||
      !session.user ||
      !session.user.email ||
      typeof session.user.email !== "string"
    ) {
      res.status(401).json({ message: "You must be logged in." });
      return;
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user?.email,
      },
      select: {
        email: true,
        role: true,
      },
    });

    if (!user || !user.email || user.role !== Role.ADMIN) {
      res.status(401).json({ message: "You don't have enough privileges." });
      return;
    }

    const posts = await prisma.post.findMany({
      select: {
        id: true,
      },
    });

    const revalidatePaths = posts.map((post) => {
      res.revalidate(`/posts/${post.id}`);
    });

    await Promise.all(revalidatePaths);

    return res.json({ revalidated: true });
  } catch (err) {
    return res.status(500).send("Error revalidating");
  }
}
