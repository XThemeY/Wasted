import { useGetNewMediaQuery } from '@/store/slices';
import Slider from '@/components/Slider';

const NewMovies = () => {
  const { data: items, isError, isLoading } = useGetNewMediaQuery(0);

  if (isLoading) return <div>Loading</div>;
  if (isError) return <div>Error</div>;
  if (items) {
    return <Slider items={items} title={'Новинки'} />;
  }
};

export default NewMovies;
