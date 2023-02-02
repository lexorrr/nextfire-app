import AuthCheck from "@/components/AuthCheck";
import Metatags from "@/components/Metatags";
import { auth, firestore, serverTimestamp } from "@/lib/firebase";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";

import styles from "@/styles/Admin.module.css";
import { Post } from "@/lib/types/Post";
import { useForm } from "react-hook-form";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { toast } from "react-hot-toast";
import Link from "next/link";
import ImageUploader from "@/components/ImageUploader";

const AdminPostEdit = () => {
  return (
    <AuthCheck>
      <PostManager />
    </AuthCheck>
  );
};

function PostManager() {
  const [preview, setPreview] = useState(false);

  const router = useRouter();
  const { slug } = router.query;

  const postRef = firestore
    .collection("users")
    .doc(auth.currentUser?.uid)
    .collection("posts")
    .doc(slug as string);
  const [post] = useDocumentData(postRef).map((doc: any) => doc as Post);

  return (
    <main className={styles.container}>
      {post ? (
        <>
          <section>
            <h1>{post.title}</h1>
            <p>ID: {post.slug}</p>

            <PostForm
              postRef={postRef}
              defaultValues={post}
              preview={preview}
            />
          </section>

          <aside>
            <h3>Tools</h3>
            <button onClick={() => setPreview(!preview)}>
              {preview ? "Edit" : "Preview"}
            </button>
            <Link href={`/${post.username}/${post.slug}`}>
              <button className="btn-blue">Live view</button>
            </Link>
          </aside>
        </>
      ) : null}
    </main>
  );
}

function PostForm({
  defaultValues,
  postRef,
  preview,
}: {
  defaultValues: Post;
  postRef: any;
  preview: boolean;
}) {
  const { register, handleSubmit, reset, watch, formState } = useForm({
    defaultValues,
    mode: "onChange",
  });

  const { isValid, isDirty, errors } = formState;

  const updatePost = async ({
    content,
    published,
  }: {
    content: string;
    published: boolean;
  }) => {
    await postRef.update({
      content,
      published,
      updatedAt: serverTimestamp(),
    });

    reset({ content, published });

    toast.success("Post updated successfully!");
  };

  useEffect(() => {
    console.log("errors", errors);

  }, [errors]);

  return (
    <form onSubmit={handleSubmit(updatePost)}>
      {preview && (
        <div className="card">
          <ReactMarkdown>{watch("content")}</ReactMarkdown>
        </div>
      )}

      <div className={preview ? styles.hidden : styles.controls}>
        <ImageUploader />

        <textarea
          {...register("content", {
            maxLength: { value: 20000, message: "content is too long" },
            minLength: { value: 10, message: "content is too short" },
            required: { value: true, message: "content is required" },
          })}
        ></textarea>
        {errors && (
          <p className="text-danger">{errors.content?.message}</p>
        )}

        <fieldset>
          <input
            className={styles.checkbox}
            type="checkbox"
            {...register("published")}
          />
          <label>Published</label>
        </fieldset>

        <button
          type="submit"
          className="btn-green"
          disabled={!isDirty || !isValid}
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}

export default AdminPostEdit;
