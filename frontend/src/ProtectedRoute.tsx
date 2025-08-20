import React from "react";
import { Navigate } from "react-router";
import { useAuth } from "@/hook/useAuth";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
	const user = useAuth();

	if (!user || !user.auth) {
		return <Navigate to="/login" replace />;
	}

	return <>{children}</>;
};

export default ProtectedRoute;
