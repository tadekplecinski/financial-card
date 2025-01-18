import {
  FactorGrades3mResponse,
  FactorGrades6mResponse,
  FactorGradesNowResponse,
  FormattedResponse,
  Key,
  Rating,
} from "../types";

export interface FactorGradesRowData {
  rowName: string;
  now: string;
  threeMonths: string;
  sixMonths: string;
}

enum ColumnNames {
  now = "now",
  threeMonths = "threeMonths",
  six = "sixMonths",
}

export const formatNowResponse = (
  data: FactorGradesNowResponse
): FormattedResponse => {
  const formatted = {} as FactorGrades3mResponse;
  for (const key in data) {
    formatted[key as Key] = data[key as Key].current;
  }
  return formatted;
};

export const format6mResponse = (
  { data }: FactorGrades6mResponse,
  keys: Key[]
): FormattedResponse => {
  const factorGrades6mResponseMap = Object.fromEntries(data);
  return keys.reduce((acc, key) => {
    return { ...acc, [key]: factorGrades6mResponseMap[key] };
  }, {} as FormattedResponse);
};

export const mapKeysToRowsData = (
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
