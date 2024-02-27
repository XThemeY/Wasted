const PosterRating = ({ item }) => {
  return (
    <div
      className={`absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-lg border border-green-600 bg-dark-4 text-green-600`}
    >
      {item.ratings.wasted.rating !== 0
        ? item.ratings.wasted.rating.toFixed(1)
        : item.ratings.tmdb.raiting.toFixed(1)}
    </div>
  );
};

export default PosterRating;
