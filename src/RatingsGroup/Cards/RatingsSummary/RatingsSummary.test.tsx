import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import fetchMock from "jest-fetch-mock";

import { CardProps } from "@/components/Card/Card";
import RatingsSummary, { formatRatingsSummaryResponse } from "./RatingsSummary";
import { CellContentProps } from "@/components/CellContent/CellContent";

jest.mock("@/components", () => ({
  Card: ({ title, children, isLoading, isError }: CardProps) => (
    <div>
      <h1>{title}</h1>
      {isLoading && <div>Loading...</div>}
      {isError && <div>Error...</div>}
      {children}
    </div>
  ),
  CellContent: ({ children }: CellContentProps) => <div>{children}</div>,
}));

let queryClient: QueryClient;

beforeEach(() => {
  queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  fetchMock.resetMocks();
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("RatingsSummary", () => {
  it("should display a loading card when the query is pending", async () => {
    fetchMock.mockResponseOnce(() => new Promise(() => {})); // Mock pending response

    render(<RatingsSummary />, { wrapper });

    // Assert the loader card is displayed
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("should display an error card when the query fails", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({ error: "Something went wrong" }),
      { status: 500 }
    );

    render(<RatingsSummary />, { wrapper });

    await waitFor(() => screen.getByText("Error..."));
  });

  it("should format the data to be suitable for a table to consume (formatRatingsSummaryResponse)", async () => {
    const mockData = {
      SA_Analysts: { rating: "A", score: 90 },
      Wall_Street: { rating: "B", score: 80 },
      Quant: { rating: "C", score: 70 },
    };

    const formatted = formatRatingsSummaryResponse(mockData);
    expect(formatted[0]).toMatchObject({
      entity: "SA_Analysts",
      rating: "A",
      score: 90,
    });
    expect(formatted[1]).toMatchObject({
      entity: "Wall_Street",
      rating: "B",
      score: 80,
    });
    expect(formatted[2]).toMatchObject({
      entity: "Quant",
      rating: "C",
      score: 70,
    });
  });
});
