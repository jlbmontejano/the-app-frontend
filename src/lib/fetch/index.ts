export const signUpUser = async ({
	name,
	email,
	password,
}: {
	name: string;
	email: string;
	password: string;
}) => {
	const response = await fetch(`${import.meta.env.VITE_URL}/users`, {
		method: "POST",
		body: JSON.stringify({ name, email, password }),
		headers: {
			"Content-Type": "application/json",
		},
	});

	return response.json();
};

export const loginUser = async ({
	email,
	password,
}: {
	email: string;
	password: string;
}) => {
	const response = await fetch(`${import.meta.env.VITE_URL}/login`, {
		method: "POST",
		body: JSON.stringify({ email, password }),
		headers: {
			"Content-Type": "application/json",
		},
	});

	return response.json();
};

export const getUsers = async () => {
	const response = await fetch(`${import.meta.env.VITE_URL}/users`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});

	return response.json();
};

export const toggleUserStatus = async (
	userEmail: string,
	emailsToUpdate: string[]
): Promise<{ success: boolean; message: string; status: number }> => {
	const response = await fetch(`${import.meta.env.VITE_URL}/users`, {
		method: "PUT",
		body: JSON.stringify({ userEmail, emailsToUpdate }),
		headers: {
			"Content-Type": "application/json",
		},
	});

	const { success, message } = await response.json();

	return { success, message, status: response.status };
};

export const deleteUsers = async (
	userEmail: string,
	emailsToDelete: string[]
): Promise<{ success: boolean; message: string; status: number }> => {
	const response = await fetch(`${import.meta.env.VITE_URL}/users`, {
		method: "DELETE",
		body: JSON.stringify({ userEmail, emailsToDelete }),
		headers: {
			"Content-Type": "application/json",
		},
	});

	const { success, message } = await response.json();

	return { success, message, status: response.status };
};
