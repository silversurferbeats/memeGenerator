import React from "react";

export const Meme = ({ template, onClick }) => {
  return (
    <img
      style={{ width: 300 }}
      src={template.url}
      alt={template.name}
      onClick={onClick}
      download
    />
  );
};
