import { useQuery } from "@tanstack/react-query";

import { Card, CellContent, Column, Table } from "@/components";
import { fetchData } from "@/hooks";

import { RatingsSummaryResponse } from "../../../types";

export interface RatingsSummaryRowData {
  entity: string;
  rating: string;
  score: number;
}

export const formatRatingsSummaryResponse = (
  data: RatingsSummaryResponse
): RatingsSummaryRowData[] => {
  return Object.entries(data).map(([key, { rating, score }]) => {
    return { entity: key, rating, score };
  }, []);
};

const RatingsSummary: React.FC = () => {
  const { data, isPending, isError } = useQuery<RatingsSummaryResponse>({
    queryKey: ["ratingsSummary"],
    queryFn: () =>
      fetchData<RatingsSummaryResponse>(
        "https://seekingalpha.free.beeceptor.com/ratings-summary"
      ),
  });

  if (isPending) return <Card isLoading title="Ratings Summary" />;

  if (isError) {
    return <Card isError title="Ratings Summary" />;
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
    <Card title="Ratings Summary">
      <Table columns={columns} data={formattedData} />
    </Card>
  );
};

export default RatingsSummary;
