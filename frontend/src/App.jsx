import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Analyzer from './pages/Analyzer'
import Builder from './pages/Builder'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/analyze" element={<Analyzer />} />
        <Route path="/build" element={<Builder />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
