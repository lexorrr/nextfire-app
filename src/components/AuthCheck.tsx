import { UserContext } from "@/lib/context";
import { auth } from "@/lib/firebase";
import Link from "next/link";
import React, { useContext, useEffect } from "react";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const AuthCheck = (props: Props) => {
  const { username } = useContext(UserContext);

  return (
    <>
      {username
        ? props.children
        : props.fallback || <Link href="/enter">You must be signed in</Link>}
    </>
  );
};

export default AuthCheck;
