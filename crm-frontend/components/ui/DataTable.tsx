import { TableSkeleton } from "./Skeleton";
import { InboxIcon } from "lucide-react";

interface Column<T = Record<string, unknown>> {
  key: string;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render?: (row: T | any) => React.ReactNode;
  width?: string;
}

interface DataTableProps<T = Record<string, unknown>> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: Column<any>[];
  data: T[];
  loading?: boolean;
  keyField?: string;
  pagination?: {
    page: number;
    pages: number;
    total: number;
    limit: number;
    onPageChange: (page: number) => void;
  };
  emptyMessage?: string;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  loading,
  keyField = "id",
  pagination,
  emptyMessage = "No records found",
}: DataTableProps<T>) {
  return (
    <div className="glass-card" style={{ overflow: "hidden" }}>
      <div className="data-table-wrapper" style={{ border: "none", borderRadius: 0 }}>
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} style={col.width ? { width: col.width } : undefined}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <TableSkeleton rows={6} cols={columns.length} />
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
                  <div className="empty-state">
                    <InboxIcon size={40} color="var(--text-muted)" />
                    <h4>{emptyMessage}</h4>
                    <p className="text-xs text-muted">Try adjusting your filters</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={String(row[keyField])}>
                  {columns.map((col) => (
                    <td key={col.key}>
                      {col.render
                        ? col.render(row)
                        : String(row[col.key] ?? "—")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && pagination.pages > 0 && (
        <div className="pagination">
          <span>
            Showing {Math.min((pagination.page - 1) * pagination.limit + 1, pagination.total)}–
            {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
          </span>
          <div className="pagination-btns">
            <button
              className="pagination-btn"
              disabled={pagination.page <= 1}
              onClick={() => pagination.onPageChange(pagination.page - 1)}
            >
              ‹
            </button>
            {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => {
              const p = i + 1;
              return (
                <button
                  key={p}
                  className={`pagination-btn ${p === pagination.page ? "active" : ""}`}
                  onClick={() => pagination.onPageChange(p)}
                >
                  {p}
                </button>
              );
            })}
            <button
              className="pagination-btn"
              disabled={pagination.page >= pagination.pages}
              onClick={() => pagination.onPageChange(pagination.page + 1)}
            >
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
