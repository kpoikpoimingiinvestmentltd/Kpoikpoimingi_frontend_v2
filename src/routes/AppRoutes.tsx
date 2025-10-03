import { createBrowserRouter, Navigate } from "react-router";
import { _router } from "./_router";
import AdminDashboardLayout from "../layouts/AdminDashboardLayout";
import AdminAuthLayout from "../layouts/AdminAuthLayout";
import AdminLogin from "../auth/AdminLogin";
import AuthPageNotFound from "../error/AuthPageNotFound";
import Dashboard from "../dashboard/pages/Dashboard/Dashboard";
import Customers from "../dashboard/pages/Customers/Customers";
import CustomerDetails from "../dashboard/pages/Customers/CustomerDetails";
import DashboardPageNotFound from "../error/DashboardPageNotFound";
import Contract from "../dashboard/pages/Contract/Contract";
import NotificationsPage from "../dashboard/pages/Notifications/NotificationsPage";
import ManageCategories from "../dashboard/pages/Properties/ManageCategories";
import AddProperties from "../dashboard/pages/Properties/AddProperties";
import AuditCompliance from "../dashboard/pages/AuditCompliance/AuditCompliance";
import Payments from "../dashboard/pages/Payment/Payments";
import Receipt from "../dashboard/pages/Receipt/Receipt";
import Users from "../dashboard/pages/Users/Users";
import ReceiptDetails from "../dashboard/pages/Receipt/ReceiptDetails";
import AddNewUser from "../dashboard/pages/Users/AddNewUser";
import Setting from "../dashboard/pages/Settings/Setting";
import CustomerReceipt from "../dashboard/pages/Customers/CustomerReceipt";

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
				path: _router.dashboard.notifications,
				element: <NotificationsPage />,
			},
			{
				path: _router.dashboard.customers,
				element: <Customers />,
			},
			{
				path: _router.dashboard.customerDetailsReceipt,
				element: <CustomerReceipt />,
			},
			{
				path: _router.dashboard.contract,
				element: <Contract />,
			},
			{
				path: _router.dashboard.customerDetails,
				element: <CustomerDetails />,
			},
			{
				path: _router.dashboard.properties,
				element: <CustomerDetails />,
			},
			{
				path: _router.dashboard.addProperties,
				element: <AddProperties />,
			},
			{
				path: _router.dashboard.manageCategories,
				element: <ManageCategories />,
			},
			{
				path: _router.dashboard.payment,
				element: <Payments />,
			},
			{
				path: _router.dashboard.users,
				element: <Users />,
			},
			{
				path: _router.dashboard.addUser,
				element: <AddNewUser />,
			},
			{
				path: _router.dashboard.receipt,
				element: <Receipt />,
			},
			{
				path: _router.dashboard.receiptDetails,
				element: <ReceiptDetails />,
			},
			{
				path: _router.dashboard.payment,
				element: <Payments />,
			},
			{
				path: _router.dashboard.auditAndCompliance,
				element: <AuditCompliance />,
			},
			{
				path: _router.dashboard.settings,
				element: <Setting />,
			},
			{
				path: "*",
				element: <DashboardPageNotFound />,
			},
		],
	},
]);
