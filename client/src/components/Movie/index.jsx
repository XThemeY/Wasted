import React from "react";
import { useParams } from "react-router-dom";
const Movie = function () {
  const { id } = useParams();
  return <div>ID: {id}</div>;
};
export default Movie;
