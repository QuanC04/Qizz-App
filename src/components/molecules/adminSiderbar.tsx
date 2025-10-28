import React, { useEffect, useState } from "react";
import { Home, LogOut, Plus, User } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useForm } from "../../stores/userForm";
import { useAuth } from "../../stores/useAuth";

export default function AdminSidebar() {
  const { user, handleLogout, initAuth } = useAuth();
  const { resetForm } = useForm();
  const [activeMenu, setActiveMenu] = useState("");

  useEffect(() => initAuth(), []);

  const menuItems = [
    { id: "dashboard", icon: Home, label: "Dashboard", path: "/admin/" },
    { id: "create", icon: Plus, label: "Tạo Form", path: "/admin/create-form" },
  ];

  return (
    <div className="  h-full bg-white border-gray-200 transition-all duration-300 shadow-lg w-64 relative">
      {/* <div className="flex items-center justify-between p-6 border-b border-purple-700">
        <div>
          <div className="h-15 w-15 rounded-lg flex items-center justify-center ">
            <img
              src="\Quizizz-Basic-app-icon.svg"
              alt="logo"
              className="h-30 w-30 scale-150"
            />
          </div>
        </div>
      </div> */}

      <nav className="mt-6 px-3">
        <ul>
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                to={item.path}
                key={item.id}
                onClick={() => {
                  setActiveMenu(item.path), resetForm();
                }}
                className={`w-full flex items-center gap-4 px-4 py-3 mb-2 rounded-lg transition-all duration-200 ${
                  activeMenu === item.path
                    ? "bg-white text-black shadow-lg transform scale-105"
                    : "text-black hover:shadow-2xl "
                }`}>
                <Icon className="h-5 w-5" />

                <span className="flex-1 text-left font-medium">
                  {item.label}
                </span>
              </Link>
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
                <p className="text-xs">{user.role}</p>
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
