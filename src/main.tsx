import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import FactorGradesGrid from "./FactorGrades/FactorGrades.tsx";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RatingsSummary from "./RatingsSummary/RatingsSummary.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RatingsSummary />
      <FactorGradesGrid />
    </QueryClientProvider>
  </StrictMode>
);
