import "./App.css";
import { RouterProvider } from "react-router";
import router from "./Routing";
import useAutoLogin from "./hook/useAutoLogin";

function App() {
	const loading: Boolean = useAutoLogin();
	return loading ? (
		<div className="flex items-center justify-center h-screen">
			<span className="text-xl font-bold">Loading...</span>
		</div>
	) : (
		<RouterProvider router={router} />
	);
}

export default App;
