import { Outlet, useNavigate } from "react-router-dom";
import { signout } from "../store/slices/authSlice";
import { useState, useRef, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";

function Layout() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [show, setShow] = useState(false);
  const dropdownRef = useRef(null);

  
  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShow(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await dispatch(signout());
    navigate("/login");
  };

  return (
    <>
      {/* Navbar (shared across pages) */}
      <header className="sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1
            onClick={() => navigate("/")}
            className="text-2xl font-bold z-0 cursor-pointer text-gray-200 font-Montserrat relative [text-shadow:inset_2px_2px_16px_rgba(0,0,0,0.6)]"
          >
            <span className="text-blue-500 text-xl font-bold font-StackSansHeadline absolute z-10 top-1/2 -translate-y-1/5 left-1/2 -translate-x-1/2 text-shadow-gray-950 inline-block">
              NOCAP
            </span>{" "}
            ACADEMY
          </h1>

          <div className="flex items-center gap-3">
            <div ref={dropdownRef} className="relative">
              <div
                onClick={() => setShow((prev) => !prev)}
                className="w-11 h-11 rounded-full overflow-hidden border-4 border-blue-400 cursor-pointer"
              >
                {user?.profilePictureUrl ? (
                  <img
                    src={user.profilePictureUrl}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-600">
                    {user?.userName
                      ? user.userName.charAt(0).toUpperCase()
                      : "U"}
                  </div>
                )}
              </div>

              {show && (
                <div className="absolute top-14 left-2 flex flex-col gap-4 font-Montsrat  rounded shadow-lg z-20 p-2 w-40">
                  <button
                    onClick={() => {
                      setShow(false);
                      navigate(user?.role === "instructor" ? "/instructor/dashboard" : "/profile");
                    }}
                    className="block w-full text-left text-sm px-3 py-2 rounded font-semibold text-neutral-600 hover:bg-gray-100"
                  >
                  {user?.role === "instructor" ? "Dashborad" : "Profile"} 
                  </button>
                  <button
                    onClick={handleLogout}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => navigate("/courses")}
              className="bg-slate-800 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-950 transition-colors cursor-pointer"
            >
              getStarted
            </button>
          </div>
        </div>
      </header>

      {/* Outlet renders the page content */}
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default Layout;
