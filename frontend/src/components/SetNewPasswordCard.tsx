import { useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";
import { ResetPassword } from "../api/userApis";
import { toast } from "react-hot-toast";

type NewPasswordFormInputs = {
	newPassword: string;
	confirmPassword: string;
};

export const SetNewPasswordCard = () => {
	const navigate = useNavigate();
	const {
		register,
		handleSubmit,
		reset,
		getValues,
		formState: { errors },
	} = useForm<NewPasswordFormInputs>();
	const token = useParams().token as string;

	const onSubmit = async (data: NewPasswordFormInputs) => {
		if (!token) {
			toast.error("Invalid token or expired. Please try again.");
			return;
		}
		try {
			const response = await ResetPassword(token, data);
			console.log("Reset Password response:", response);

			if (response.status === 200) {
				toast.success(
					response.data.message + ", Now login with your new password."
				);
				navigate("/login");
			} else {
				toast.error(response.response.data.message);
				console.error("Reset Password failed:", response);
			}
		} catch (error) {
			toast.error("Reset Password failed. Please try again.");
			console.error("Reset Password error:", error);
		} finally {
			reset();
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
								Change Your Password
							</h1>

							{/* New Password Field */}
							<div>
								<label
									className="text-sm font-medium text-gray-900 dark:text-gray-300 mb-2 block"
									htmlFor="newPassword"
								>
									New Password:
								</label>
								<input
									id="newPassword"
									type="text"
									{...register("newPassword", {
										required: "New password is required",
										pattern: {
											value:
												/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/,
											message:
												"New password must be at least 8 characters long and contain at least one letter, one number, and one special character",
										},
									})}
									className="block w-full border disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 border-gray-300 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500 p-2.5 text-sm rounded-lg"
									placeholder="*********"
								/>
								{errors.newPassword && (
									<p className="text-red-500 text-sm mt-1">
										{errors.newPassword.message}
									</p>
								)}
							</div>

							{/* Confirm Password Field */}
							<div>
								<label
									className="text-sm font-medium text-gray-900 dark:text-gray-300 mb-2 block"
									htmlFor="confirmPassword"
								>
									Confirm Password
								</label>
								<input
									id="confirmPassword"
									type="password"
									{...register("confirmPassword", {
										required: "Confirm password is required",
										validate: (value) =>
											value === getValues("newPassword") ||
											"Passwords do not match",
										pattern: {
											value:
												/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/,
											message:
												"Confirm password must be at least 8 characters long and contain at least one letter, one number, and one special character",
										},
									})}
									className="block w-full border disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 border-gray-300 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500 p-2.5 text-sm rounded-lg"
									placeholder="*********"
								/>
								{errors.confirmPassword && (
									<p className="text-red-500 text-sm mt-1">
										{errors.confirmPassword.message}
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
										Change Password
									</span>
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};
