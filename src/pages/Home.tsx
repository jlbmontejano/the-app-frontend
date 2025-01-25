import LoginForm from "@/components/shared/LoginForm";
import SignupForm from "@/components/shared/SignupForm";
import { useState } from "react";

const Home = () => {
	const [formType, setFormType] = useState<"login" | "signup">("login");

	return (
		<div>
			<p className='text-dark_slate_gray text-3xl font-semibold text-center'>
				Welcome to The App
			</p>
			{formType === "login" ? (
				<LoginForm setFormType={setFormType} />
			) : (
				<SignupForm setFormType={setFormType} />
			)}
		</div>
	);
};

export default Home;
