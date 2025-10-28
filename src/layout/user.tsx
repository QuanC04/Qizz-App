import { Outlet } from "@tanstack/react-router";
import UserSiderbar from "../components/molecules/userSiderbar";

export default function UserLayout() {
  return (
    <div className="flex h-full w-full bg-gradient-50 gap-x-3 overflow-hidden">
      <UserSiderbar />
      <div className="flex-1  p-6 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}
