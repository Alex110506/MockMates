import React from "react";
import Navbar from "./Navbar";

const Layout = ({ children, showSidebar }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar showSidebar={showSidebar} />
      <div className={`flex flex-1`}>
        {/* On desktop, add left margin for sidebar */}
        <main
          className={`flex-1 overflow-y-auto transition-all duration-200 ${
            showSidebar ? "lg:ml-64" : ""
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
