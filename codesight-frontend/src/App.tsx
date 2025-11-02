
import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton, useUser } from '@clerk/clerk-react'
import { Route, Routes } from 'react-router';
import HomePage from './pages/HomePage';
import ProblemsPage from './pages/ProblemsPage';
import { Toaster } from 'react-hot-toast';

function App() {
  const {isSignedIn}=useUser();
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/problems" element={ isSignedIn ? <ProblemsPage /> : <HomePage />} />
      </Routes>
      <div>
        <Toaster toastOptions={{duration:3000}}/>
      </div>
    </>
  );
}

export default App
