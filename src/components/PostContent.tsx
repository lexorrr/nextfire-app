import { Post } from "@/lib/types/Post";
import Link from "next/link";
import React from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";

const PostContent = ({ post }: { post: Post }) => {
  const createdAt =
    typeof post?.createdAt === "number"
      ? new Date(post.createdAt)
      : new Date(post.createdAt * 1000);

  return (
    <div className="card">
      <h1>{post.title}</h1>
      <span>
        Written by{" "}
        <Link href={`/${post.username}/`}>
          <span className="text-info">@{post.username}</span>
        </Link>{" "}
        on {createdAt.toISOString()}
      </span>

      <ReactMarkdown>{post.content}</ReactMarkdown>
    </div>
  );
};

export default PostContent;
