import { Link, useLocation } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser";
import { Bell, BrainCircuit, LogOut, Menu } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import useLogout from "../hooks/useLogout";
import { useState } from "react";
import Sidebar from "./Sidebar";

const Navbar = ({ showSidebar }) => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");
  const { logoutMutation } = useLogout();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      {/* Navbar */}
      <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-20 h-16 flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between w-full">
            {/* Sidebar toggle button - mobile only */}
            {showSidebar && (
              <button
                className="btn btn-ghost btn-circle lg:hidden"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu className="h-6 w-6 text-base-content opacity-70" />
              </button>
            )}

            {/* Logo - only on chat page */}
            {isChatPage && (
              <div className="pl-5">
                <Link to="/" className="flex items-center gap-2.5">
                  <BrainCircuit className="size-9 text-primary" />
                  <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                    MockMates
                  </span>
                </Link>
              </div>
            )}

            <div className="flex items-center gap-3 sm:gap-4 ml-auto">
              <Link to="/notifications">
                <button className="btn btn-ghost btn-circle">
                  <Bell className="h-6 w-6 text-base-content opacity-70" />
                </button>
              </Link>

              <ThemeSelector />

              <div className="avatar">
                <div className="w-9 rounded-full">
                  <img src={authUser?.profilePic} alt="User Avatar" />
                </div>
              </div>

              <button
                className="btn btn-ghost btn-circle"
                onClick={logoutMutation}
              >
                <LogOut className="h-6 w-6 text-base-content opacity-70" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Desktop sidebar (on top of navbar) */}
      {showSidebar && (
        <div className="hidden lg:block w-64 fixed left-0 top-0 h-screen bg-base-200 border-r border-base-300 z-30">
          <Sidebar />
        </div>
      )}

      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          {/* Sidebar itself */}
          <div className="w-64 bg-base-200 border-r border-base-300 h-full">
            <Sidebar />
          </div>

          {/* Overlay background */}
          <div
            className="flex-1 bg-black bg-opacity-50"
            onClick={() => setIsSidebarOpen(false)}
          />
        </div>
      )}
    </>
  );
};

export default Navbar;
