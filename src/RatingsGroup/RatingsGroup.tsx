import { lazy, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";

import { Loader } from "@/components";
import { fetchData } from "@/hooks";
import { ErrorMessage } from "@/components/Error";

import { UserResponse } from "../types";
import SectorIndustryRanking from "./Cards/SectorIndustryRanking/SectorIndustryRanking";
import "./RatingsGroup.scss";

const RatingsSummary = lazy(() => import("./Cards/RatingsSummary"));
const FactorGrades = lazy(() => import("./Cards/FactorGrades/FactorGrades"));

const RatingsGroup: React.FC = () => {
  const { data, isPending, isError } = useQuery<UserResponse>({
    queryKey: ["user"],
    queryFn: () =>
      fetchData<UserResponse>("https://seekingalpha.free.beeceptor.com/user"),
  });

  if (isPending) {
    return (
      <div className="ratingsGroup">
        <Loader />
      </div>
    );
  }

  if (isError) {
    return <ErrorMessage />;
  }

  const isPremium = data.premium;

  return (
    <div className="ratingsGroup">
      {isPremium && (
        <Suspense fallback={<Loader />}>
          <RatingsSummary />
          <FactorGrades />
        </Suspense>
      )}
      <SectorIndustryRanking />
    </div>
  );
};

export default RatingsGroup;
