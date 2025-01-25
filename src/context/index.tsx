import { User } from "@/types";
import { createContext, ReactNode, useContext, useState } from "react";

type AuthContext = {
	user: User | null;
	setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

const INITIAL_STATE = {
	user: null,
	setUser: () => {},
};

const AuthContext = createContext<AuthContext>(INITIAL_STATE);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const value = {
		user,
		setUser,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);
