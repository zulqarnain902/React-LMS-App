import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { resetPasswordEmail } from "../api/userApis";
import { toast } from "react-hot-toast";

type ResetPasswordFormInputs = {
	email: string;
};

export const ResetPasswordCard = () => {
	const navigate = useNavigate();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ResetPasswordFormInputs>();

	const onSubmit = async (data: ResetPasswordFormInputs) => {
		console.log("Resetting password for:", data);
		try {
			const response = await resetPasswordEmail(data);
			console.log("Reset password response:", response);

			if (response.status === 200) {
				toast.success("Reset password email sent!");
				navigate("/login");
			} else {
				toast.error(response.response.data.message);
				console.error("Reset password failed:", response);
			}
		} catch (error) {
			toast.error("Reset password failed. Please try again.");
			console.error("Reset password error:", error);
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
							<h1 className="mb-4 text-2xl font-bold text-black">
								Reset Password
							</h1>

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

							{/* Submit Button */}
							<div className="flex flex-col gap-2">
								<button
									type="submit"
									className="border transition-colors focus:ring-2 p-0.5 disabled:cursor-not-allowed border-transparent bg-primary hover:bg-primary/70 active:bg-primary/80 text-white disabled:bg-gray-300 disabled:text-gray-700 rounded-lg"
								>
									<span className="flex items-center justify-center gap-1 font-medium py-1 px-2.5 text-base">
										Send Reset Link
									</span>
								</button>
							</div>
						</form>

						{/* Register Link */}
						<div className="min-w-[270px] mt-4 text-center text-gray-500">
							<p>
								Already have an account?{" "}
								<Link className="text-blue-500 hover:text-blue-600" to="/login">
									Login here!
								</Link>
							</p>
							or
							<br />
							<p>
								New user? {""}
								<Link
									className="text-blue-500 hover:text-blue-600"
									to="/register"
								>
									Create account here!
								</Link>
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
