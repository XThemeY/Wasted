import { useParams } from 'react-router-dom';

const UserHome = () => {
  const { username } = useParams();
  return <div>{username}</div>;
};

export default UserHome;
