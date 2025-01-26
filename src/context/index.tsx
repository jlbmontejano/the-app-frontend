import { toast } from "@/hooks/use-toast";
import { User } from "@/types";
import { createContext, ReactNode, useContext, useState } from "react";
import { useNavigate } from "react-router";

type AuthContext = {
	user: User | null;
	setUser: React.Dispatch<React.SetStateAction<User | null>>;
	handleLogOut: (message: string) => void;
};

const AuthContext = createContext<AuthContext | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const navigate = useNavigate();

	const handleLogOut = (message: string) => {
		toast({ description: message });
		setUser(null);
		navigate("/");
	};

	const value = {
		user,
		setUser,
		handleLogOut,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuthContext must be used within an AuthProvider");
	}
	return context;
};
