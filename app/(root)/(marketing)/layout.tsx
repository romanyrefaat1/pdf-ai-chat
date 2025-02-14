import Navbar from "./_components/navbar";

const Layout = ({ children }) => {
  return (
    <div className="h-full">
      <Navbar />
      <div className="px-5 md:px-3">{children}</div>
    </div>
  );
};

export default Layout;