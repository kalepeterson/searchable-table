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
todo

#### Global Search
todo

#### Column Visibility Sets
todo

#### Pagination Options
todo

#### Action Columns
todo

#### Row Identifier
todo

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```
