import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import fetchMock from "jest-fetch-mock";
import RatingsGroup from "./RatingsGroup";

jest.mock("./Cards/SectorIndustryRanking/SectorIndustryRanking", () => () => (
  <div>SectorIndustryRanking Component</div>
));
jest.mock("./Cards/RatingsSummary", () => () => (
  <div>RatingsSummary Component</div>
));
jest.mock("./Cards/FactorGrades/FactorGrades", () => () => (
  <div>FactorGrades Component</div>
));
jest.mock("@/components/Error", () => ({
  ErrorMessage: () => <div>ErrorMessage Component</div>,
}));
jest.mock("@/components", () => ({
  Loader: () => <div>Loading...</div>,
}));

let queryClient: QueryClient;

beforeEach(() => {
  fetchMock.resetMocks();
  queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("RatingsGroup", () => {
  it("should display a loader when the query is pending", async () => {
    fetchMock.mockResponseOnce(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ body: "{}" }), 1000)
        )
    );

    render(<RatingsGroup />, { wrapper });

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("should display an error message when the query fails", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({ error: "Something went wrong" }), // Simulating error response
      { status: 500 }
    );

    render(<RatingsGroup />, { wrapper });

    await waitFor(() => screen.getByText("ErrorMessage Component"));
    expect(screen.getByText("ErrorMessage Component")).toBeInTheDocument();
  });

  it("should display premium content when the user is premium", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ premium: true }));

    render(<RatingsGroup />, { wrapper });

    // Wait for lazy-loaded components
    await waitFor(() => screen.getByText("RatingsSummary Component"));

    // Assert that premium components are displayed
    expect(screen.getByText("RatingsSummary Component")).toBeInTheDocument();
    expect(screen.getByText("FactorGrades Component")).toBeInTheDocument();

    // Assert that SectorIndustryRanking is also displayed
    expect(
      screen.getByText("SectorIndustryRanking Component")
    ).toBeInTheDocument();
  });

  it("should not display premium content when the user is not premium", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ premium: false }));

    render(<RatingsGroup />, { wrapper });

    // Wait for non-premium content
    await waitFor(() => screen.getByText("SectorIndustryRanking Component"));

    // Assert that premium components are NOT displayed
    expect(
      screen.queryByText("RatingsSummary Component")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("FactorGrades Component")
    ).not.toBeInTheDocument();

    // Assert that SectorIndustryRanking is displayed
    expect(
      screen.getByText("SectorIndustryRanking Component")
    ).toBeInTheDocument();
  });
});
