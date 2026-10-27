interface DataTableProps {
  caption: string
  columns: string[]
  rows: string[][]
  /** Index of a column to emphasise, e.g. the amount payable. */
  highlightColumn?: number
  note?: string
}

/** Accessible table that scrolls sideways inside its own frame on small screens. */
export function DataTable({ caption, columns, rows, highlightColumn, note }: DataTableProps) {
  return (
    <figure className="data-table">
      <div className="data-table__scroll" tabIndex={0} role="region" aria-label={`${caption} (scrollable)`}>
        <table>
          <caption className="visually-hidden">{caption}</caption>
          <thead>
            <tr>
              {columns.map((col, i) => (
                <th key={col} scope="col" className={i === highlightColumn ? 'is-highlight' : undefined}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row[0]}>
                {row.map((cell, i) =>
                  i === 0 ? (
                    <th key={i} scope="row">
                      {cell}
                    </th>
                  ) : (
                    <td key={i} className={i === highlightColumn ? 'is-highlight' : undefined}>
                      {cell}
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {note && <figcaption className="data-table__note">{note}</figcaption>}
    </figure>
  )
}
