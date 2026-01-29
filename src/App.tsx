import { RouterProvider } from "react-router";
import { appRouter } from "./routes/AppRoutes";
import NotificationsProvider from "@/components/common/NotificationsProvider";
import { ThemeProvider } from "@/components/common/ThemeProvider";

function App() {
	return (
		<ThemeProvider defaultTheme="system" storageKey="kkm-admin-theme">
			<NotificationsProvider>
				<RouterProvider router={appRouter} />
			</NotificationsProvider>
		</ThemeProvider>
	);
}

export default App;
