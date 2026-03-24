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

        async function loadTaskData() {
            /*
            funcion para obtener la tarea
            el useEffect se ejecuta en caso de que isEditing sea true, sino, no se carga nada.
            */
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/${id}`);
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

        if (isEditing) {
            loadTaskData();
        }
    }, [id, isEditing]);

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
        const url = isEditing ? `${import.meta.env.VITE_API_URL}/${id}` : `${import.meta.env.VITE_API_URL}`;
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
        return (
            <div className="container mt-5 text-center">
                <p className="text-muted">Cargando datos...</p>
            </div>
        );
    }
    if (error) {
        return (
            <div className="container mt-5 text-center">
                <div className="alert alert-danger d-inline-block">
                    Ocurrió un error con el servidor al intentar actualizar o editar la tarea.
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-12 col-md-6 col-lg-5">
                    <div className="card shadow p-4">
                        <h1 className='text-center mb-4'>Crear/editar tarea</h1>
                        <form onSubmit={handleSubmit} className='form-control'>
                            <div className='mb-3'>
                                <label htmlFor='title' className='for-label'>Título de la tarea</label>
                                <input 
                                    type="text"
                                    className='form-control'
                                    placeholder='Título'
                                    value={formData.title}
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                />
                            </div>

                            <div className='mb-3'>
                                <label htmlFor="description" className="form-label">Descripción</label>
                                <textarea 
                                    type='text'
                                    className='form-control'
                                    placeholder='Descripción'
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                />
                            </div>

                            <div className='mb-3'>
                                <label>
                                    <input 
                                    type='checkbox'
                                    checked={formData.completed}
                                    onChange={(e) => setFormData({...formData, completed: e.target.checked})}
                                    />
                                </label>
                            </div>
                            <div className='d-flex gap-2 mt-3'>
                                <button type="submit" className="btn btn-primary">Guardar</button>
                                <button type="button" className="btn btn-primary" onClick={ () => navigate('/') }>Volver</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TaskForm;