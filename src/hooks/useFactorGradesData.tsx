import { useQuery } from "@tanstack/react-query";
import {
  FactorGrades3mResponse,
  FactorGrades6mResponse,
  FactorGradesNowResponse,
} from "../types";
import { fetchData } from "./common";

const apiRootUrl = "https://seekingalpha.free.beeceptor.com/";

const endpoints = {
  now: "factor-grades/now",
  threeMonths: "factor-grades/3m",
  sixMonths: "factor-grades/6m",
};

export const useFactorGradesData = () => {
  const queries = {
    now: useQuery<FactorGradesNowResponse>({
      queryKey: ["factorGrades", "now"],
      queryFn: () =>
        fetchData<FactorGradesNowResponse>(`${apiRootUrl}${endpoints.now}`),
    }),
    threeMonths: useQuery<FactorGrades3mResponse>({
      queryKey: ["factorGrades", "3m"],
      queryFn: () =>
        fetchData<FactorGrades3mResponse>(
          `${apiRootUrl}${endpoints.threeMonths}`
        ),
    }),
    sixMonths: useQuery<FactorGrades6mResponse>({
      queryKey: ["factorGrades", "6m"],
      queryFn: () =>
        fetchData<FactorGrades6mResponse>(
          `${apiRootUrl}${endpoints.sixMonths}`
        ),
    }),
  };

  const isPending =
    queries.now.isPending ||
    queries.threeMonths.isPending ||
    queries.sixMonths.isPending;

  const isError =
    queries.now.isError ||
    queries.threeMonths.isError ||
    queries.sixMonths.isError;

  return {
    nowData: queries.now.data,
    threeMonthsData: queries.threeMonths.data,
    sixMonthsData: queries.sixMonths.data,
    isPending,
    isError,
  };
};
