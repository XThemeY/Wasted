import { Routes, Route, useParams } from 'react-router-dom';
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
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import {
  faHouse,
  faTv,
  faGamepad,
  faFilm,
  faFire,
  faRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';

const App = () => {
  library.add(
    fab,
    faHouse,
    faTv,
    faGamepad,
    faFilm,
    faFire,
    faRightFromBracket,
  );
  const { username } = useParams();
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
          <Route path="/movies" element={<Movies />} />
          <Route path="/movies/:id" element={<MoviePage />} />
          <Route path="/shows" element={<Shows />} />
          <Route path="/shows/:id" element={<ShowPage />} />
          <Route path="/games" element={<Games />} />
          <Route path="/games/:id" element={<GamePage />} />
        </Route>

        {/* Private routes */}
        <Route element={<RequireAuth />}>
          <Route element={<RootLayout />}>
            <Route path="/:username/shows" element={<UserShows />} />
            <Route path="/:username/movies" element={<UserMovies />} />
            <Route path="/:username/games" element={<UserGames />} />
            <Route path="/:username/favorites" element={<Favorites />} />
            <Route path="/:username/stats" element={<UserStats />} />
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
