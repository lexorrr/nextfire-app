import PostFeed from "@/components/PostFeed";
import UserProfile from "@/components/UserProfile";
import { getUserWithUsername, postToJSON } from "@/lib/firebase";
import { Post } from "@/lib/types/Post";
import { User } from "@/lib/types/User";
import { GetServerSideProps } from "next";
import React from "react";

const UserProfilePage = ({ user, posts }: { user: User; posts: Post[] }) => {
  return (
    <main>
      <UserProfile user={user} />
      <PostFeed posts={posts} admin={true} />
    </main>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { username } = query;

  const userDoc = await getUserWithUsername(username as string);

  if (!userDoc) {
    return {
      notFound: true,
    };
  }

  // JSON serializable data
  let user = null;
  let posts = null;

  if (userDoc) {
    user = userDoc.data();
    const postsQuery = userDoc.ref
      .collection("posts")
      .where("published", "==", true)
      .orderBy("createdAt", "desc")
      .limit(5);

    posts = (await postsQuery.get()).docs.map(postToJSON);
  }

  return {
    props: {
      user,
      posts,
    },
  };
};

export default UserProfilePage;
