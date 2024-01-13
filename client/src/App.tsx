import { Routes, Route } from 'react-router-dom';
import SigninForm from '@/_auth/forms/LoginForm';
import SignupForm from '@/_auth/forms/RegisterForm';
import { Home } from '@/_root/pages';
import AuthLayout from '@/_auth/AuthLayout';
import RootLayout from '@/_root/RootLayout';

const App = () => {
  return (
    <main className="flex h-screen">
      <Routes>
        {/* Public routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<SigninForm />} />
          <Route path="/registration" element={<SignupForm />} />
        </Route>
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
        </Route>

        {/* Private routes */}

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
