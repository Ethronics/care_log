import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <h1>Welcome to Log My Care</h1>
              <p>Version 1.0 - Foundation</p>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  )
}

export default App
