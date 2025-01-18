import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RatingsGroup from "./RatingsGroup/RatingsGroup.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <div className="page">
        <div></div>
        <RatingsGroup />
      </div>
    </QueryClientProvider>
  </StrictMode>
);
