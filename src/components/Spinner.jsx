import React from "react";

const Spinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-green-500 border-t-transparent"></div>
    </div>
  );
};

export default Spinner;
