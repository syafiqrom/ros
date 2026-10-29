"use client"

import * as React from "react"
import { Link } from "@inertiajs/react"
import {
    useTable,
    type ColumnDef,
    type ColumnFiltersState,
    type ColumnVisibilityState,
    type PaginationState,
    type RowData,
    type SortingState,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import {
    Field,
    FieldLabel,
} from "@/components/ui/field"
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectGroup,
    SelectItem
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { features, type DataTableFeatures } from "./data-table-features"

function getPageItems(current: number, total: number) {
    const pages: (number | "ellipsis")[] = []
    for (let i = 0; i < total; i++) {
        if (i === 0 || i === total - 1 || Math.abs(i - current) <= 1) {
            pages.push(i)
        } else if (pages[pages.length - 1] !== "ellipsis") {
            pages.push("ellipsis")
        }
    }
    return pages
}

interface DataTableProps<TData extends RowData> {
    columns: ColumnDef<DataTableFeatures, TData>[]
    data: TData[]
    filterColumn?: string
    filterPlaceholder?: string
    createHref?: React.ComponentProps<typeof Link>["href"]
    createLabel?: string
    toolbar?: React.ReactNode
}

interface RowsPerPageProps {
    value: number
    onChange: (pageSize: number) => void
    options?: number[]
}

function RowsPerPage({ value, onChange, options = [10, 25, 50, 100] }: RowsPerPageProps) {
    return (
        <Field orientation="horizontal" className="w-fit">
            <FieldLabel htmlFor="select-rows-per-page">Rows per page</FieldLabel>
            <Select
                value={String(value)}
                onValueChange={(v) => v && onChange(Number(v))}
            >
                <SelectTrigger className="w-20" id="select-rows-per-page">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent align="start">
                    <SelectGroup>
                        {options.map((size) => (
                            <SelectItem key={size} value={String(size)}>
                                {size}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </Field>
    )
}

export function DataTable<TData extends RowData>({
    columns,
    data,
    filterColumn,
    filterPlaceholder,
    createHref,
    createLabel,
    toolbar,
}: DataTableProps<TData>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] =
        React.useState<ColumnVisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [pagination, setPagination] = React.useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })

    const table = useTable({
        features,
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onPaginationChange: setPagination,
        state: { sorting, columnFilters, columnVisibility, rowSelection, pagination },
    })

    const pageCount = table.getPageCount()
    const currentPage = pagination.pageIndex

    return (
        <div>
            <div className="flex items-center py-4">
                {filterColumn && (
                    <Input
                        placeholder={filterPlaceholder ? filterPlaceholder : "Search..."}
                        value={(table.getColumn(filterColumn)?.getFilterValue() as string) ?? ""}
                        onChange={(e) => table.getColumn(filterColumn)?.setFilterValue(e.target.value)}
                        className="max-w-sm"
                    />
                )}

                <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant="outline" className="ml-2" />}>
                        Columns
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => (
                                <DropdownMenuCheckboxItem
                                    key={column.id}
                                    className="capitalize"
                                    checked={column.getIsVisible()}
                                    onCheckedChange={(value) =>
                                        column.toggleVisibility(!!value)
                                    }
                                >
                                    {column.id.replace("_", " ")}
                                </DropdownMenuCheckboxItem>
                            ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                <div className="ml-auto flex items-center gap-2">
                    {toolbar}
                    {createHref && createLabel && (
                        <Button
                            className="ml-auto"
                            render={<Link href={createHref} />}
                        >
                            {createLabel}
                        </Button>
                    )}
                </div>
            </div>

            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder ? null : (
                                            <table.FlexRender header={header} />
                                        )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            <table.FlexRender cell={cell} />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between py-4">
                <div className="text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>

                <div className="flex">
                    <RowsPerPage
                        value={pagination.pageSize}
                        onChange={(size) => table.setPageSize(size)}
                    />

                    {pageCount > 1 && (
                        <Pagination className="mx-0 w-auto">
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        href="#"
                                        aria-disabled={!table.getCanPreviousPage()}
                                        className={!table.getCanPreviousPage() ? "pointer-events-none opacity-50" : ""}
                                        onClick={(e) => {
                                            e.preventDefault()
                                            table.previousPage()
                                        }}
                                    />
                                </PaginationItem>

                                {getPageItems(currentPage, pageCount).map((item, i) => (
                                    <PaginationItem key={`${item}-${i}`}>
                                        {item === "ellipsis" ? (
                                            <PaginationEllipsis />
                                        ) : (
                                            <PaginationLink
                                                href="#"
                                                isActive={item === currentPage}
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    table.setPageIndex(item)
                                                }}
                                            >
                                                {item + 1}
                                            </PaginationLink>
                                        )}
                                    </PaginationItem>
                                ))}

                                <PaginationItem>
                                    <PaginationNext
                                        href="#"
                                        aria-disabled={!table.getCanNextPage()}
                                        className={!table.getCanNextPage() ? "pointer-events-none opacity-50" : ""}
                                        onClick={(e) => {
                                            e.preventDefault()
                                            table.nextPage()
                                        }}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    )}
                </div>
            </div>
        </div>
    )
}