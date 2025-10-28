import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./__root";
import UserLayout from "../layout/user";
import UserDashboard from "../pages/user/userDashboard";
import ExamPage from "../pages/user/exam/$formId";

const _userRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/user",
  component: () => <UserLayout />,
});

export const userRoute = _userRoute.addChildren([
  createRoute({
    getParentRoute: () => _userRoute,
    path: "/",
    component: () => <UserDashboard />,
  }),
  createRoute({
    getParentRoute: () => _userRoute,
    path: "/exam/$formId",
    component: () => <ExamPage />,
  }),
]);
