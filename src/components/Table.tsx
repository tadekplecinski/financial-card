import "./Table.scss";

export interface Column<T> {
  header: string;
  render: (row: T) => React.ReactNode;
  id: string;
}

interface TableProps<T extends { rowName?: string }> {
  columns: Column<T>[];
  data: T[];
  title?: string;
}

const Table = <T extends { rowName?: string }>({
  columns,
  data,
  title,
}: TableProps<T>) => {
  return (
    <div className="table">
      {title && <h4 className="title">{title}</h4>}
      <table>
        <thead>
          <tr>
            {columns.map(({ header }) => (
              <th key={header} className="header">
                {header}
              </th>
            ))}
          </tr>
        </thead>
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
    </div>
  );
};

export default Table;
