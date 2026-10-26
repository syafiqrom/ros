"use client"

import { createColumnHelper } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Pencil, Copy, Eye } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

import { type DataTableFeatures } from "@/components/ui/data-table-features"
import { edit } from "@/routes/vehicles"
import { Link } from "@inertiajs/react"

export type Vehicle = {
    id: number
    plate_number: string
    brand: string
    model: string
    capacity_metric_ton: string
    capacity_cubic_meter: string
    cost_per_km: string
    cost_per_hour: string
    status: string
}

const columnHelper = createColumnHelper<DataTableFeatures, Vehicle>()

export const columns = columnHelper.columns([
    columnHelper.display({
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                indeterminate={
                    table.getIsSomePageRowsSelected() &&
                    !table.getIsAllPageRowsSelected()
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
    columnHelper.accessor("capacity_metric_ton", { header: "Capacity" }),
    columnHelper.accessor("status", { header: "Status" }),
    columnHelper.display({
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const vehicle = row.original
            return (
                <div>
                    <Button variant="ghost" size="icon">
                        <Link href={edit(vehicle.id)}>
                            <Pencil className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            )
        },
    }),
])