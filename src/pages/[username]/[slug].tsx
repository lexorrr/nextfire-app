import { firestore, getUserWithUsername, postToJSON } from "@/lib/firebase";
import { Post } from "@/lib/types/Post";
import { GetStaticPaths, GetStaticProps } from "next";
import { ParsedUrlQuery } from "querystring";
import React, { useEffect } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import styles from "@/styles/Post.module.css";
import PostContent from "@/components/PostContent";
import AuthCheck from "@/components/AuthCheck";
import HeartButton from "@/components/HeartButton";
import Link from "next/link";

interface IParams extends ParsedUrlQuery {
  username: string;
  slug: string;
}

type Props = {
  post: Post;
  path: string;
};

const PostPage = (props: Props) => {
  const postRef = firestore.doc(props.path);
  const [realtimePost] = useDocumentData(postRef) as [Post, boolean, any];

  const post = realtimePost || props.post;

  useEffect(() => {
    console.log("realtimePost", realtimePost);
  }, [realtimePost]);

  return (
    <main className={styles.container}>
      <section>
        <PostContent post={post} />
      </section>

      <aside>
        <p>
          <strong>{post.heartCount || 0} 🤍</strong>
        </p>
        <AuthCheck
          fallback={
            <Link href="/enter">
              <button>💗 Sign Up</button>
            </Link>
          }
        >
          <HeartButton postRef={postRef} />
        </AuthCheck>
      </aside>
    </main>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { username, slug } = context.params as IParams;

  console.log("username", username);
  console.log("slug", slug);

  const userDoc = await getUserWithUsername(username);

  let post;
  let path;

  if (userDoc) {
    const postRef = userDoc.ref.collection("posts").doc(slug);
    post = postToJSON(await postRef.get());

    path = postRef.path;
  }

  return {
    props: {
      post,
      path,
    },
    revalidate: 100,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  // Improve by using Admin SDK to select empty docs
  const snapshot = await firestore.collectionGroup("posts").get();

  const paths = snapshot.docs.map((doc) => {
    const { slug, username } = doc.data();
    return {
      params: { username, slug },
    };
  });

  return {
    // must be in this format:
    // paths: [
    //  { params: { username, slug } }
    // ],
    paths,
    fallback: "blocking",
  };
};

export default PostPage;
