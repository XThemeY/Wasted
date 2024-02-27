import ContentLoader from 'react-content-loader';

const PosterLoader = () => (
  <ContentLoader
    speed={2}
    width={180}
    height={270}
    viewBox="0 0 180 270"
    backgroundColor="#333333"
    foregroundColor="#404040"
  >
    <rect x="0" y="0" rx="8" ry="8" width="180" height="270" />
  </ContentLoader>
);

export default PosterLoader;
