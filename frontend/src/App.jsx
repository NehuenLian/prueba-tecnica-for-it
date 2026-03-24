import React from "react";
import {BrowserRouter, Routes, Route, Link} from 'react-router-dom';

import TaskForm from './features/TaskForm'
import TaskItem from './features/TaskItem'
import TaskList from './features/TaskList'

function App() {
  
  return (
    <BrowserRouter>
      <nav className="py-3 mb-4 bg-dark border-bottom">
        <div className="container">
          <div className="row">
            <div className="text-center">
              <div className="d-flex gap-3 justify-content-center">
                <button className="btn btn-primary text-white">
                  <Link to="/" className="text-white">Ver tareas</Link>
                </button>
                <button className="btn btn-primary">
                  <Link to="/task/create" className="text-white">Crear tarea</Link>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<TaskList />} />
        <Route path="/task/:id" element={<TaskItem />} />
        <Route path="/task/create" element={<TaskForm />} />
        <Route path="/task/edit/:id" element={<TaskForm />} />
      </Routes>

    </BrowserRouter>
  )
}

export default App;