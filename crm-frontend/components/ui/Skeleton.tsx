export function Skeleton({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return <div className={`skeleton ${className}`} style={style} />;
}

export function TableSkeleton({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i}>
          {Array.from({ length: cols }).map((_, j) => (
            <td key={j} style={{ padding: "0.875rem 1rem" }}>
              <Skeleton style={{ height: "16px", width: j === 0 ? "140px" : "80px" }} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export function CardSkeleton() {
  return (
    <div className="kpi-card">
      <Skeleton style={{ height: "40px", width: "40px", borderRadius: "10px" }} />
      <Skeleton style={{ height: "28px", width: "100px" }} />
      <Skeleton style={{ height: "14px", width: "80px" }} />
    </div>
  );
}
