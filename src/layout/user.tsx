import { Outlet } from "@tanstack/react-router";
import AdminSidebar from "../components/molecules/adminSiderbar";

export default function UserLayout() {
  return (
    <div className="flex h-full w-full bg-gradient-50 gap-x-3 overflow-hidden">
      <AdminSidebar />
      <div className="flex-1  p-6 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}
