export type Key =
  | "Growth"
  | "Profitability"
  | "Valuation"
  | "Momentum"
  | "Revisions";

export type Rating = string;

export type FactorGradesNowResponse = Record<Key, { current: Rating }>;
export type FactorGrades3mResponse = Record<Key, Rating>;
export type FactorGrades6mResponse = {
  data: [Key, Rating][];
};

export type FormattedResponse = FactorGrades3mResponse;
