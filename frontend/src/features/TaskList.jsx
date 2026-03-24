import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';

function TaskList() {

    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // true porque siempre tiene que cargar
    const [error, setError] = useState(null); // null porque no se sabe si habra un error o no todavia

    async function fetchTasks() {

        try {
            const response = await fetch("http://localhost:3000/api/tasks");
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
            const response = await fetch(`http://localhost:3000/api/tasks${id}`, { method: "DELETE" });
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
            <li key={task.id}>
                <strong>{task.title}</strong>
                <div>
                    <Link to={`/task/${task.id}`}>Detalles</Link>
                    <Link to={`/task/edit/${task.id}`}>Editar</Link>

                    <button onClick={() => deleteTask(task.id)}>
                        Eliminar
                    </button>
                </div>
            </li>
        ));
    }

    if (isLoading) {
        return <p>Cargando tareas...</p>;
    }
    if (error) {
        return <p>Ocurrió un error al obtener las tareas del servidor.</p>;
    }

    return (
        <div>
            <h1>Lista de tareas</h1>
                {tasks.length === 0 ? (
                        <p>No hay tareas pendientes.</p>
                    ):
                    (
                        <ul>{renderTasks()}</ul>
                    )
                }
        </div>
    );
}

export default TaskList;