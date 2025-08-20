import { SetNewPasswordCard } from "@/components/SetNewPasswordCard";
import Layout from "@/Layout";

const SetNewPasswordPage = () => {
	return (
		<Layout>
			<div className="login-page flex flex-col items-center justify-center gap-4">
				<h1 className="text-2xl font-bold font-[cursive] text-primary">
					Reset Password
				</h1>
				<p className="text-center">
					This is the reset password page where users can reset their password.
				</p>
				<SetNewPasswordCard />
			</div>
		</Layout>
	);
};

export default SetNewPasswordPage;
