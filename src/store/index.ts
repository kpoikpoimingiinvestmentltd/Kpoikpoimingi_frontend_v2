import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import authReducer from "./authSlice";
import usersReducer from "./usersSlice";
import categoriesReducer from "./categoriesSlice";
import notificationsReducer from "./notificationsSlice";
import reportAnalyticsReducer from "./reportAnalyticsSlice";
import duePaymentReducer from "./duePaymentSlice";
import { presignUploadApi } from "@/api/presign-upload.api";

const rootReducer = combineReducers({
	auth: authReducer,
	users: usersReducer,
	categories: categoriesReducer,
	notifications: notificationsReducer,
	reportAnalytics: reportAnalyticsReducer,
	duePayment: duePaymentReducer,
	[presignUploadApi.reducerPath]: presignUploadApi.reducer,
});

export const store = configureStore({
	reducer: rootReducer,
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(presignUploadApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
