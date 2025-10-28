import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { rootRoute } from "./routes/__root.tsx";
import { testRoute } from "./routes/test.tsx";
import { loginRoute } from "./routes/auth/login.tsx";
import { registerRouter } from "./routes/auth/register.tsx";
import { adminRoute } from "./routes/admin.tsx";
import { userRoute } from "./routes/user.tsx";

const routeTree = rootRoute.addChildren([
  testRoute,
  loginRoute,
  registerRouter,
  adminRoute,
  userRoute,
]);

const router = createRouter({ routeTree });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
