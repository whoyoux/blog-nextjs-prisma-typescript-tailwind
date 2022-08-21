import Link from "next/link";

const Header = () => {
  return (
    <header className="w-full flex flex-row justify-between items-center mt-10 mb-20">
      <h1 className="text-3xl hover:underline">
        <Link href="/">Blog</Link>
      </h1>
      <h1 className="text-xl hover:underline">
        <Link href="/about">about</Link>
      </h1>
    </header>
  );
};

export default Header;
