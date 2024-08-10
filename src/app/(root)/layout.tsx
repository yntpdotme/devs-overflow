import LeftSidebar from "@/components/navigation/LeftSidebar";
import Navbar from "@/components/navigation/navbar";
import {ReactNode} from "react";

const RootLayout = ({children}: {children: ReactNode}) => {
  return (
    <>
      <header>
        <Navbar />
      </header>

      <div className="flex h-dvh pt-16">
        <aside>
          <LeftSidebar />
        </aside>
        <main className="no-scrollbar flex-1 overflow-y-auto">{children}</main>
      </div>
    </>
  );
};

export default RootLayout;
