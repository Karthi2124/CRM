/**
 * Generates a comma-separated values (CSV) string from a list of records.
 * Automatically maps keys as headers and handles escaping, quoting, and newlines.
 * 
 * @param data Array of objects representing rows.
 */
export function convertToCsv(data: Record<string, any>[]): string {
  if (!data || data.length === 0) {
    return '';
  }

  const headers = Object.keys(data[0]);
  const headerRow = headers.map(escapeCsvValue).join(',');

  const rows = data.map((row) => {
    return headers.map((header) => escapeCsvValue(row[header])).join(',');
  });

  return [headerRow, ...rows].join('\r\n');
}

/**
 * Escapes values containing commas, quotes, or newlines by wrapping them in quotes
 * and escaping inner double quotes.
 */
function escapeCsvValue(val: any): string {
  if (val === undefined || val === null) {
    return '""';
  }

  const str = String(val);
  const needsQuotes = str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r');
  
  if (needsQuotes) {
    // Replace all double quotes with double-double quotes
    return `"${str.replace(/"/g, '""')}"`;
  }
  
  return str;
}
