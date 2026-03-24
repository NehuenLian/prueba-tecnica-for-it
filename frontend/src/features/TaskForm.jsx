import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function TaskForm() {

    const {id} = useParams();
    const navigate = useNavigate();

    const isEditing = Boolean(id);

    const [isLoading, setIsLoading] = useState(isEditing);
    const [error, setError] = useState(null);
 
/*  indicar la estructura de lo que se le va a pasar al actualizar el componente.
    solo colocamos campos para titulo, descripcion y un checkbox para completed
    id se coloca al insertar un nuevo registro en la base de datos, lo mismo con la fecha */
    const [formData, setFormData] = useState({ 
        title: '',
        description: '',
        completed: false,
    });


    useEffect(() => { // cargar tareas solo si existe una id en el param
        if (isEditing) {
            loadTaskData();
        }
    }, [id]);

    async function loadTaskData() {
        /*
        funcion para obtener la tarea
        el useEffect se ejecuta en caso de que isEditing sea true, sino, no se carga nada.
        */
        try {
            const response = await fetch(`http://localhost:3000/api/tasks/${id}`);
            if (!response.ok) {
                throw new Error("Tarea no encontrada.");
            }

            const taskData = await response.json();
            setFormData(taskData); // actualizamos los datos del componente (en este punto diria "cargando")
        }
        catch (err) {
            setError(err.message);
        }
        finally {
            setIsLoading(false); // sea exito o error, quitamos el loading para manejar la sitaucion
        }
    }

    async function saveTask(currentTask, url, method) {
        // actualiza tarea o guarda una nueva segun URL
        const response = await fetch(url, {
            method: method,
            headers: { "Content-Type" : "application/json" },
            body: JSON.stringify(currentTask),
        });

        if (!response.ok) {
            throw new Error("Ocurrió un error al enviar los datos.");
        }
        return response.json();
    }

    function buildTaskObject() {
        /*
        spread para modificar el formulario: los datos son los mismos, pero es otro objeto en memooia
        solo se agrega formato
        */
        return {
            ...formData,
            title: formData.title.trim(),
        };
    }

    async function handleSubmit(event) {
        event.preventDefault();
        // ternarios para verificar si se esta creando o editando
        const url = isEditing ? `http://localhost:3000/api/tasks/${id}` : "http://localhost3000/api/tasks";
        const method = isEditing ? "PUT" : "POST";

        // construir objeto y enviar al backend
        try {
            const currentTask = buildTaskObject();
            await saveTask(currentTask, url, method);

            console.log("Task saved.");
            navigate('/');
        }
        catch (err) {
            alert(err.message); // captura error de saveTask();
        }
    }

    // early returns antes de renderizar el componente
    if (isLoading) {
        return <p>Cargando datos...</p>
    }
    if (error) {
        return <p>Ocurrió un error con el servidor al intentar actualizar o editar la tarea.</p>
    }

    return (
        <div>
            <h1></h1>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text"
                    placeholder='Título'
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                />

                <input 
                    type='text'
                    placeholder='Descripción'
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                />

                <label>
                    <input 
                    type='checkbox'
                    checked={formData.completed}
                    onChange={(e) => setFormData({...formData, completed: e.target.checked})}
                    />
                </label>

                <button type="submit">Guardar</button>
            </form>
        </div>
    );
}

export default TaskForm;