import { FC } from "react";
import Sidebar from "@/components/ui/sidebar";
import { LayoutProps } from "@/types";

const ChatLayout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-[100vh]">
      <div className="sticky h-screen top-0 z-[99999999999999999999]">
        <Sidebar defaultCollapse={true} />
      </div>
      <div className="flex-1 h-full">{children}</div>
    </div>
  );
};

export default ChatLayout;
