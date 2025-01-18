import React from "react";
import "./CellContent.scss";

type CellContentProps = {
  children?: React.ReactNode;
  type?: "info" | "default";
};

const CellContent: React.FC<CellContentProps> = ({
  children,
  type = "default",
}) => {
  return (
    <div className={`cellContent ${type === "info" ? "info" : ""}`}>
      {children}
    </div>
  );
};

export default CellContent;
