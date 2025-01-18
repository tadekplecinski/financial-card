import { useQuery } from "@tanstack/react-query";
import {
  FactorGrades3mResponse,
  FactorGrades6mResponse,
  FactorGradesNowResponse,
  FormattedResponse,
  Key,
  Rating,
} from "./types";
import Table, { Column } from "./components/Table";
import Card from "./components/Card";
import CellContent from "./components/CellContent";

enum ColumnNames {
  now = "now",
  threeMonths = "threeMonths",
  six = "sixMonths",
}

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

const mapKeysToRowsData = (
  keys: Key[],
  formattedData: {
    [k in ColumnNames]: Record<Key, Rating>;
  }
): FactorGradesRowData[] =>
  keys.map((k) => ({
    ...Object.entries(formattedData).reduce<FactorGradesRowData>(
      (acc, [key, data]) => {
        return { ...acc, [key]: data[k] };
      },
      { rowName: k } as FactorGradesRowData
    ),
  }));

interface FactorGradesRowData {
  rowName: string;
  now: string;
  threeMonths: string;
  sixMonths: string;
}

const FactorGradesGrid: React.FC = () => {
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

  if (isPendingNow || isPending3m || isPending6m) return <Card isLoading />;

  if (isNowError || is3mError || is6mError) {
    return <Card isError />;
  }

  const nowFormatted = formatNowResponse(nowData);

  // assume that keys for the now (and for 3m data) response are in correct order
  // also assume that JS preserves the order keys in objects...
  const keys = Object.keys(nowFormatted) as Key[];

  // pass the keys in correct order to properly structure the 6m response
  const sixMonthsFormatted = format6mResponse(sixMonthsData, keys);

  const data: FactorGradesRowData[] = mapKeysToRowsData(keys, {
    now: nowFormatted,
    threeMonths: threeMonthsData,
    sixMonths: sixMonthsFormatted,
  });

  const columns: Column<FactorGradesRowData>[] = [
    {
      header: "",
      render: (row) => <CellContent type="info">{row.rowName}</CellContent>,
      id: "nowName",
    },
    {
      header: "Now",
      render: (row) => <CellContent>{row.now}</CellContent>,
      id: "now",
    },
    {
      header: "3M ago",
      render: (row) => <CellContent>{row.threeMonths}</CellContent>,
      id: "3m",
    },
    {
      header: "6M ago",
      render: (row) => <CellContent>{row.sixMonths}</CellContent>,
      id: "6m",
    },
  ];

  return (
    <Card>
      <Table columns={columns} data={data} title="Factor Grades" />
    </Card>
  );
};

export default FactorGradesGrid;
