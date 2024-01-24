import { Routes, Route } from 'react-router-dom';
import LoginForm from '@/pages/_auth/forms/LoginForm';
import RegisterForm from '@/pages/_auth/forms/RegisterForm';
import AuthLayout from '@/pages/_auth/AuthLayout';
import RootLayout from '@/pages/_root/RootLayout';
import {
  Home,
  Movies,
  MoviePage,
  Shows,
  ShowPage,
  Games,
  GamePage,
  UserShows,
  UserMovies,
  UserGames,
  Favorites,
  UserStats,
} from '@/pages/_root/pages/';
import { Toaster } from '@/components/ui/toaster';
import RequireAuth from '@/features/auth/RequireAuth';
import { useEffect } from 'react';
import { useCheckLoginQuery, setCredentials } from '@/store/slices';
import { IAuthRes } from '../types';
import { useAppDispatch } from '@/hooks/redux';

const App = () => {
  const { data, isSuccess } = useCheckLoginQuery();
  const dispatch = useAppDispatch();
  useEffect(() => {
    try {
      if (localStorage.getItem('access_token') && isSuccess) {
        dispatch(setCredentials({ ...data } as IAuthRes));
      }
    } catch (e) {
      console.log(e);
    }
  });

  return (
    <main className="flex h-screen">
      <Routes>
        {/* Public routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/registration" element={<RegisterForm />} />
        </Route>
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="/movie" element={<Movies />} />
          <Route path="/movie/:id" element={<MoviePage />} />
          <Route path="/show" element={<Shows />} />
          <Route path="/show/:id" element={<ShowPage />} />
          <Route path="/game" element={<Games />} />
          <Route path="/game/:id" element={<GamePage />} />
        </Route>

        {/* Private routes */}
        <Route element={<RequireAuth />}>
          <Route element={<RootLayout />}>
            <Route path="/shows" element={<UserShows />} />
            <Route path="/movies" element={<UserMovies />} />
            <Route path="/games" element={<UserGames />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/users" element={<UserStats />} />
          </Route>
        </Route>
        {/* <Route path="/" element={<MainPage />} />
			<Route path="/auth/login" element={<Login />} />
			
			<Route path="movie" element={<MainMovies />} />
			<Route path="movie/:id" element={<Movie />} />
			<Route path="tvshow" element={<MainShows />} />
			<Route path="tvshow/:id" element={'tvshow ID'} />
			<Route path="game" element={<MainGames />} />
			<Route path="game/:id" element={'game ID'} />

			<Route path="*" element={<ErrorPage />} /> */}
      </Routes>
      <Toaster />
    </main>
  );
};

export default App;
