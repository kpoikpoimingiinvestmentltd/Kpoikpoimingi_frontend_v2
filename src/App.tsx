import { RouterProvider } from "react-router";
import { appRouter } from "./routes/AppRoutes";
import NotificationsProvider from "@/components/common/NotificationsProvider";
import { ThemeProvider } from "@/components/common/ThemeProvider";
import { AuthInitializer } from "@/components/common/AuthInitializer";

function App() {
	return (
		<ThemeProvider defaultTheme="system" storageKey="kkm-admin-theme">
			<NotificationsProvider>
				<AuthInitializer />
				<RouterProvider router={appRouter} />
			</NotificationsProvider>
		</ThemeProvider>
	);
}

export default App;
