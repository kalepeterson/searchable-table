# Searchable Table - An Angular Component Library

Searchable Table is an Angular component designed to simplify displaying large amounts of data.

## Features
Searchable Table currently supports the following features:

### Searching
Globally search for text across all of the displayed data cells, or search for a value within a specific column.

The global search feature is optional. Which columns are searchable is also specified via the `TableModel`.

### Column Sets
Display and allow selection of named collections of columns, such as "Demographics" or "Details".

Hiding and showing all columns is also supported. Hiding all columns will leave action columns and the defined "base" columns which are always shown.

### Pagination
Display a subset of rows controlled by pagination buttons and a row count selector.

Pagination buttons always include the page number buttons, but can also include buttons for the Next/Previous page, First/Last page, both, or neither. Pagination can also be disabled entirely.

The row counts available are also specified via the `TableModel`.

### Sorting
Columns can be sorted (if configured to allow sorting) by clicking the `th` column header.

### Row Actions
Action buttons can be defined as part of any column's data cells. Columns specifically for actions upon a row can be defined for the left-most and/or right-most columns in the table.

### Data Cell Display
The `TableModel` can be used to specify how each column's data cells are calculated.

### Styling Customization
CSS classes can be specified for various parts of the table elements.

## Using Searchable Table
A full working example can be found at the [Searchable Table Demo repo](https://github.com/kalepeterson/searchable-table-demo).

Searchable Table is available on NPM, start by running the following command in an initialized Angular project:
```bash
npm install ngx-searchable-table
```

Once installed, the component can be used by importing the `SearchableDisplay` component from `ngx-searchable-table` and placing the element `sd-searchable-display` into your template HTML.

The following inputs are mandatory:  `dataRows` and `tableModel`.  `dataRows` contains an array of your data objects that Searchable Table should operate upon.  `tableModel` defines how Searchable Table should display and handle the data rows.

A trivial example would be:
```html 
<sd-searchable-display [tableModel]="tableModel()" [dataRows]="data"></sd-searchable-display>
```
```ts
import { SearchableDisplay, TableModel } from 'ngx-searchable-table';
@Component({
    // ... rest of component fields
    imports: [SearchableDisplay]
})
export class MyComponent {
    protected readonly data = [
        {
            "username": "a"
        },
        {
            "username": "b"
        }
    ];

    tableModel(): TableModel<any> {
        var model = new TableModel<any>();
        return {
            ...model,
            dataColumns: [
                {
                    header: 'Username',
                    searchable: true,
                    sortable: true,
                    valueDisplayMapper: (row: any) => row?.username ?? '',
                }
            ]
        }
    }
}
```

### Using `TableModel`
The `tableModel` input tells Searchable Table how to work with the data rows being provided to it.

#### Column Definitions
Column definitions specify which operations (e.g. sorting, searching) are available and how to display data cells for that column.

ColumnDefinition Fields:
|Field Name|Type|Description|Example|
|----------|----|-----------|-------|
|header|`string`|The text that will appear in the `th` element|`'First Name'`|
|searchable|`boolean`|If true, allow searching this specific column (via the `td` elements in the table foot)|`true`|
|sortable|`boolean`|If true, allow sorting the column by clicking the `th` element|`true`|
|valueDisplayMapper|`function(row: T) => string`|Mapping function returning what text to display for a row|`(row: Shellfish) => row?.species ?? ''`|
|cellActionButtons|`ActionButtonDefinition<T>[]`|Buttons to include in each data cell for the column, see ActionButtonDefinition table below|`[ { buttonText: 'Copy', clickAction: (row: Shellfish) => { navigator.clipboard.writeText(row?.commonName ?? ''); return signal(null); } } ]`|

##### Action Button Definitions
|Field Name|Type|Description|Example|
|----------|----|-----------|-------|
|buttonText|`string`|Text that will appear in the `<button>` element body|`'Copy'`|
|clickAction|`function(row: T) => Signal<any>`|Function to call upon button clicked, passing in the corresponding row data. See below for callback information|`(row: Shellfish) => { alert('Shellfish species ' + row?.species ?? '' + ' selected'); return signal(row); }`|

Action buttons expose a `Signal<any>` that can be used to trigger other actions in the parent application.

#### Global Search
If `tableModel.globalSearchable` is set to true, an `<input>` element will render above the table element that allows searching all data cells for the input value. This is applied in addition to other search terms from the `tfoot` elements, but it is also limited to only visible columns.

#### Column Visibility Sets
The `tableModel.dataColumnVisibility` field allows specifying options for displaying and selecting subsets of column definitions via a `<select>` (dropdown) field.

##### Show All and Hide All
There are two built-in options that can be configured:
* **Show All**: Makes all columns visible.
    * Can be disabled by setting `tableModel.dataColumnVisibility.allowShowAll` to false.
* **Hide All**: Makes only *base* columns visible.
    * Can be disabled by setting `tableModel.dataColumnVisibility.allowHideAll` to false.

##### Base Columns
Base columns are *always* visible regardless of the selected visibility group. A typical example would be an identifier or name column that makes the row meaningful to the user.

Base columns are an array of column definitions (`ColumnDefinition<T>[]`) and can be set here: `tableModel.dataColumnVisibility.baseColumns`.

##### Visibility Groups
Visibility Groups are logical sets of columns that should be displayed together. This allows one `<sd-searchable-display>` to handle displaying multiple sets of information without needing multiple `table` elements or other functionality.

Visibility groups are defined as a `Record<string, ColumnDefinition<T>[]>` where the `string` key is the text that will display in the `<select>` element, and the column definitions to display (in addition to the base columns) when that option is selected.

Visibility groups are assigned here: `tableModel.dataColumnVisibility.visibilityGroups`.

##### Default Visibility Group
The default visibility group can be specifying `'all'`, `'none'`, or a valid key within the `visibilityGroups` value at this field: `tableModel.dataColumnVisibility.defaultVisibilityGroup`.

#### Pagination Options
The `tableModel.pagination` field allows specifying which, if any, page sizing options and navigation controls should be displayed.

If no pagination (always show all rows) is desired, the `tableModel.pagination` field should simply be set to `null` or left `undefined`.

##### Page Size Options
The `tableModel.pagination.pageSizeOptions` field accepts an array of page size numbers.  These should be positive, unique integers.

The page size options will appear in the Page Size dropdown beneath the `table` element.

##### Page Buttons
The `tableModel.pagination.pageButtons` field accepts an array of any of the following values:
* `'all'`
* `'first-last'`
    * Displays buttons to navigate to the first and last pages of the data
* `'next-previous'`
    * Displays buttons to navigate to the next and previous pages of the data

Putting `all` and any of the other options is redundant, `all` is provided as a convenience.

The buttons for specific page numbers (e.g. Page 3, Page 4) will always appear if the `tableModel.pagination` field is set, the `pageButtons` field just adds more buttons on either side of the numbered buttons.

#### Action Columns
Action columns provide buttons to allow users to perform some action upon a certain row.

Fields for `tableModel.actionColumns`:
|Field Name|Type|Description|Example|
|----------|----|-----------|-------|
|header|`string`|The text to display in the `th` element for this column.|`'View Details'`|
|columnLocation|`'start' \| 'end'`|Whether to place the column to the left (start) of the data columns or the right (end) of the data columns.|`'start'`|
|actionButtonDefinitions|`ActionButtonDefinition<T>[]`|One or many buttons to render in each row of this column. See the [Action Button Definition Fields](#action-button-definitions) section above for details.|`[ { buttonText: 'View Details', clickAction: (row: Shellfish) => { alert(`Shellfish details:\n${JSON.stringify(row, null, 2)}`); return signal(null); } } ]`|

#### Row Identifier
Angular's change detection for rows in `<table>` elements requires a tracking function.  `tableModel.rowIdentifier` provides a field to specify such a function.

`tableModel.rowIdentifier` is a `function(row: T) => string` that should result in unique values for each row in a table.

The default `rowIdentifier` is just `JSON.stringify(row)`.