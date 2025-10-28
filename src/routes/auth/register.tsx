import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../__root";
import RegisterForm from "../../pages/auth/register";

export const registerRouter = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: () => <RegisterForm />,
});
