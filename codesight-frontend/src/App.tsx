
import { useUser } from '@clerk/clerk-react'
import { Navigate, Route, Routes } from 'react-router';
import HomePage from './pages/HomePage';
import ProblemsPage from './pages/ProblemsPage';
import { Toaster } from 'react-hot-toast';
// import Footer from './components/Footer';
import ProblemPage from './pages/ProblemPage';
import DashboardPage from './pages/DashboardPage';
import { useEffect } from 'react';

function App() {
  const {isSignedIn}=useUser();
  useEffect(() => {
    if(isSignedIn){
      <Navigate to="/problems" />
    }
  },[isSignedIn])
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={isSignedIn ? <DashboardPage /> : <Navigate to={"/"} />} />
        <Route path="/problems" element={ isSignedIn ? <ProblemsPage /> : <Navigate to={'/'} />} />
        <Route path="/problems/:id" element={ isSignedIn ? <ProblemPage /> : <Navigate to={'/'} />} />
    
      </Routes>
      <div>
        <Toaster toastOptions={{duration:3000}}/>
      </div>
    </>
  );
}

export default App
