import { Outlet } from "@tanstack/react-router";

export default function UserLayout() {
  return (
    <div className="flex  h-full w-full bg-gradient-50 gap-x-3 overflow-visible">
      <div className="flex-1  p-6 pt-0 overflow-auto ">
        <Outlet />
      </div>
    </div>
  );
}
