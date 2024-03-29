import AuthCheck from "@/components/AuthCheck";
import PostFeed from "@/components/PostFeed";
import { UserContext } from "@/lib/context";
import { auth, firestore, serverTimestamp } from "@/lib/firebase";
import Head from "next/head";
import { useRouter } from "next/router";
import { FormEvent, useContext, useState } from "react";
import {
  useCollection,
  useCollectionData,
} from "react-firebase-hooks/firestore";
import kebabCase from "lodash.kebabcase";
import toast from "react-hot-toast";

const AdminPostsPage = () => {
  return (
    <main>
      <AuthCheck>
        <PostList />
        <CreateNewPost />
      </AuthCheck>
    </main>
  );
};

function PostList() {
  const ref = firestore
    .collection("users")
    .doc(auth.currentUser?.uid)
    .collection("posts");
  const query = ref.orderBy("createdAt");
  const [querySnapshot] = useCollection(query);

  const posts = querySnapshot?.docs.map((doc: any) => doc.data());

  return (
    <>
      <h1>Manage your Posts</h1>
      <PostFeed posts={posts} admin />
    </>
  );
}

function CreateNewPost() {
  const router = useRouter();
  const { username } = useContext(UserContext);
  const [title, setTitle] = useState("");

  // Ensure slug is URL safe
  const slug = encodeURI(kebabCase(title));

  // Validate length
  const isValid = title.length > 3 && title.length < 100;

  const createPost = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const uid = auth.currentUser?.uid;
    const ref = firestore.collection("users").doc(uid).collection("posts").doc(slug);
  
    // Tip: give all fields a default value here
    const data = {
      title,
      slug,
      uid,
      username,
      published: false,
      content: "# hello world!",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCount: 0,
    }

    await ref.set(data);
    toast.success("Post created!");

    // Imperative navigation after doc is set
    router.push(`/admin/${slug}`);

  }

  return (
    <form onSubmit={createPost}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="My Awesome Article!"
      />
      <p>
        <strong>Slug:</strong> {slug}
      </p>
      <button type="submit" disabled={!isValid} className="btn-green">
        Create New Post
      </button>
    </form>
  );
}

export default AdminPostsPage;
