import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuthContext } from "@/context";
import { toast } from "@/hooks/use-toast";
import { getUsers } from "@/lib/fetch";
import { User } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const Dashboard = () => {
	const { user } = useAuthContext();
	const navigate = useNavigate();
	const [users, setUsers] = useState<User[]>([]);

	// Avoid any unlogged user access the dashboard
	useEffect(() => {
		if (!user || user.status === "BLOCKED") {
			toast({ description: "Invalid user." });
			navigate("/");
			return;
		}

		async function fetchUsers() {
			const { success, data, message } = await getUsers(user!.email);

			if (!success) {
				toast({ description: message });
				navigate("/");
				return;
			}

			setUsers(data);
		}

		fetchUsers();
	}, [users]);

	const columns: ColumnDef<User>[] = [
		{
			id: "select",
			header: ({ table }) => (
				<Checkbox
					checked={
						table.getIsAllPageRowsSelected() ||
						(table.getIsSomePageRowsSelected() && "indeterminate")
					}
					onCheckedChange={value => {
						table.toggleAllPageRowsSelected(!!value);
					}}
					aria-label='Select all'
				/>
			),
			cell: ({ row }) => (
				<Checkbox
					checked={row.getIsSelected()}
					onCheckedChange={value => row.toggleSelected(!!value)}
					aria-label='Select row'
				/>
			),
		},
		{
			accessorKey: "name",
			header: ({ column }) => {
				return (
					<Button
						variant='ghost'
						onClick={() =>
							column.toggleSorting(column.getIsSorted() === "asc")
						}>
						Name
						<ArrowUpDown className='ml-2 h-4 w-4' />
					</Button>
				);
			},
			enableSorting: true,
		},
		{
			accessorKey: "email",
			header: ({ column }) => {
				return (
					<Button
						variant='ghost'
						onClick={() =>
							column.toggleSorting(column.getIsSorted() === "asc")
						}>
						Email
						<ArrowUpDown className='ml-2 h-4 w-4' />
					</Button>
				);
			},
			enableSorting: true,
		},
		{
			accessorKey: "status",
			header: ({ column }) => {
				return (
					<Button
						variant='ghost'
						onClick={() =>
							column.toggleSorting(column.getIsSorted() === "asc")
						}>
						Status
						<ArrowUpDown className='ml-2 h-4 w-4' />
					</Button>
				);
			},
			enableSorting: true,
		},
	];

	const handleLogOut = () => {
		navigate("/");
	};

	return (
		<div className='flex flex-col align-center justify-center'>
			<DataTable columns={columns} data={users} setUsers={setUsers} />

			<Button className='w-fit' onClick={handleLogOut}>
				Log Out
			</Button>
		</div>
	);
};

export default Dashboard;
