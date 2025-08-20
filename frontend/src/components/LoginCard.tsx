import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { login, loginWithGoogle } from "../api/userApis";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { addUser } from "../redux/userSlice";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

type LoginFormInputs = {
	email: string;
	password: string;
};

export const LoginCard = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormInputs>();

	const onSubmit = async (data: LoginFormInputs) => {
		console.log("Logging in with:", data);
		try {
			const response = await login(data);
			console.log("Login response:", response);

			if (response.auth) {
				toast.success("Login successful!");
				// dispatch addUser to redux store
				dispatch(addUser({ ...response.user, auth: response.auth }));
				navigate("/");
			} else {
				// toast.error("Login failed. Please check your credentials.");
				toast.error(response.response.data.message);
				console.error("Login failed:", response.response);
			}
		} catch (error) {
			toast.error("Login failed. Please try again.");
			console.error("Login error:", error);
		}
	};

	const handleGoogleLogin = async (tokenResponse: any) => {
		try {
			console.log("Google login response:", tokenResponse);
			// console.log(
			// 	"Decoded Google response:",
			// 	jwtDecode(tokenResponse.credential)
			// );

			const decoded_payload = jwtDecode(tokenResponse.credential);
			console.log("User Info State:", {
				fname: decoded_payload.given_name || "",
				lname: decoded_payload.family_name || "",
				picture: decoded_payload.picture || "",
				name: decoded_payload.name || "",
				email: decoded_payload.email || "",
				registerThrough: "google",
			});

			const response = await loginWithGoogle({
				fname: decoded_payload.given_name || "",
				lname: decoded_payload.family_name || "",
				// picture: decoded_payload.picture || "",
				// name: decoded_payload.name || "",
				email: decoded_payload.email || "",
				registerThrough: "google",
			});
			if (response.data.auth) {
				toast.success("Google login successful!");
				dispatch(addUser({ ...response.data.user, auth: response.data.auth }));
				navigate("/");
			} else {
				toast.error("Google login failed. Please try again.");
			}
		} catch (error) {
			toast.error("Google login failed. Please try again.");
			console.error("Google login error:", error);
		}
	};

	return (
		<div className="flex h-full items-center justify-center">
			<div className="rounded-lg border border-gray-200 bg-primary/20 shadow-md dark:border-gray-700 dark:bg-gray-900 flex-col flex h-full items-center justify-center sm:px-4">
				<div className="flex h-full flex-col justify-center gap-4 p-8">
					<div className="left-0 right-0 inline-block border-gray-200 px-2 py-2.5 sm:px-4">
						<form
							className="flex flex-col gap-4 pb-4 max-w-sm"
							onSubmit={handleSubmit(onSubmit)}
						>
							<h1 className="mb-4 text-2xl font-bold text-black">Login</h1>

							{/* Email Field */}
							<div>
								<label
									className="text-sm font-medium text-gray-900 dark:text-gray-300 mb-2 block"
									htmlFor="email"
								>
									Email:
								</label>
								<input
									id="email"
									type="email"
									{...register("email", {
										required: "Email is required",
										pattern: {
											value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
											message: "Invalid email address",
										},
									})}
									className="block w-full border disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 border-gray-300 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500 p-2.5 text-sm rounded-lg"
									placeholder="email@example.com"
								/>
								{errors.email && (
									<p className="text-red-500 text-sm mt-1">
										{errors.email.message}
									</p>
								)}
							</div>

							{/* Password Field */}
							<div>
								<label
									className="text-sm font-medium text-gray-900 dark:text-gray-300 mb-2 block"
									htmlFor="password"
								>
									Password
								</label>
								<input
									id="password"
									type="password"
									{...register("password", {
										required: "Password is required",
										pattern: {
											value:
												/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/,
											message:
												"Password must be at least 8 characters long and contain at least one letter, one number, and one special character",
										},
									})}
									className="block w-full border disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 border-gray-300 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500 p-2.5 text-sm rounded-lg"
									placeholder="*********"
								/>
								{errors.password && (
									<p className="text-red-500 text-sm mt-1">
										{errors.password.message}
									</p>
								)}
							</div>

							{/* Forgot Password Link */}
							<div className="flex justify-between">
								<Link
									className="text-sm text-blue-500 hover:underline"
									to="/reset-password"
								>
									Forgot Password?
								</Link>
							</div>

							{/* Submit Button */}
							<div className="flex flex-col gap-2">
								<button
									type="submit"
									className="border transition-colors focus:ring-2 p-0.5 disabled:cursor-not-allowed border-transparent bg-primary hover:bg-primary/70 active:bg-primary/80 text-white disabled:bg-gray-300 disabled:text-gray-700 rounded-lg"
								>
									<span className="flex items-center justify-center gap-1 font-medium py-1 px-2.5 text-base">
										Login
									</span>
								</button>
							</div>
						</form>


						{/* Register Link */}
						<div className="min-w-[270px] mt-4 text-center text-gray-500">
							New user?{" "}
							<Link
								className="text-blue-500 hover:text-blue-600"
								to="/register"
							>
								Create account here!
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
