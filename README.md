# Blog app

Blog is created using:

- NextJS
- TailwindCSS
- Prisma
- TypeScipt

# Roles

**User**

- can see posts

**Moderator** and **Writer**

- can see posts
- have access to **/editor**
- can write posts

**Admin**

- can do everything what **Moderator** and **Writer**
- can accept posts
- can delete posts
- can revalidate **/posts/\*** paths

## Endpoints

All endpoints is **secured** and **rate limited**.

- **/auth/\*** - handling **NextAuth**
- **/posts/**:
  - **/accept** - only **Admin** has access. Is used to accept posts.
  - **/create**- is used to create posts
  - **/delete** - only **Admin** has access. Is used to delete posts.
  - **/revalidate** - only **Admin** has access. Is revalidating all **/posts/\*** path.
  - **/update** - is used to update posts.

## Auth

Blog is using NextAuth for authentification with Google Provider

## Schema

Default schema for **NextAuth**.

**Role**

- USER
- WRITER
- MODERATOR
- ADMIN

**User** (custom field)

- posts: Post[]
- role: Role
- acceptedPosts: Post[]

**Post**

- id: CUID
- title: string
- content: string
- createdAt: DateTime
- updatedAt: DateTime
- published: boolean
- accepted: boolean
- acceptedBy: User
- author: User
- imageUrl: string

## ENV

- **DATABASE_URL**
- **GOOGLE_CLIENT_ID**
- **GOOGLE_CLIENT_SECRET**
- **NEXTAUTH_SECRET**
- **NEXTAUTH_URL**
