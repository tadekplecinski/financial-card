import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFactorGradesData } from "./useFactorGradesData";

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

describe("useFactorGradesData", () => {
  it("should fetch data successfully for all endpoints", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: "nowData" }));
    fetchMock.mockResponseOnce(JSON.stringify({ data: "threeMonthsData" }));
    fetchMock.mockResponseOnce(JSON.stringify({ data: "sixMonthsData" }));

    const { result } = renderHook(() => useFactorGradesData(), { wrapper });

    await waitFor(() => expect(result.current.isPending).toBe(false));

    expect(result.current.nowData).toEqual({ data: "nowData" });
    expect(result.current.threeMonthsData).toEqual({ data: "threeMonthsData" });
    expect(result.current.sixMonthsData).toEqual({ data: "sixMonthsData" });
    expect(result.current.isError).toBe(false);
  });

  it("should handle error state for one or more endpoints", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({ error: "Something went wrong" }),
      { status: 500 }
    ); // Simulating error response
    fetchMock.mockResponseOnce(JSON.stringify({ data: "threeMonthsData" }));
    fetchMock.mockResponseOnce(JSON.stringify({ data: "sixMonthsData" }));

    const { result } = renderHook(() => useFactorGradesData(), { wrapper });

    await waitFor(() => expect(result.current.isPending).toBe(false));

    expect(result.current.isPending).toBe(false);
    expect(result.current.isError).toBe(true);
    expect(result.current.nowData).toBeUndefined();
    expect(result.current.threeMonthsData).toEqual({ data: "threeMonthsData" });
    expect(result.current.sixMonthsData).toEqual({ data: "sixMonthsData" });
  });

  it("should handle loading state while data is being fetched", async () => {
    fetchMock.mockResponseOnce(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve(JSON.stringify({ data: "nowData" })), 100)
        )
    ); // Simulate a delayed response for now

    fetchMock.mockResponseOnce(JSON.stringify({ data: "threeMonthsData" }));
    fetchMock.mockResponseOnce(JSON.stringify({ data: "sixMonthsData" }));

    const { result } = renderHook(() => useFactorGradesData(), { wrapper });

    expect(result.current.isPending).toBe(true);

    await waitFor(() => expect(result.current.isPending).toBe(false));

    expect(result.current.nowData).toEqual({ data: "nowData" });
    expect(result.current.threeMonthsData).toEqual({ data: "threeMonthsData" });
    expect(result.current.sixMonthsData).toEqual({ data: "sixMonthsData" });
    expect(result.current.isError).toBe(false);
  });
});
