import { RouterProvider } from "react-router";
import { appRouter } from "./routes/AppRoutes";
import NotificationsProvider from "@/components/common/NotificationsProvider";

function App() {
	return (
		<NotificationsProvider>
			<RouterProvider router={appRouter} />
		</NotificationsProvider>
	);
}

export default App;
