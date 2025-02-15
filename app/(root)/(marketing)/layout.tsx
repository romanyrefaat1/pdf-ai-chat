import { FC } from "react";
import Navbar from "./_components/navbar";
import { LayoutProps } from "@/types";

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className="h-full">
      <Navbar />
      <div className="px-5 md:px-3">{children}</div>
    </div>
  );
};

export default Layout;
