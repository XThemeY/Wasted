import { useAppSelector } from '@/hooks/redux';
import { selectCurrentUser, selectCurrentID } from '@/store/slices/userSlice';

const Welcome = () => {
  const user = useAppSelector(selectCurrentUser);
  const id = useAppSelector(selectCurrentID);

  const welcome = user ? `Welcome ${user}!` : 'Welcome!';
  const tokenAbbr = `${localStorage.getItem('access_token')}...`;

  return (
    <section className="m-3 flex flex-col  justify-center gap-3  ">
      <h1>{welcome}</h1>
      <p className="max-w-[600px] overflow-hidden overflow-ellipsis whitespace-nowrap">
        Token: {tokenAbbr}
      </p>
      <p>ID: {id}</p>
    </section>
  );
};

export default Welcome;
