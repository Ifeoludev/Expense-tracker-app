import React from "react";

function LoadingSpinner({ size = "md", text = "Loading..." }) {
  return (
    <div className="loading-container">
      <div className={`spinner spinner-${size}`}></div>
      {text && <p className="loading-text">{text}</p>}
    </div>
  );
}

export default LoadingSpinner;
