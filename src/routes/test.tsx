import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./__root";
import TestLayout from "../layout/test";

export const testRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/test",
  component: () => <TestLayout />,
});
