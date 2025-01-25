import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuthContext } from "@/context";
import { useToast } from "@/hooks/use-toast";
import { signupSchema } from "@/lib/zod-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";

type SignupFormProps = {
	setFormType: React.Dispatch<React.SetStateAction<"login" | "signup">>;
};

const SignupForm = ({ setFormType }: SignupFormProps) => {
	const { setUser } = useAuthContext();
	const { toast } = useToast();
	const navigate = useNavigate();

	const form = useForm<z.infer<typeof signupSchema>>({
		resolver: zodResolver(signupSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
		},
	});

	async function onSubmit(values: z.infer<typeof signupSchema>) {
		const response = await fetch(`${import.meta.env.VITE_URL}/users`, {
			method: "POST",
			body: JSON.stringify(values),
			headers: {
				"Content-Type": "application/json",
			},
		});

		const { success, data, message } = await response.json();

		if (!success) {
			return toast({
				description: message,
				variant: "destructive",
			});
		}

		const { name, email, status } = data;

		setUser({
			name,
			email,
			status,
		});

		navigate("/dashboard");
	}

	return (
		<div>
			<div className='form-container'>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
						<FormField
							control={form.control}
							name='name'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='email'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='password'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input {...field} type='password' />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type='submit'>Sign Up</Button>
					</form>
				</Form>
			</div>
			<div className='bottom-form-options'>
				<p>Already have an account? </p>
				<Button onClick={() => setFormType("login")}>Log In</Button>
			</div>
		</div>
	);
};

export default SignupForm;
