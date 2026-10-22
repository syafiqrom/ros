"use client"

import { createColumnHelper } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { type DataTableFeatures } from "./data-table-features"
import { edit } from "@/routes/vehicles"
import { Link } from "@inertiajs/react"

export type Vehicle = {
    id: number
    plate_number: string
    brand: string
    model: string
    capacity: number
    status: string
}

const columnHelper = createColumnHelper<DataTableFeatures, Vehicle>()

export const columns = columnHelper.columns([
    columnHelper.display({
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    }),
    columnHelper.accessor("plate_number", {
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Plate Number
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    }),
    columnHelper.accessor("brand", { header: "Brand" }),
    columnHelper.accessor("model", { header: "Model" }),
    columnHelper.accessor("capacity", { header: "Capacity" }),
    columnHelper.accessor("status", { header: "Status" }),
    columnHelper.display({
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const vehicle = row.original
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(String(vehicle.id))}
                        >
                            Copy vehicle ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href={edit(vehicle.id)}>Edit vehicle</Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    }),
])