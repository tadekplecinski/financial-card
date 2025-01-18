import {
  FactorGrades6mResponse,
  FactorGradesNowResponse,
  FormattedResponse,
  FactorGradesKey,
} from "../../types";

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
  const formatted = {} as FormattedResponse;
  for (const key in data) {
    formatted[key as FactorGradesKey] = data[key as FactorGradesKey].current;
  }
  return formatted;
};

export const format6mResponse = (
  { data }: FactorGrades6mResponse,
  keys: FactorGradesKey[]
): FormattedResponse => {
  const factorGrades6mResponseMap = Object.fromEntries(data);
  return keys.reduce(
    (acc, key) => ({ ...acc, [key]: factorGrades6mResponseMap[key] }),
    {} as FormattedResponse
  );
};

export const mapKeysToRowsData = (
  keys: FactorGradesKey[],
  formattedData: {
    [k in ColumnNames]: FormattedResponse;
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
