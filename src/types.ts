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

export type FormattedResponse = FactorGrades3mResponse;
