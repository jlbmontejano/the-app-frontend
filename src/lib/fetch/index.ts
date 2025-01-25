import { User } from "@/types";

export const getUsers = async (userEmail: string) => {
	const response = await fetch(`${import.meta.env.VITE_URL}/users`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});

	const { success, data, message } = await response.json();

	const filteredUsers = data.filter((user: User) => user.email !== userEmail);

	return { success, data: filteredUsers, message };
};

export const blockUsers = async (
	userEmail: string,
	emailsToBlock: string[]
) => {
	const response = await fetch(`${import.meta.env.VITE_URL}/users`, {
		method: "PUT",
		body: JSON.stringify({ userEmail, emailsToBlock }),
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
) => {
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
