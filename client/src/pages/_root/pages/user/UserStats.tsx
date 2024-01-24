import { useGetAllUsersQuery } from '@/store/slices';

const UserStats = () => {
  const {
    data: users,
    isError,
    isLoading,
    isFetching,
  } = useGetAllUsersQuery(0, {
    refetchOnMountOrArgChange: true,
  });

  if (isLoading) return <div>Loading</div>;
  if (isFetching) return <div>Loading</div>;
  if (isError) return <div>Error</div>;
  if (users) {
    return (
      <div>
        <ul className="flex-col gap-3">
          {users?.items?.map((user) => <li key={user.id}>{user.username}</li>)}
        </ul>
      </div>
    );
  }
};

export default UserStats;
