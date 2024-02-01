import React from "react";

export const Meme = ({ template, onClick }) => {
  return (
    <img
      style={{ width: 300, maxHeight: "20rem"  }}
      src={template.url}
      alt={template.name}
      onClick={onClick}
      download
    />
  );
};
