import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import fetchMock from "jest-fetch-mock";
import SectorIndustryRanking from "./SectorIndustryRanking";
import { CardProps } from "@/components/Card/Card";

jest.mock("@/components", () => ({
  KeyValueDisplay: ({ keyValues }: { keyValues: [string, string] }) => (
    <div>
      {Object.entries(keyValues).map(([key, value]) => (
        <div key={key}>
          <strong>{key}:</strong> {value}
        </div>
      ))}
    </div>
  ),

  Card: ({ title, children, isLoading, isError }: CardProps) => (
    <div>
      <h1>{title}</h1>
      {isLoading && <div>Loading...</div>}
      {isError && <div>Error...</div>}
      {children}
    </div>
  ),
  Loader: () => <div>Loading...</div>,
  ErrorMessage: () => <div>Error...</div>,
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

describe("SectorIndustryRanking", () => {
  it("should display loading state while the query is pending", async () => {
    fetchMock.mockResponseOnce(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ body: "{}" }), 1000)
        )
    );

    render(<SectorIndustryRanking />, { wrapper });

    expect(screen.getByText("Quant Ranking")).toBeInTheDocument();
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("should display an error message when the query fails", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({ error: "Something went wrong" }),
      { status: 500 }
    );

    render(<SectorIndustryRanking />, { wrapper });

    await waitFor(() => screen.getByText("Error..."));
  });

  it("should display formatted data when the query is successful", async () => {
    const mockData = {
      sector: "Technology",
      industry: "Software",
      rankings: {
        overall: { rank: 10, total: 100 },
        sector: { rank: 5, total: 50 },
        industry_specific: { rank: 3, total: 20 },
      },
    };

    fetchMock.mockResponseOnce(JSON.stringify(mockData));

    render(<SectorIndustryRanking />, { wrapper });

    await waitForElementToBeRemoved(() => screen.getByText("Loading..."));

    expect(screen.getByText("Quant Ranking")).toBeInTheDocument();
    expect(screen.getByText(/Technology/)).toBeInTheDocument();
    expect(screen.getByText(/Software/)).toBeInTheDocument();
    expect(
      screen.getByText((_, element) => element!.textContent === "10 out of 100")
    ).toBeInTheDocument();
    expect(
      screen.getByText((_, element) => element!.textContent === "5 out of 50")
    ).toBeInTheDocument();
    expect(
      screen.getByText((_, element) => element!.textContent === "3 out of 20")
    ).toBeInTheDocument();
  });
});
