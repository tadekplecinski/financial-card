import { render, screen } from "@testing-library/react";
import { Table, TableProps } from "./Table";

describe("Table", () => {
  type TestData = { name: string; age: number };

  const columns = [
    { id: "name", header: "Name", render: (row: TestData) => row.name },
    { id: "age", header: "Age", render: (row: TestData) => row.age },
  ];

  const data: TestData[] = [
    { name: "John Doe", age: 30 },
    { name: "Jane Smith", age: 25 },
  ];

  const renderTable = (props: TableProps<TestData>) =>
    render(<Table {...props} />);

  it("should render a table element", () => {
    renderTable({ columns, data });

    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  it("should render the table header if headers are provided", () => {
    renderTable({ columns, data });

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Age")).toBeInTheDocument();
  });

  it("should not render the table header if no headers are provided", () => {
    const columnsWithoutHeaders = [
      { id: "name", render: (row: TestData) => row.name },
      { id: "age", render: (row: TestData) => row.age },
    ];

    renderTable({ columns: columnsWithoutHeaders, data });

    expect(screen.queryByRole("columnheader")).not.toBeInTheDocument();
  });

  it("should render the correct number of rows", () => {
    renderTable({ columns, data });

    const rows = screen.getAllByRole("row");
    expect(rows).toHaveLength(data.length + 1);
  });

  it("should render the correct data in each cell", () => {
    renderTable({ columns, data });

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("30")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("25")).toBeInTheDocument();
  });

  it("should render empty if no data is provided", () => {
    renderTable({ columns, data: [] });

    const rows = screen.getAllByRole("row");
    expect(rows).toHaveLength(1);
  });

  it("should render nothing if no columns are provided", () => {
    renderTable({ columns: [], data });

    // Ensure no table rows or headers are rendered
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });
});
