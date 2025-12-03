import { useEffect, useState } from "react";
import { Home, LogOut, Plus, User } from "lucide-react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useForm } from "../../stores/useForm";
import { useAuth } from "../../stores/useAuth";

export default function AdminSidebar() {
  const router = useRouterState();
  const currentPath = router.location.pathname;
  const { user, handleLogout, initAuth } = useAuth();
  const { resetForm, formId } = useForm();
  const [activeMenu, setActiveMenu] = useState("");
  const navigate = useNavigate();

  useEffect(() => initAuth(), []);

  const menuItems = [
    { id: "dashboard", icon: Home, label: "Dashboard", path: "/form" },
    {
      id: "create",
      icon: Plus,
      label: "Tạo Form",
      path: `/form/create-form/${formId}`,
    },
  ];

  const handleNavigation = (item: (typeof menuItems)[0]) => {
    if (item.id === "create") {
      const newId = resetForm();
      navigate({ to: `/form/create-form/${newId}` });
      setActiveMenu(`/form/create-form/${newId}`);
    } else {
      navigate({ to: item.path });
      setActiveMenu(item.path);
    }
  };

  return (
    <div className="  h-full bg-white border-gray-200 transition-all duration-300 shadow-lg w-64 relative">
      <nav className="mt-6 px-3">
        <ul>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;

            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item)}
                className={`w-full flex items-center gap-4 px-4 py-3 mb-2 rounded-lg transition-all duration-200 cursor-pointer ${
                  activeMenu === item.path || isActive
                    ? "bg-white text-black shadow-lg transform scale-105"
                    : "text-black hover:shadow-2xl "
                }`}>
                <Icon className="h-5 w-5" />

                <span className="flex-1 text-left font-medium">
                  {item.label}
                </span>
              </button>
            );
          })}
        </ul>
      </nav>

      {/* User info & Logout */}
      {user && (
        <div className="absolute bottom-5 left-0 right-0 text-black px-4">
          <div className="rounded-lg flex flex-col gap-2  pt-2">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 flex items-center justify-center">
                <User />
              </div>
              <div className="flex-col">
                <p className="font-semibold text-sm">{user.email}</p>
              </div>
            </div>
            <Link to="/login">
              <button
                onClick={() => handleLogout()}
                className="flex items-center gap-2 text-red-500 hover:text-red-600 mt-2 font-medium cursor-pointer ml-2">
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
