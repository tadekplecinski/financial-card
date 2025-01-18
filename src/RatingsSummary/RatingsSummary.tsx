import Table, { Column } from "../components/Table";
import Card from "../components/Card";
import CellContent from "../components/CellContent";
import { useQuery } from "@tanstack/react-query";
import { RatingsSummaryResponse } from "../types";

interface RatingsSummaryRowData {
  entity: string;
  rating: string;
  score: number;
}

const formatRatingsSummaryResponse = (
  data: RatingsSummaryResponse
): RatingsSummaryRowData[] => {
  return Object.entries(data).map(([key, { rating, score }]) => {
    return { entity: key, rating, score };
  }, []);
};

async function fetchData<T>(): Promise<T> {
  const response = await fetch(
    "https://seekingalpha.free.beeceptor.com/ratings-summary"
  );
  if (!response.ok) {
    throw new Error(
      `Network response was not ok: ${response.status} ${response.statusText}`
    );
  }

  const data: T = await response.json();
  return data;
}

const RatingsSummary: React.FC = () => {
  const { data, isPending, isError } = useQuery<RatingsSummaryResponse>({
    queryKey: ["ratingsSummary"],
    queryFn: () => fetchData<RatingsSummaryResponse>(),
  });

  if (isPending) return <Card isLoading />;

  if (isError) {
    return <Card isError />;
  }

  const formattedData: RatingsSummaryRowData[] =
    formatRatingsSummaryResponse(data);

  const columns: Column<RatingsSummaryRowData>[] = [
    {
      render: (row) => (
        <CellContent type="info">{row.entity.replace("_", " ")}</CellContent>
      ),
      id: "entity",
    },
    {
      render: (row) => <CellContent>{row.rating}</CellContent>,
      id: "rating",
    },
    {
      render: (row) => <CellContent>{row.score.toFixed(2)}</CellContent>,
      id: "score",
    },
  ];

  return (
    <Card>
      <Table columns={columns} data={formattedData} title="Ratings Summary" />
    </Card>
  );
};

export default RatingsSummary;
