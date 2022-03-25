import React from "react";

export const Meme = ({ template, onClick }) => {
  return (
    <img
      style={{ width: 200 }}
      src={template.url}
      alt={template.name}
      onClick={onClick}
      download
    />
  );
};
