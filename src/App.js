import React, { useState } from 'react';
import './App.css';
import LoadingScreen from './components/LoadingScreen';
import MainContent from './components/MainContent';

function App() {
  const [loading, setLoading] = useState(true);

  const handleAnimationComplete = () => {
    setTimeout(() => setLoading(false), 300);
  };

  return (
    <>
      {loading ? <LoadingScreen onAnimationComplete={handleAnimationComplete} /> : <MainContent />}
    </>
  );
}

export default App;