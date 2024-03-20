import React from 'react'
import ReactDOM from 'react-dom/client'
import MazeGrid from './MazeGrid.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <MazeGrid />
  </React.StrictMode>,
)
