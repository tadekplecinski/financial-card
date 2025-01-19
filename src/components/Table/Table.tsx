import "./Table.scss";

export interface Column<T> {
  header?: string;
  render: (row: T) => React.ReactNode;
  id: string;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
}

export const Table = <T,>({ columns, data }: TableProps<T>) => {
  const showHeader = columns.some((col) => col.header);

  return (
    <table className="table">
      {showHeader && (
        <thead>
          <tr>
            {columns.map(({ header, id }) => (
              <th key={id} className="table__header">
                {header}
              </th>
            ))}
          </tr>
        </thead>
      )}
      <tbody>
        {data.map((rowData, i) => (
          <tr key={i}>
            {columns.map((column) => (
              <td key={column.id}>{column.render(rowData)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
