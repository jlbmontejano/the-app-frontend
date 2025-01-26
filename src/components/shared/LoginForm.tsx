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
import { loginUser } from "@/lib/fetch";
import { loginSchema } from "@/lib/zod-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";

type LoginFormProps = {
	setFormType: React.Dispatch<React.SetStateAction<"login" | "signup">>;
};

const LoginForm = ({ setFormType }: LoginFormProps) => {
	const { setUser } = useAuthContext();
	const { toast } = useToast();
	const navigate = useNavigate();

	const form = useForm<z.infer<typeof loginSchema>>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	async function onSubmit(values: z.infer<typeof loginSchema>) {
		const { success, data, message } = await loginUser(values);

		if (!success) {
			return toast({
				description: message,
				variant: "destructive",
			});
		}

		const { name, email, isActive } = data;

		setUser({
			name,
			email,
			isActive,
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
						<Button type='submit'>Log In</Button>
					</form>
				</Form>
			</div>
			<div className='bottom-form-options'>
				<p>Don’t have an account? </p>
				<Button onClick={() => setFormType("signup")}>Sign up</Button>
			</div>
		</div>
	);
};

export default LoginForm;
