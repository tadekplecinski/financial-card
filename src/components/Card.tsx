import React from "react";
import "./Card.scss";

type CardProps = {
  children?: React.ReactNode;
  isLoading?: boolean;
  isError?: boolean;
};

const Card: React.FC<CardProps> = ({ children, isLoading, isError }) => {
  if (isLoading) {
    return <div className="card">Loading...</div>;
  }

  if (isError) {
    return <div className="card">Error :(</div>;
  }
  return <div className="card">{children}</div>;
};

export default Card;
