import Layout from "../Layout";
import StepperForm from "@/components/Stepper-form/StepperForm";

export const RegisterPage = () => {
	return (
		<Layout>
			<div className="login-page flex flex-col items-center justify-center gap-4">
				<h1 className="text-2xl font-bold font-[cursive] text-primary">
					Register Page
				</h1>
				<p className="text-center">
					This is the registration page where users can create a new account.
				</p>
				<StepperForm />
			</div>
		</Layout>
	);
};
