import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	ColumnDef,
	SortingState,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { Button } from "../ui/button";
import { User } from "@/types";
import { toast } from "@/hooks/use-toast";
import { toggleUserStatus, deleteUsers, getUsers } from "@/lib/fetch";
import { useAuthContext } from "@/context";

type DataTableProps = {
	columns: ColumnDef<User>[];
	data: User[];
	setUsers: React.Dispatch<React.SetStateAction<User[]>>;
};

export function DataTable({ columns, data, setUsers }: DataTableProps) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [rowSelection, setRowSelection] = useState({});
	const { user, handleLogOut } = useAuthContext();

	const table = useReactTable<User>({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onRowSelectionChange: setRowSelection,
		state: {
			sorting,
			rowSelection,
		},
	});

	const getEmailsList = () => {
		const rows = table.getFilteredSelectedRowModel().rows;
		const emailsList = rows.map(row => row.original.email);

		return emailsList;
	};

	// Manages our data table and UI after our user has clicked block or delete
	const handleResponse = async (
		success: boolean,
		message: string,
		status: number
	) => {
		if (!success) {
			// Status 401 means that our current user account has been blocked/deleted by someone else while we were still in the app.
			if (status === 401) {
				handleLogOut(message);
				return;
			}

			// User didn't select any users or any other error goes here
			toast({ description: message, variant: "destructive" });
			return;
		}

		// Status 202 means our current user included himself in the block/delete list, therefore we must log him out.
		if (status === 202) {
			handleLogOut(message);
			return;
		}

		// Update our table values
		toast({ description: message });
		const { data } = await getUsers();
		setUsers(data);
	};

	const handleUserStatus = async () => {
		try {
			const emailsToUpdate = getEmailsList();

			const { success, message, status } = await toggleUserStatus(
				user!.email,
				emailsToUpdate
			);

			handleResponse(success, message, status);
		} catch (err) {
			console.error(err);
		}
	};

	const handleDeleteUsers = async () => {
		try {
			const emailsToDelete = getEmailsList();

			const { success, message, status } = await deleteUsers(
				user!.email,
				emailsToDelete
			);

			handleResponse(success, message, status);
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<div>
			<div className='flex gap-2'>
				<Button onClick={handleUserStatus}>Toggle Selected Users Status</Button>
				<Button onClick={handleDeleteUsers}>Delete Selected Users</Button>
			</div>
			<div className='my-4'>
				<Table className='rounded-md border relative'>
					<TableHeader>
						{table.getHeaderGroups().map(headerGroup => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map(header => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext()
												  )}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map(row => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}>
									{row.getVisibleCells().map(cell => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className='h-24 text-center'>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
