export type FactorGradesKey =
  | "Growth"
  | "Profitability"
  | "Valuation"
  | "Momentum"
  | "Revisions";

export type RatingsSummaryKey = "SA_Analysts" | "Wall_Street" | "Quant";

export type Rating = string;

export type FactorGradesNowResponse = Record<
  FactorGradesKey,
  { current: Rating }
>;
export type FactorGrades3mResponse = Record<FactorGradesKey, Rating>;
export type FactorGrades6mResponse = {
  data: [FactorGradesKey, Rating][];
};

export type RatingsSummaryResponse = Record<
  RatingsSummaryKey,
  { rating: string; score: number }
>;

interface Ranking {
  rank: number;
  total: number;
}

export interface SectorIndustryRankingResponse {
  sector: string;
  industry: string;
  rankings: {
    overall: Ranking;
    sector: Ranking;
    industry_specific: Ranking;
  };
}

export interface UserResponse {
  premium: boolean;
}

// update name like ResponseFormattedForTable or sth?
export type FormattedResponse = FactorGrades3mResponse;
