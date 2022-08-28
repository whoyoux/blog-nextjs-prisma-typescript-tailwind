/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
import { useState } from "react";
import Switch from "../components/ToggleSwitch";
import makeRequest from "../lib/makeRequest";

type CreatePostType = {
  goBack: () => {};
};

const CreatePost = ({ goBack }: CreatePostType) => {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const addImageToDB = async (imgUrl: string) => {
    const uploadedImg = await makeRequest({
      url: `/api/posts/addImage`,
      method: "POST",
      body: {
        imageUrl: imgUrl,
      },
      loadingText: "Uploading image...",
      errorText: "Error!",
      successText: "Uploaded!",
    });
    return uploadedImg;
  };

  const addPost = async () => {
    makeRequest({
      url: "/api/posts/create",
      method: "POST",
      body: {
        title,
        content,
        imageUrl,
      },
      loadingText: "Creating...",
      successText: "Created!",
      errorText: "Error!",
      fnAfterSuccess: router.reload,
    });
  };

  return (
    <div>
      <button onClick={() => goBack()}>&larr; Back to list</button>
      <div className="mt-10 pt-5 flex flex-col gap-5">
        <div>
          <label htmlFor="postTitle">Title</label>
          <input
            type="text"
            name="postTitle"
            id="postTitle"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-text"
            placeholder="You'r title here..."
          />
        </div>
        <div>
          <label htmlFor="postContent">Content</label>
          <textarea
            rows={10}
            name="postContent"
            id="postContent"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="input-text"
            placeholder="You'r content here..."
          />
        </div>

        <div>
          <label htmlFor="imgUrl">Image url</label>
          <input
            type="text"
            name="imgUrl"
            id="imgUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="input-text"
            placeholder="Image url here..."
          />
        </div>

        <div className="flex gap-2 justify-end">
          <button
            className="btn bg-green-600 hover:bg-green-700 transition-all"
            onClick={addPost}
          >
            Post 🚀🚀🚀
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
