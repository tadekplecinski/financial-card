import { useQuery } from "@tanstack/react-query";
import {
  FactorGrades3mResponse,
  FactorGrades6mResponse,
  FactorGradesNowResponse,
  FormattedResponse,
  Key,
  Rating,
} from "./types";
import { FactorGradesTable, FactorGradesTableProps } from "./FactorGradesTable";

function formatNowResponse(data: FactorGradesNowResponse): FormattedResponse {
  const formatted = {} as FactorGrades3mResponse;
  for (const key in data) {
    formatted[key as Key] = data[key as Key].current;
  }
  return formatted;
}

function format6mResponse(
  { data }: FactorGrades6mResponse,
  keys: Key[]
): FormattedResponse {
  const factorGrades6mResponseMap = Object.fromEntries(data);
  return keys.reduce((acc, key) => {
    return { ...acc, [key]: factorGrades6mResponseMap[key] };
  }, {} as FormattedResponse);
}

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

const mapKeysToRows = (
  keys: Key[],
  formattedData: {
    [k in "now" | "threeMonths" | "sixMonths"]: Record<Key, Rating>;
  }
): FactorGradesRowData[] => {
  return keys.map((k) => ({
    ...Object.entries(formattedData).reduce<FactorGradesRowData>(
      (acc, [key, data]) => {
        return { ...acc, [key]: data[k] };
      },
      { rowName: k } as FactorGradesRowData
    ),
  }));
};

interface FactorGradesRowData {
  rowName: string;
  now: string;
  threeMonths: string;
  sixMonths: string;
}

const PerformanceTable: React.FC = () => {
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
    isPending: isPendingThreeMonths,
    isError: is3mError,
  } = useQuery<FactorGrades3mResponse>({
    queryKey: ["3m"],
    queryFn: () => fetchData(endpoints.threeMonths),
  });

  const {
    data: sixMonthsData,
    isPending: isPendingSixMonths,
    isError: is6mError,
  } = useQuery<FactorGrades6mResponse>({
    queryKey: ["6m"],
    queryFn: () => fetchData(endpoints.sixMonths),
  });

  if (isPendingNow || isPendingThreeMonths || isPendingSixMonths)
    return <div>Loading...</div>;

  if (isNowError || is3mError || is6mError) {
    return <div>Error...</div>;
  }

  const nowFormatted = formatNowResponse(nowData);

  // assume that keys for the now (and for 3m data) response are in correct order
  const keys = Object.keys(nowFormatted) as Key[];

  // pass the keys in correct order to properly structure the 6m response
  const sixMonthsFormatted = format6mResponse(sixMonthsData, keys);

  const rows: FactorGradesRowData[] = mapKeysToRows(keys, {
    now: nowFormatted,
    threeMonths: threeMonthsData,
    sixMonths: sixMonthsFormatted,
  });

  const columns: FactorGradesTableProps<FactorGradesRowData>["columns"] = [
    {
      header: "now",
      render: (row: FactorGradesRowData) => row.now,
      id: "now",
    },
    {
      header: "3m",
      render: (row: FactorGradesRowData) => row.threeMonths,
      id: "3m",
    },
    {
      header: "6m",
      render: (row: FactorGradesRowData) => row.sixMonths,
      id: "6m",
    },
  ];

  return <FactorGradesTable columns={columns} data={rows} />;
};

export default PerformanceTable;
