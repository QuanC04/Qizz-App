import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./__root";
import AdminLayout from "../layout/admin";
import AdminDashboard from "../pages/admin/adminDashboard";
import AddForm from "../pages/admin/addForm";
import EditForm from "../pages/admin/editForm";
import FormDetail from "../pages/admin/responForm";

const _adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/form",
  component: () => <AdminLayout />,
});
export const adminRoute = _adminRoute.addChildren([
  createRoute({
    getParentRoute: () => _adminRoute,
    path: "/",
    component: () => <AdminDashboard />,
  }),
  createRoute({
    getParentRoute: () => _adminRoute,
    path: "/create-form",
    component: () => <AddForm />,
  }),
  createRoute({
    getParentRoute: () => _adminRoute,
    path: "/edit/$formId",
    component: () => <EditForm />,
  }),
  createRoute({
    getParentRoute: () => _adminRoute,
    path: "/form/$formId",
    component: () => <FormDetail />,
  }),
]);
