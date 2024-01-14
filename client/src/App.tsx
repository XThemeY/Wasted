import { Routes, Route } from 'react-router-dom';
import LoginForm from '@/_auth/forms/LoginForm';
import RegisterForm from '@/_auth/forms/RegisterForm';
import AuthLayout from '@/_auth/AuthLayout';
import RootLayout from '@/_root/RootLayout';
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
} from '@/_root/pages';

const App = () => {
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
        <Route element={<RootLayout />}>
          <Route path="/shows" element={<UserShows />} />
          <Route path="/movies" element={<UserMovies />} />
          <Route path="/games" element={<UserGames />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/stats" element={<UserStats />} />
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
    </main>
  );
};

export default App;
