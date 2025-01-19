import { render, screen } from "@testing-library/react";

import { KeyValueDisplay, KeyValueDisplayProps } from "./KeyValueDisplay";

jest.mock("../CellContent/CellContent", () => {
  return jest.fn(({ children, className }) => (
    <div data-testid="CellContent" className={className}>
      {children}
    </div>
  ));
});

describe("KeyValueDisplay", () => {
  const renderComponent = (props: KeyValueDisplayProps) =>
    render(<KeyValueDisplay {...props} />);

  it("should render the correct number of key-value pairs", () => {
    const keyValues = {
      Name: "John Doe",
      Age: "30",
      Occupation: "Engineer",
    };

    renderComponent({ keyValues });

    expect(screen.getAllByTestId("CellContent")).toHaveLength(6); // 3 keys + 3 values
  });

  it("should render keys with the bold class", () => {
    const keyValues = {
      Name: "John Doe",
      Age: "30",
    };

    renderComponent({ keyValues });

    const keyElements = screen.getAllByText(/Name|Age/i);
    keyElements.forEach((keyElement) => {
      expect(keyElement).toHaveClass("bold");
    });
  });

  it("should render values with the align-right class", () => {
    const keyValues = {
      Name: "John Doe",
      Age: "30",
    };

    renderComponent({ keyValues });

    const valueElements = screen.getAllByText(/John Doe|30/i);
    valueElements.forEach((valueElement) => {
      expect(valueElement).toHaveClass("align-right");
    });
  });

  it("should render empty if no keyValues are provided", () => {
    renderComponent({ keyValues: {} });

    expect(screen.queryByTestId("CellContent")).not.toBeInTheDocument();
  });
});
