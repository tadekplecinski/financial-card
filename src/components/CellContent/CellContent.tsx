import classNames from "classnames";

import "./CellContent.scss";

// todo
// unit tests
// readme

export type CellContentProps = {
  children?: React.ReactNode;
  type?: "info";
  className?: string;
};

const CellContent: React.FC<CellContentProps> = ({
  children,
  type,
  className,
}) => {
  return (
    <div
      className={classNames("cellContent", className, {
        info: type === "info",
      })}
    >
      {children}
    </div>
  );
};

export default CellContent;
