import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header
      className="bg-base-100/80 border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg shadow-sm transition-all"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-90 transition-all group">
              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-105 group-hover:bg-primary/20 transition-all shadow-inner">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Chatty
                </h1>
                <p className="text-[10px] text-base-content/50 -mt-1 font-medium hidden sm:block">
                  Real-time Messaging
                </p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={"/settings"}
              className="btn btn-sm btn-ghost gap-2 transition-colors rounded-lg hover:bg-base-200"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline text-xs font-medium">Themes</span>
            </Link>

            {authUser && (
              <>
                <Link
                  to={"/profile"}
                  className="btn btn-sm btn-ghost gap-2 rounded-lg hover:bg-base-200"
                >
                  {authUser.profilePic ? (
                    <img
                      src={authUser.profilePic}
                      alt={authUser.fullName}
                      className="size-5 rounded-full object-cover border border-primary/30"
                    />
                  ) : (
                    <User className="size-4 text-primary" />
                  )}
                  <span className="hidden sm:inline text-xs font-medium">{authUser.fullName?.split(" ")[0] || "Profile"}</span>
                </Link>

                <button
                  className="btn btn-sm btn-outline btn-error gap-2 rounded-lg text-xs"
                  onClick={logout}
                >
                  <LogOut className="size-4" />
                  <span className="hidden sm:inline font-medium">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
