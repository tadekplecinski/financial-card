import { render, screen } from "@testing-library/react";

import FinancialAnalysis from "../FinancialAnalysis";

it("renders financial analysis component", () => {
  render(<FinancialAnalysis />);
  const card = screen.getByText(/financial analysis/i);
  expect(card).toBeInTheDocument();
});