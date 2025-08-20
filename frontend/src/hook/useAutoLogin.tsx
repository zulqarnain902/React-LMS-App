import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../redux/userSlice";
import { refresh } from "../api/userApis";

function useAutoLogin() {
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		(async function autologinapicall() {
			try {
				//call api
				const response = await refresh();
				// if response good refresh user data
				if (response.status === 200) {
					dispatch(
						addUser({ ...response.data.user, auth: response.data.auth })
					);
				}
			} catch (error) {
				console.error("Auto-login failed:", error);
			} finally {
				setLoading(false);
			}
		})();
	}, []);
	return loading;
}

export default useAutoLogin;
