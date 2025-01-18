// fetch user
// -> lazy load 'premium' cards
// display cards

import { lazy, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";

import { fetchData } from "../hooks/common";
import { UserResponse } from "../types";
import Loader from "../components/Loader/Loader";
import SectorIndustryRanking from "../SectorIndustryRanking/SectorIndustryRanking";
import "./RatingsGroup.scss";

const RatingsSummary = lazy(() => import("../RatingsSummary/RatingsSummary"));
const FactorGrades = lazy(() => import("../FactorGrades/FactorGrades"));

const RatingsGroup: React.FC = () => {
  const { data, isPending, isError } = useQuery<UserResponse>({
    queryKey: ["user"],
    queryFn: () =>
      fetchData<UserResponse>("https://seekingalpha.free.beeceptor.com/user"),
  });

  if (isPending) return <Loader />;

  if (isError) {
    return <div>An error occurred... Try again later</div>;
  }

  const isPremium = data.premium;

  return (
    <div className="ratings-group">
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
