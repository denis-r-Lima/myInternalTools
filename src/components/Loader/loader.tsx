import React from "react";

import "./styles.css";

const Loading: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 scroll-m-0 w-screen z-50 loaderContainer">
      <span className="loader" />
    </div>
  );
};

export default Loading;
