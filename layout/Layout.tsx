import Header from "../components/Header";

const Layout = ({ children }: { children: JSX.Element }) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};

export default Layout;
