import Welcome from '@/components/Welcome';
import NewMedia from '@/features/home/NewMedia';

const Home = () => {
  return (
    <div className="mx-1">
      <NewMedia />

      <Welcome />
    </div>
  );
};

export default Home;
