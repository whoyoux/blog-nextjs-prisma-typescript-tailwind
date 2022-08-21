import Link from "next/link";

import { useSession, signIn, signOut } from "next-auth/react";

const Header = () => {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  return (
    <header className="w-full flex flex-row justify-between items-center mt-10 mb-20">
      <h1 className="text-3xl hover:underline">
        <Link href="/">Blog</Link>
      </h1>
      {session && <Link href="/editor">editor</Link>}
      <div className="text-xl cursor-pointer hover:underline">
        {/* <Link href="/about">about</Link> */}

        {!session ? (
          <h1 onClick={() => signIn("google")}>about</h1>
        ) : (
          <h1 onClick={() => signOut()}>{session?.user?.name}</h1>
        )}
      </div>
    </header>
  );
};

export default Header;
