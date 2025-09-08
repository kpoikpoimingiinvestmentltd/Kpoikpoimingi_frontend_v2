import { createBrowserRouter, Navigate } from "react-router";
import { _router } from "./_router";
import AdminDashboardLayout from "../layouts/AdminDashboardLayout";
import AdminAuthLayout from "../layouts/AdminAuthLayout";
import AdminLogin from "../auth/AdminLogin";
import AuthPageNotFound from "../error/AuthPageNotFound";
import Dashboard from "../dashboard/pages/Dashboard/Dashboard";
import Customers from "../dashboard/pages/Customers/Customers";
import CustomerDetails from "../dashboard/pages/Customers/CustomerDetails";

export const appRouter = createBrowserRouter([
	{
		element: <AdminAuthLayout />,
		children: [
			{
				index: true,
				element: <Navigate to={_router.auth.login} />,
			},
			{
				path: _router.auth.login,
				element: <AdminLogin />,
			},
			{
				path: "*",
				element: <AuthPageNotFound />,
			},
		],
	},
	{
		path: _router.dashboard.index,
		element: <AdminDashboardLayout />,
		children: [
			{
				index: true,
				element: <Dashboard />,
			},
			{
				path: _router.dashboard.customers,
				element: <Customers />,
			},
			{
				path: _router.dashboard.customerDetails,
				element: <CustomerDetails />,
			},
			{
				path: "*",
				element: <div>Dashboard Not Found</div>,
			},
			// {
			//   path: _router.dashboard.,
			//   element: <Overview />
			// },
			// {
			//   path: _router.dashboard.settings,
			//   element: <Settings />
			// }
		],
	},
]);
