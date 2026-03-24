import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import ProjectSetup from './pages/ProjectSetup';
import OutputView from './pages/OutputView';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/setup" element={<ProjectSetup />} />
            <Route path="/output" element={<OutputView />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
