import { createBrowserRouter, Navigate } from "react-router";
import HomePage from "./pages/HomePage";
import AddNotePage from "./pages/AddNotePage";
import ViewNotePage from "./pages/ViewNotePage";
import { RegisterPage } from "./pages/RegisterPage";
import { LoginPage } from "./pages/LoginPage";
import ProtectedRoute from "./ProtectedRoute";
import UserProfilePage from "./pages/UserProfilePage";
import { UserPersonalInfo } from "./components/user-management/UserPersonalInfo";
import { UserPasswordChange } from "./components/user-management/UserPasswordChange";
import { UserAddressInfo } from "./components/user-management/UserAddressInfo";
import { UserOverview } from "./components/user-management/UserOverview";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import SetNewPasswordPage from "./pages/SetNewPasswordPage";
import { UserAccountDeletion } from "./components/user-management/UserAccountDeletion";
import { UserNotes } from "./components/user-management/UserNotes";
import Weather from "./components/weather";

const router = createBrowserRouter([
	{
		path: "/",
		element: (
			<ProtectedRoute>
				<HomePage />
			</ProtectedRoute>
		),
	},
	{
		path: "/register",
		element: (
				<RegisterPage />
		),
	},
	{
		path: "/login",
		element: (
				<LoginPage />
		),
	},
	{
		path: "/weather",
		element: (
				<Weather />
		),
	},
	{
		path: "/reset-password",
		element: <ResetPasswordPage />,
	},
	{
		path: "/reset-password/:token",
		element: <SetNewPasswordPage />,
	},
	{
		path: "/profile",
		element: (
			<ProtectedRoute>
				<UserProfilePage />
			</ProtectedRoute>
		),
		children: [
			{
				path: "",
				element: (
					<ProtectedRoute>
						<UserOverview />
					</ProtectedRoute>
				),
			},
			{
				path: "personal-info",
				element: (
					<ProtectedRoute>
						<UserPersonalInfo />
					</ProtectedRoute>
				),
			},
			{
				path: "change-password",
				element: (
					<ProtectedRoute>
						<UserPasswordChange />
					</ProtectedRoute>
				),
			},
			{
				path: "address-info",
				element: (
					<ProtectedRoute>
						<UserAddressInfo />
					</ProtectedRoute>
				),
			},
			{
				path: "notes-management",
				element: (
					<ProtectedRoute>
						<UserNotes />
					</ProtectedRoute>
				),
			},
			{
				path: "account-deletion",
				element: (
					<ProtectedRoute>
						<UserAccountDeletion />
					</ProtectedRoute>
				),
			},
		],
	},
	{
		path: "/add-note",
		element: (
			<ProtectedRoute>
				<AddNotePage />
			</ProtectedRoute>
		),
	},
	{
		path: "/note/:id",
		element: (
			<ProtectedRoute>
				<ViewNotePage />
			</ProtectedRoute>
		),
	},
]);

export default router;
