import { ColumnDefinition } from "../searchable-display/table-model";

export const USER_COLUMN_DEFS: ColumnDefinition[] = [
    {
        header: "ID",
        searchable: false,
        sortable: true,
        valueDisplayMapper: (row: any) => (row?.id).toString()
    },
    {
        header: "Name",
        searchable: true,
        sortable: true,
        valueDisplayMapper: (row: any) => row?.name
    },
    {
        header: "Username",
        searchable: true,
        sortable: true,
        valueDisplayMapper: (row: any) => row?.username
    }
]