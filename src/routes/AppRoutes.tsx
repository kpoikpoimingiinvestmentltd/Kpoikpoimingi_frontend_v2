import { createBrowserRouter } from "react-router";
import { _router } from "./_router";
import AdminDashboardLayout from "../layouts/AdminDashboardLayout";
import AdminAuthLayout from "../layouts/AdminAuthLayout";
import AdminLogin from "../auth/AdminLogin";
import AdminForgotPassword from "../auth/AdminForgotPassword";
import AuthPageNotFound from "../error/AuthPageNotFound";
import Dashboard from "../dashboard/Dashboard/Dashboard";
import Customers from "../dashboard/Customers/Customers";
import CustomerDetails from "../dashboard/Customers/CustomerDetails";
import CustomerReceipt from "../dashboard/Customers/CustomerReceipt";
import ProtectedRoute from "../components/common/ProtectedRoute";
import AddCustomer from "../dashboard/Customers/AddCustomer";
import SelectProperties from "../dashboard/Customers/SelectProperties";
import DashboardPageNotFound from "../error/DashboardPageNotFound";
import Contract from "../dashboard/Contract/Contract";
import ProductRequest from "../dashboard/ProductRequest/ProductRequest";
import NotificationsPage from "../dashboard/Notifications/NotificationsPage";
import AddProperties from "../dashboard/Properties/AddProperties";
import AuditCompliance from "../dashboard/AuditCompliance/AuditCompliance";
import Payments from "../dashboard/Payment/Payments";
import PaymentSuccess from "../pages/PaymentSuccess";
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
import { ROLE_BASED_ACCESS } from "@/config/roleBasedAccess";

export const appRouter = createBrowserRouter([
	{
		path: _router.auth.index,
		element: (
			<AdminAuthLayout>
				<AdminLogin />
			</AdminAuthLayout>
		),
	},
	{
		path: _router.auth.forgotpassword,
		element: (
			<AdminAuthLayout>
				<AdminForgotPassword />
			</AdminAuthLayout>
		),
	},
	{
		path: _router.paymentSuccess,
		element: <PaymentSuccess />,
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
				element: (
					<ProtectedRoute allowedRoles={ROLE_BASED_ACCESS.notifications}>
						<NotificationsPage />
					</ProtectedRoute>
				),
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
				element: (
					<ProtectedRoute allowedRoles={ROLE_BASED_ACCESS.contract}>
						<Contract />
					</ProtectedRoute>
				),
			},
			{
				path: _router.dashboard.productRequest,
				element: (
					<ProtectedRoute allowedRoles={ROLE_BASED_ACCESS.productRequest}>
						<ProductRequest />
					</ProtectedRoute>
				),
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
				path: _router.dashboard.users,
				element: (
					<ProtectedRoute allowedRoles={ROLE_BASED_ACCESS.users}>
						<Users />
					</ProtectedRoute>
				),
			},
			{
				path: _router.dashboard.userDetailsPath,
				element: (
					<ProtectedRoute allowedRoles={ROLE_BASED_ACCESS.users}>
						<UserDetails />
					</ProtectedRoute>
				),
			},
			{
				path: _router.dashboard.addUser,
				element: (
					<ProtectedRoute allowedRoles={ROLE_BASED_ACCESS.users}>
						<AddNewUser />
					</ProtectedRoute>
				),
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
				element: (
					<ProtectedRoute allowedRoles={ROLE_BASED_ACCESS.reportAnalytics}>
						<ReportAnalytics />
					</ProtectedRoute>
				),
			},
			{
				path: _router.dashboard.auditAndCompliance,
				element: (
					<ProtectedRoute allowedRoles={ROLE_BASED_ACCESS.auditAndCompliance}>
						<AuditCompliance />
					</ProtectedRoute>
				),
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
	{
		path: "*",
		element: <AuthPageNotFound />,
	},
]);
