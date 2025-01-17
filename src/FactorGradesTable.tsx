export interface FactorGradesTableProps<T extends { rowName: string }> {
  columns: {
    header: string;
    render: (row: T) => string;
    id: string;
  }[];
  data: T[];
}

export const FactorGradesTable = <T extends { rowName: string }>({
  columns,
  data,
}: FactorGradesTableProps<T>) => {
  return (
    <table border={1}>
      <thead>
        <tr>
          <th>-----</th>
          {columns.map(({ header }) => (
            <th key={header}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((rowData, i) => (
          <tr key={i}>
            <td>{rowData.rowName}</td>
            {columns.map((column) => (
              <td key={column.id}>{column.render(rowData)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
