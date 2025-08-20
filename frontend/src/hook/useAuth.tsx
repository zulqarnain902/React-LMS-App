import { useSelector } from "react-redux";

export const useAuth = () => {
	const user = useSelector((state) => state.user.user);
	// console.log("User authentication status:", user);
	return user;
};
