import { useQuery } from "@tanstack/react-query";
import {
  FactorGrades3mResponse,
  FactorGrades6mResponse,
  FactorGradesNowResponse,
} from "./types";

const apiRootUrl = "https://seekingalpha.free.beeceptor.com/";

const endpoints = {
  now: "factor-grades/now",
  threeMonths: "factor-grades/3m",
  sixMonths: "factor-grades/6m",
};

const fetchData = async (endpoint: string) => {
  const response = await fetch(`${apiRootUrl}${endpoint}`);
  if (!response.ok) throw new Error("Network response was not ok");
  return response.json();
};

export const useFactorGradesData = () => {
  const {
    data: nowData,
    isPending: isPendingNow,
    isError: isNowError,
  } = useQuery<FactorGradesNowResponse>({
    queryKey: ["now"],
    queryFn: () => fetchData(endpoints.now),
  });

  const {
    data: threeMonthsData,
    isPending: isPending3m,
    isError: is3mError,
  } = useQuery<FactorGrades3mResponse>({
    queryKey: ["3m"],
    queryFn: () => fetchData(endpoints.threeMonths),
  });

  const {
    data: sixMonthsData,
    isPending: isPending6m,
    isError: is6mError,
  } = useQuery<FactorGrades6mResponse>({
    queryKey: ["6m"],
    queryFn: () => fetchData(endpoints.sixMonths),
  });

  return {
    nowData,
    threeMonthsData,
    sixMonthsData,
    isPending: isPendingNow || isPending3m || isPending6m,
    isError: isNowError,
    is3mError,
    is6mError,
  };
};
