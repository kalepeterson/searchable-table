import { ColumnDefinition } from '../searchable-display/table-model';

export const USER_COLUMN_DEFS_BASE: ColumnDefinition[] = [
  {
    header: 'ID',
    searchable: false,
    sortable: true,
    valueDisplayMapper: (row: any) => (row?.id).toString(),
  },
  {
    header: 'Name',
    searchable: true,
    sortable: true,
    valueDisplayMapper: (row: any) => row?.name ?? '',
  },
];

export const USER_COLUMN_DEFS_DETAILS_MINIMAL: ColumnDefinition[] = [
  {
    header: 'Username',
    searchable: true,
    sortable: true,
    valueDisplayMapper: (row: any) => row?.username ?? '',
  },
  {
    header: 'Email',
    searchable: true,
    sortable: true,
    valueDisplayMapper: (row: any) => row?.email ?? '',
  },
  {
    header: 'Phone',
    searchable: true,
    sortable: true,
    valueDisplayMapper: (row: any) => row?.phone ?? '',
  },
  {
    header: 'Website',
    searchable: true,
    sortable: true,
    valueDisplayMapper: (row: any) => row?.website ?? '',
  },
];

export const USER_COLUMN_DEFS_CONTACT: ColumnDefinition[] = [
  {
    header: 'Email',
    searchable: true,
    sortable: true,
    valueDisplayMapper: (row: any) => row?.email ?? '',
  },
  {
    header: 'Phone',
    searchable: true,
    sortable: true,
    valueDisplayMapper: (row: any) => row?.phone ?? '',
  },
  {
    header: 'Website',
    searchable: true,
    sortable: true,
    valueDisplayMapper: (row: any) => row?.website ?? '',
  },
  {
    header: 'Full Address',
    searchable: true,
    sortable: false,
    valueDisplayMapper: (row: any) => row?.formattedAddress,
  },
  {
    header: 'Company Name',
    searchable: true,
    sortable: true,
    valueDisplayMapper: (row: any) => row?.company?.name ?? '',
  },
];

export const USER_COLUMN_DEFS_COMPANY: ColumnDefinition[] = [
  {
    header: 'Company Name',
    searchable: true,
    sortable: true,
    valueDisplayMapper: (row: any) => row?.company?.name ?? '',
  },
  {
    header: 'Company Catch Phrase',
    searchable: true,
    sortable: true,
    valueDisplayMapper: (row: any) => row?.company?.catchPhrase ?? '',
  },
  {
    header: 'Company Baloney',
    searchable: true,
    sortable: true,
    valueDisplayMapper: (row: any) => row?.company?.bs ?? '',
  },
  {
    header: 'Company Display',
    searchable: true,
    sortable: false,
    valueDisplayMapper: (row: any) => row?.formattedCompany,
  },
];

export const USER_COLUMN_DEFS_ADDRESS: ColumnDefinition[] = [
  {
    header: 'Street',
    searchable: true,
    sortable: true,
    valueDisplayMapper: (row: any) => row?.address?.street ?? '',
  },
  {
    header: 'Suite',
    searchable: true,
    sortable: true,
    valueDisplayMapper: (row: any) => row?.address?.suite ?? '',
  },
  {
    header: 'City',
    searchable: true,
    sortable: true,
    valueDisplayMapper: (row: any) => row?.address?.city ?? '',
  },
  {
    header: 'Zipcode',
    searchable: true,
    sortable: true,
    valueDisplayMapper: (row: any) => row?.address?.zipcode ?? '',
  },
];

export const USER_COLUMN_DEFS_LOCATION: ColumnDefinition[] = [
  {
    header: 'Full Address',
    searchable: true,
    sortable: false,
    valueDisplayMapper: (row: any) => row?.formattedAddress,
  },
  {
    header: 'Geo Location',
    searchable: true,
    sortable: false,
    valueDisplayMapper: (row: any) => row?.formattedGeo,
  },
];

export const USER_COLUMN_DEFS_GEO: ColumnDefinition[] = [
  {
    header: 'Latitude',
    searchable: true,
    sortable: true,
    valueDisplayMapper: (row: any) => row?.address?.geo?.lat ?? '',
  },
  {
    header: 'Longitude',
    searchable: true,
    sortable: true,
    valueDisplayMapper: (row: any) => row?.address?.geo?.lng ?? '',
  },
];

export const USER_COLUMN_DEFS_FULL: ColumnDefinition[] = [
  ...USER_COLUMN_DEFS_BASE,
  ...USER_COLUMN_DEFS_DETAILS_MINIMAL,
  ...USER_COLUMN_DEFS_ADDRESS,
  ...USER_COLUMN_DEFS_COMPANY,
  ...USER_COLUMN_DEFS_GEO,
];

export const USER_COLUMN_DEFINITIONS_OPTIONS: Record<string, ColumnDefinition[]> = {
  'Basic Details': USER_COLUMN_DEFS_DETAILS_MINIMAL,
  'Contact Info': USER_COLUMN_DEFS_CONTACT,
  'Company Info': USER_COLUMN_DEFS_COMPANY,
  'Location Details': USER_COLUMN_DEFS_LOCATION,
  'Address Details': USER_COLUMN_DEFS_ADDRESS,
};
