import type { NextApiRequest, NextApiResponse } from "next";

import { z } from "zod";

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
  if (req.method !== "POST")
    return res.status(400).json({ message: "Method not allowed", error: true });

  try {
    const createPostSchema = z.object({
      title: z.string().min(1),
      content: z.string().min(1),
      imageUrl: z.string(),
    });
    console.log(req.body);
    createPostSchema.parse(req.body);

    type PostType = z.infer<typeof createPostSchema>;

    const { title, content, imageUrl }: PostType = req.body;

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
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user || !user.email || user.role === Role.USER) {
      res.status(401).json({ message: "You don't have enough privileges." });
      return;
    }

    await prisma.post.create({
      data: {
        title,
        content,
        imageUrl,
        author: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    return res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Error adding an image");
  }
}
