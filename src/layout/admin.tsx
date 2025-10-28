import { Outlet } from "@tanstack/react-router";
import AdminSiderbar from "../components/molecules/adminSiderbar";

export default function AdminLayout() {
  return (
    <div className="flex h-full w-full bg-gradient-50 gap-x-3 overflow-hidden">
      <AdminSiderbar />
      <div className="flex-1  p-6 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}
