import { LoginCard } from "@/components/LoginCard";
import Layout from "@/Layout";

export const LoginPage = () => {
	return (
		<Layout>
			<div className="login-page flex flex-col items-center justify-center gap-4">
				<h1 className="text-2xl font-bold font-[cursive] text-primary">
					Login Page
				</h1>
				<p className="text-center">
					This is the login page where users can access their accounts.
				</p>
				<LoginCard />
			</div>
		</Layout>
	);
};
