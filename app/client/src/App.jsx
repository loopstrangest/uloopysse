import { Routes, Route, Navigate } from 'react-router-dom';
import Strangestloop from './sites/strangestloop/Strangestloop';
import Ulyssepence from './sites/ulyssepence/Ulyssepence';

function App() {
  return (
    <Routes>
      <Route path="/strangestloop" element={<Strangestloop />} />
      <Route path="/ulyssepence" element={<Ulyssepence />} />
      <Route path="/" element={<Navigate to="/strangestloop" replace />} />
    </Routes>
  );
}

export default App;
