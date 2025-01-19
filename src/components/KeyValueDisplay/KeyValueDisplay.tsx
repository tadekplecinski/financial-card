import CellContent from "../CellContent/CellContent";
import "./KeyValueDisplay.scss";

export type KeyValueDisplayProps = {
  keyValues: Record<string, React.ReactNode>;
};

export const KeyValueDisplay: React.FC<KeyValueDisplayProps> = ({
  keyValues,
}) => {
  return (
    <>
      {Object.entries(keyValues).map(([key, value]) => (
        <div className="keyValue" key={key}>
          <CellContent className="bold">{key}</CellContent>
          <CellContent type="info" className="align-right">
            {value}
          </CellContent>
        </div>
      ))}
    </>
  );
};
