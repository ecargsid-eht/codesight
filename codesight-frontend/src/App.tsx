
import { useUser } from '@clerk/clerk-react'
import { Navigate, Route, Routes } from 'react-router';
import HomePage from './pages/HomePage';
import ProblemsPage from './pages/ProblemsPage';
import { Toaster } from 'react-hot-toast';
// import Footer from './components/Footer';
import ProblemPage from './pages/ProblemPage';
import DashboardPage from './pages/DashboardPage';
import SessionPage from './pages/SessionPage';
import { useAuth } from '@clerk/clerk-react';
import { setAuthToken } from "./lib/axios";
import { useEffect } from 'react';

function AuthTokenSetter() {
  const { getToken } = useAuth();

  useEffect(() => {
    const setToken = async () => {
      try {
        const token = await getToken();
        setAuthToken(token); // Set the token for all Axios requests
        console.log(token);
      } catch (e) {
        console.error("Error setting auth token", e);
      }
    };
    setToken();
  }, [getToken]); // Re-run this effect when auth state changes

  return null; // This component doesn't render anything
}


function App() {
  const { isSignedIn, isLoaded } = useUser();



  if(!isLoaded) return null;
  return (
    <>
    <AuthTokenSetter />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={isSignedIn ? <DashboardPage /> : <Navigate to={"/"} />} />
        <Route path="/problems" element={ isSignedIn ? <ProblemsPage /> : <Navigate to={'/'} />} />
        <Route path="/problems/:id" element={ isSignedIn ? <ProblemPage /> : <Navigate to={'/'} />} />
        <Route path="/sessions/:id" element={ isSignedIn ? <SessionPage /> : <Navigate to={'/'} />} />
    
      </Routes>
      <div>
        <Toaster toastOptions={{duration:3000}}/>
      </div>
    </>
  );
}

export default App
