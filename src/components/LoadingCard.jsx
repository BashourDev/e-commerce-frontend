import React from "react";
import Lottie from "lottie-react";
import loadingAn from "../assets/lotties/loading-state-card.json";

const LoadingCard = ({ className = "self-center" }) => {
  return (
    <div className="flex justify-center items-center self-center">
      <Lottie animationData={loadingAn} loop className={className} />
    </div>
  );
};

export default LoadingCard;
