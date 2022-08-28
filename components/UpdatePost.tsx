import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Switch from "../components/ToggleSwitch";
import makeRequest from "../lib/makeRequest";
import { PostType } from "../types";

type UpdatePostType = {
  post: PostType;
  goBack: () => {};
};

const UpdatePost = ({ post, goBack }: UpdatePostType) => {
  const router = useRouter();

  const [publishedSwitchValue, setPublishedSwitchValue] =
    useState<boolean>(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleAcceptPost = async () => {
    if (confirm("Are you sure? Edited data will be lost")) {
      await makeRequest({
        url: `/api/posts/accept`,
        method: "PUT",
        loadingText: "Accepting...",
        errorText: "Couldn't accept!",
        successText: "Accepted!",
        body: {
          id: post.id,
        },
        fnAfterSuccess: router.reload,
      });
    }
  };

  const handleSubmitEditPost = async () => {
    await makeRequest({
      url: `/api/posts/update`,
      method: "PUT",
      body: {
        id: post.id,
        title,
        content,
        published: publishedSwitchValue,
      },
      loadingText: "Editing...",
      errorText: "Error!",
      successText: "Updated!",
      fnAfterSuccess: router.reload,
    });
  };

  useEffect(() => {
    setTitle(post.title);
    setContent(post.content);
    setPublishedSwitchValue(post.published);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
          />
        </div>
        <div>
          <Switch
            enabled={publishedSwitchValue}
            onClick={() => {
              setPublishedSwitchValue((prev) => !prev);
            }}
            withText
            textLabel="Published"
          />
        </div>
        <div className="flex gap-2 justify-end">
          {!post?.accepted && (
            <button
              className="btn bg-indigo-600 hover:bg-indigo-700 transition-all"
              onClick={handleAcceptPost}
            >
              Accept
            </button>
          )}
          <button
            className="btn bg-green-600 hover:bg-green-700 transition-all"
            onClick={handleSubmitEditPost}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdatePost;
