import { Key } from "../types";
import Table, { Column } from "../components/Table";
import Card from "../components/Card";
import CellContent from "../components/CellContent";
import { useFactorGradesData } from "../useFactorGradesData";
import {
  FactorGradesRowData,
  format6mResponse,
  formatNowResponse,
  mapKeysToRowsData,
} from "./utils";

const FactorGradesGrid: React.FC = () => {
  const { nowData, threeMonthsData, sixMonthsData, isPending, isError } =
    useFactorGradesData();

  if (isPending || !nowData || !threeMonthsData || !sixMonthsData)
    return <Card isLoading />;

  if (isError) {
    return <Card isError />;
  }

  const nowResponseFormatted = formatNowResponse(nowData);

  // assume that keys for the now (and for 3m data) response are in correct order
  // also assume that JS preserves the order keys in objects...
  const keys = Object.keys(nowResponseFormatted) as Key[];

  // pass the keys in correct order to properly structure the 6m response
  const sixMonthsResponseFormatted = format6mResponse(sixMonthsData, keys);

  const data: FactorGradesRowData[] = mapKeysToRowsData(keys, {
    now: nowResponseFormatted,
    threeMonths: threeMonthsData,
    sixMonths: sixMonthsResponseFormatted,
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
