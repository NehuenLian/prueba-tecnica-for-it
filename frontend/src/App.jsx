import React from "react";
import {BrowserRouter, Routes, Route, Link} from 'react-router-dom';

import TaskForm from './features/TaskForm'
import TaskItem from './features/TaskItem'
import TaskList from './features/TaskList'

function App() {
  
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Ver tareas</Link>
        <Link to="/task/create">Crear tarea</Link>
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