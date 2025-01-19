import {
  FactorGrades6mResponse,
  FactorGradesKey,
  FactorGradesNowResponse,
  FormattedResponse,
} from "@/types";
import {
  format6mResponse,
  formatNowResponse,
  mapKeysToRowsData,
} from "./utils";

it("should correctly format the now response", () => {
  const data: FactorGradesNowResponse = {
    Growth: { current: "A" },
    Profitability: { current: "B" },
    Valuation: { current: "C" },
    Momentum: { current: "D" },
    Revisions: { current: "E" },
  };

  const expected: FormattedResponse = {
    Growth: "A",
    Profitability: "B",
    Valuation: "C",
    Momentum: "D",
    Revisions: "E",
  };

  const result = formatNowResponse(data);

  expect(result).toEqual(expected);
});

it("should correctly map 6-month response to the expected format", () => {
  const data: FactorGrades6mResponse = {
    data: [
      ["Momentum", "D"],
      ["Profitability", "B"],
      ["Valuation", "C"],
      ["Revisions", "E"],
      ["Growth", "A"],
    ],
  };

  // keys in the expected order
  const keys: FactorGradesKey[] = [
    "Growth",
    "Profitability",
    "Valuation",
    "Momentum",
    "Revisions",
  ];

  const expected: FormattedResponse = {
    Growth: "A",
    Profitability: "B",
    Valuation: "C",
    Momentum: "D",
    Revisions: "E",
  };

  const result = format6mResponse(data, keys);

  expect(result).toEqual(expected);
});

it("should map keys to rows data with corresponding values for each column", () => {
  const keys: FactorGradesKey[] = [
    "Growth",
    "Profitability",
    "Valuation",
    "Momentum",
    "Revisions",
  ];

  const formattedData = {
    now: {
      Growth: "A",
      Profitability: "B",
      Valuation: "C",
      Momentum: "F",
      Revisions: "F",
    },
    threeMonths: {
      Growth: "B",
      Profitability: "C",
      Valuation: "D",
      Momentum: "D",
      Revisions: "D",
    },
    sixMonths: {
      Growth: "C",
      Profitability: "D",
      Valuation: "E",
      Momentum: "B",
      Revisions: "B",
    },
  };

  const expected = [
    {
      rowName: "Growth",
      now: "A",
      threeMonths: "B",
      sixMonths: "C",
    },
    {
      rowName: "Profitability",
      now: "B",
      threeMonths: "C",
      sixMonths: "D",
    },
    {
      rowName: "Valuation",
      now: "C",
      threeMonths: "D",
      sixMonths: "E",
    },
    {
      rowName: "Momentum",
      now: "F",
      threeMonths: "D",
      sixMonths: "B",
    },
    {
      rowName: "Revisions",
      now: "F",
      threeMonths: "D",
      sixMonths: "B",
    },
  ];

  const result = mapKeysToRowsData(keys, formattedData);

  expect(result).toEqual(expected);
});
