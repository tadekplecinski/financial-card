import { useQuery } from "@tanstack/react-query";

import { SectorIndustryRankingResponse } from "@/types";
import { fetchData } from "@/hooks/common";
import { Card, KeyValueDisplay, KeyValueDisplayProps } from "@/components";

import "./SectorIndustryRanking.scss";

const formatSectorIndustryRankingResponse = (
  data: SectorIndustryRankingResponse
): KeyValueDisplayProps["keyValues"] => {
  return {
    Sector: data.sector,
    Industry: data.industry,
    "Ranked Overall": (
      <span>
        <span className="bold">{data.rankings.overall.rank}</span>
        {" out of "}
        <span className="bold">{data.rankings.overall.total}</span>
      </span>
    ),
    "Ranked in Sector": (
      <span>
        <span className="bold">{data.rankings.sector.rank}</span>
        {" out of "}
        <span className="bold">{data.rankings.sector.total}</span>
      </span>
    ),
    "Ranked in Industry": (
      <span>
        <span className="bold">{data.rankings.industry_specific.rank}</span>
        {" out of "}
        <span className="bold">{data.rankings.industry_specific.total}</span>
      </span>
    ),
  };
};

const title = "Quant Ranking";

const SectorIndustryRanking: React.FC = () => {
  const { data, isPending, isError } = useQuery<SectorIndustryRankingResponse>({
    queryKey: ["quantRanking"],
    queryFn: () =>
      fetchData<SectorIndustryRankingResponse>(
        "https://seekingalpha.free.beeceptor.com/quant-ranking"
      ),
  });

  if (isPending) return <Card isLoading title={title} />;

  if (isError) {
    return <Card isError title={title} />;
  }

  const formattedData: KeyValueDisplayProps["keyValues"] =
    formatSectorIndustryRankingResponse(data);

  return (
    <Card title={title}>
      <KeyValueDisplay keyValues={formattedData} />
      <a
        target="_blank"
        href="https://quantnet.com/mfe-programs-rankings/"
        className="link"
      >
        Quant Rankings Beat The Market
      </a>
    </Card>
  );
};

export default SectorIndustryRanking;
