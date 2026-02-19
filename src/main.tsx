import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/assets/styles/index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "@/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { hydrateAuth } from "@/services/authPersistence";
import { Toaster } from "sonner";

const qc = new QueryClient();

hydrateAuth();

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<Provider store={store}>
			<QueryClientProvider client={qc}>
				<App />
				<Toaster richColors expand position="top-right" closeButton />
			</QueryClientProvider>
		</Provider>
	</StrictMode>
);
