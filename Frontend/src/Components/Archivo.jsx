import React from "react";

export const Archivo = ({ partitura }) => {
  return (
    <embed
      style={{ marginBottom: "35px" }}
      src={`data:application/pdf;base64,${partitura}`}
      type="application/pdf"
      width="95%"
      height="600px"
      aria-label="archivo"
    />
  );
};
