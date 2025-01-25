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
import { blockUsers, deleteUsers, getUsers } from "@/lib/fetch";
import { useAuthContext } from "@/context";
import { useNavigate } from "react-router";

interface DataTableProps {
	columns: ColumnDef<User>[];
	data: User[];
	setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

export function DataTable({ columns, data, setUsers }: DataTableProps) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [rowSelection, setRowSelection] = useState({});
	const { user } = useAuthContext();
	const navigate = useNavigate();

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

	const handleBlockUsers = async () => {
		try {
			const emailsToBlock = getEmailsList();

			const { success, message } = await blockUsers(user!.email, emailsToBlock);

			if (!success) {
				toast({ description: message, variant: "destructive" });
				navigate("/");
				return;
			}

			toast({ description: message });
			const { data } = await getUsers(user!.email);
			setUsers(data);
		} catch (err) {
			console.error(err);
		}
	};

	const handleDeleteUsers = async () => {
		try {
			const emailsToDelete = getEmailsList();

			const { success, message } = await deleteUsers(
				user!.email,
				emailsToDelete
			);

			if (!success) {
				toast({ description: message, variant: "destructive" });
				navigate("/");
				return;
			}

			toast({ description: message });
			const { data } = await getUsers(user!.email);
			setUsers(data);
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<div>
			<div className='flex gap-2'>
				<Button onClick={handleBlockUsers}>Block Selected Users</Button>
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
