import { createBrowserRouter, Navigate } from "react-router";
import { _router } from "./_router";
import AdminDashboardLayout from "../layouts/AdminDashboardLayout";
import AdminAuthLayout from "../layouts/AdminAuthLayout";
import AdminLogin from "../auth/AdminLogin";
import AuthPageNotFound from "../error/AuthPageNotFound";
import Dashboard from "../dashboard/Dashboard/Dashboard";
import Customers from "../dashboard/Customers/Customers";
import CustomerDetails from "../dashboard/Customers/CustomerDetails";
import CustomerReceipt from "../dashboard/Customers/CustomerReceipt";
import AddCustomer from "../dashboard/Customers/AddCustomer";
import SelectProperties from "../dashboard/Customers/SelectProperties";
import DashboardPageNotFound from "../error/DashboardPageNotFound";
import Contract from "../dashboard/Contract/Contract";
import ProductRequest from "../dashboard/ProductRequest/ProductRequest";
import NotificationsPage from "../dashboard/Notifications/NotificationsPage";
import AddProperties from "../dashboard/Properties/AddProperties";
import AuditCompliance from "../dashboard/AuditCompliance/AuditCompliance";
import Payments from "../dashboard/Payment/Payments";
import PaymentSuccess from "../dashboard/Payment/PaymentSuccess";
import Receipt from "../dashboard/Receipt/Receipt";
import Users from "../dashboard/Users/Users";
import ReceiptDetails from "../dashboard/Receipt/ReceiptDetails";
import AddNewUser from "../dashboard/Users/AddNewUser";
import Setting from "../dashboard/Settings/Setting";
import Properties from "../dashboard/Properties/Properties";
import UserDetails from "../dashboard/Users/UserDetails";
import ReportAnalytics from "../dashboard/ReportAnalytics/ReportAnalytics";
import Debt from "../dashboard/Debt/Debt";
import PropertyDetails from "../dashboard/Properties/PropertyDetails";
import Categories from "../dashboard/Properties/Categories";
import ContractDetails from "../dashboard/Contract/ContractDetails";
import ProductRequestDetails from "../dashboard/ProductRequest/ProductRequestDetails";
import SelectPaymentMethod from "../dashboard/Customers/SelectPaymentMethod";
import DebtDetails from "../dashboard/Debt/DebtDetails";

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
				path: _router.dashboard.selectCustomerPaymentMethod,
				element: <SelectPaymentMethod />,
			},
			{
				path: _router.dashboard.selectProperties,
				element: <SelectProperties />,
			},
			{
				path: _router.dashboard.customerDetails,
				element: <CustomerDetails />,
			},
			{
				path: _router.dashboard.customerAdd,
				element: <AddCustomer />,
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
				path: _router.dashboard.productRequest,
				element: <ProductRequest />,
			},
			{
				path: _router.dashboard.productRequestDetails,
				element: <ProductRequestDetails />,
			},
			{
				path: _router.dashboard.contractDetails,
				element: <ContractDetails />,
			},
			{
				path: _router.dashboard.properties,
				element: <Properties />,
			},
			{
				path: _router.dashboard.propertiesDetailsPath,
				element: <PropertyDetails />,
			},
			{
				path: _router.dashboard.addProperties,
				element: <AddProperties />,
			},
			{
				path: _router.dashboard.categories,
				element: <Categories />,
			},
			{
				path: _router.dashboard.payment,
				element: <Payments />,
			},
			{
				path: _router.dashboard.paymentSuccess,
				element: <PaymentSuccess />,
			},
			{
				path: _router.dashboard.users,
				element: <Users />,
			},
			{
				path: _router.dashboard.userDetailsPath,
				element: <UserDetails />,
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
				path: _router.dashboard.debt,
				element: <Debt />,
			},
			{
				path: _router.dashboard.debtDetails,
				element: <DebtDetails />,
			},
			{
				path: _router.dashboard.reportAnalytics,
				element: <ReportAnalytics />,
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
