import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuthContext } from "@/context";
import { getUsers } from "@/lib/fetch";
import { User } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { useEffect, useState } from "react";

const Dashboard = () => {
	const { user, handleLogOut } = useAuthContext();
	const [users, setUsers] = useState<User[]>([]);

	// Avoid any unlogged user access the dashboard
	useEffect(() => {
		if (!user) {
			handleLogOut("No user found.");
			return;
		}

		async function fetchUsers() {
			const { data } = await getUsers();

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
			accessorKey: "isActive",
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
			cell: ({ row }) => {
				return <p>{row.original.isActive ? "ACTIVE" : "BLOCKED"}</p>;
			},
			enableSorting: true,
		},
	];

	return (
		<div className='flex flex-col align-center justify-center'>
			<DataTable columns={columns} data={users} setUsers={setUsers} />

			<Button
				className='w-fit'
				onClick={() => handleLogOut("Logout successful.")}>
				Log Out
			</Button>
		</div>
	);
};

export default Dashboard;
