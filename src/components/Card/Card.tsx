import Loader from "../Loader/Loader";
import "./Card.scss";

type CardProps = {
  title?: string;
  children?: React.ReactNode;
  isLoading?: boolean;
  isError?: boolean;
};

const Card: React.FC<CardProps> = ({ children, isLoading, isError, title }) => {
  let content;

  if (isLoading) {
    content = <Loader />;
  } else if (isError) {
    content = <div className="card">Error :(</div>;
  } else {
    content = children;
  }
  return (
    <div className="card">
      {title && <h4 className="card__title">{title}</h4>}
      {content}
    </div>
  );
};

export default Card;
