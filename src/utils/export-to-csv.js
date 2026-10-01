const CSV_BOM = '﻿';

function escapeCsvValue(value) {
  const stringValue = value === null || value === undefined ? '' : String(value);

  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}

// ----------------------------------------------------------------------

export function exportToCsv({ filename, headers, rows }) {
  const headerLine = headers.map((header) => escapeCsvValue(header.label)).join(',');

  const dataLines = rows.map((row) =>
    headers.map((header) => escapeCsvValue(row[header.key])).join(',')
  );

  const csvContent = [headerLine, ...dataLines].join('\r\n');

  const blob = new Blob([CSV_BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
