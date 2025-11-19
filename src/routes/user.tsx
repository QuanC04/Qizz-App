import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./__root";
import UserLayout from "../layout/user";
import ExamPage from "../pages/user/exam/$formId";
import AnswerPage from "../pages/user/exam/response";
import AdminDashboard from "../pages/admin/adminDashboard";

const _userRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/exam",
  component: () => <UserLayout />,
});

export const userRoute = _userRoute.addChildren([
  createRoute({
    getParentRoute: () => _userRoute,
    path: "/",
    component: () => <AdminDashboard />,
  }),
  createRoute({
    getParentRoute: () => _userRoute,
    path: "/$formId",
    component: () => <ExamPage />,
  }),
  createRoute({
    getParentRoute: () => _userRoute,
    path: "/response/$formId",
    component: () => <AnswerPage />,
  }),
]);
