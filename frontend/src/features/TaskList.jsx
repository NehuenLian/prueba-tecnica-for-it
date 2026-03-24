import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';

function TaskList() {

    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // true porque siempre tiene que cargar
    const [error, setError] = useState(null); // null porque no se sabe si habra un error o no todavia

    async function fetchTasks() {

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}`);
            if (!response.ok) {
                throw new Error("Error al obtener las tareas.");
            }
            const data = await response.json();
            setTasks(data);
        }
        catch (err) {
            // captura el error de arriba
            setError(err.message);
        }
        finally {
            /*
            una vez finaliza la incertidumbre se setea a false para manejar
            error o exito
            */
            setIsLoading(false); 
        }
    }

    async function deleteTask(id) {
        
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/${id}`, { method: "DELETE" });
            if (!response.ok) {
                throw new Error("Ocurrió un problema al eliminar la tarea en el servidor.");
            }

            const newTasks = tasks.filter(task => task.id !== id); // eliminar la tarea que coincida con la id
            setTasks(newTasks);
        }
        catch (err) {
            alert("No se pudo eliminar la tarea: " + err.message)
        }
    }

    useEffect(() => {
        fetchTasks();
    }, []);

    function renderTasks() {
        return tasks.map((task) => (
            <div className='container mt-4'>
                <div className='row justify-content-center'>
                    <div className='col-12 col-md-6'>
                        <li key={task.id} className='card shadow-sm mb-4 p-3'>
                            <strong>{task.title}</strong>

                            <div className='d-flex gap-2 mt-3'>
                                <Link to={`/task/${task.id}`} className='btn btn-primary'>Detalles</Link>
                                <Link to={`/task/edit/${task.id}`} className='btn btn-primary'>Editar</Link>
                                    <button onClick={() => deleteTask(task.id)} className='btn btn-danger'>
                                        Eliminar
                                    </button>
                            </div>

                        </li>
                    </div>
                </div>
            </div>
        ));
    }

    if (isLoading) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border text-primary mb-2" role="status"></div>
                <p className="text-muted">Cargando tareas...</p>
            </div>
        );
    }
    if (error) {
        return (
            <div className="container mt-5 text-center">
                <div className="alert alert-danger d-inline-block">
                    Ocurrió un error al obtener las tareas del servidor.
                </div>
            </div>
        );
    }

    return (
        <div className='container mt-5'>
            <div className='row justify-content-center'>
                <div className="col-12 col-md-8 col-lg-6 text-center">
                    <h1>Lista de tareas</h1>
                        {tasks.length === 0 ? (
                                <p className="text-center text-muted mt-5">
                                    No hay tareas pendientes.
                                </p>
                            ):
                            (
                                <ul className='list-unlysted'>{renderTasks()}</ul>
                            )
                        }
                </div>
            </div>
        </div>
    );
}

export default TaskList;