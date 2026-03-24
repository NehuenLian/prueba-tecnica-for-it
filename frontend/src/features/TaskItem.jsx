import React, {useEffect, useState} from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

function TaskItem()  {

    const navigate = useNavigate();
    const { id } = useParams();
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        completed: false,
    })
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    async function loadTask() {

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/${id}`);
            if (!response.ok) {
                throw new Error("Tarea no encontrada.");
            }

            const data = await response.json();
            setFormData({ // actualizamos los datos del componente (en este punto diría "cargando")
                title: data.title || '',
                description: data.description || '',
                completed: data.completed === 1 // convertir el 1 de sqlite a true
            });
        }
        catch (err) {
            setError(err.message);
        }
        finally {
            setIsLoading(false); // sea exito o error, quitamos el loading para mostrar lo que paso
        }
    }

    useEffect(() => {
        if (id) {
            loadTask();
        }
    }, [id]);

    // early returns antes de devolver el componente
    if (isLoading) {
        return (
            <div className="container mt-5 text-center">
                <p className="text-muted">Cargando...</p>
            </div>
        );
    }
    if (error) {
        return (
            <div className="container mt-5 text-center">
                <div className="alert alert-danger d-inline-block">
                    Ocurrió un error al intentar obtener la tarea.
                </div>
            </div>
        );
    }
    if (!id) {
        return (
            <div className="container mt-5 text-center">
                <div className="alert alert-danger d-inline-block">
                    Error: no se proporcionó una ID de tarea.
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-12 col-md-6 col-lg-5">
                    <div className="card shadow p-4">
                        <h1 className='text-center mb-4'>Detalle de la tarea</h1>
                        <form className='form-control'>
                            <div className='mb-3'>
                                <label htmlFor='title' className='for-label'>Título de la tarea</label>
                                <input 
                                    type="text"
                                    className='form-control'
                                    value={formData.title}
                                    readOnly
                                />
                            </div>

                            <div className='mb-3'>
                                <label htmlFor="description" className="form-label">Descripción</label>
                                <textarea 
                                    type='text'
                                    className='form-control'
                                    value={formData.description}
                                    readOnly
                                />
                            </div>
                        
                            <label>
                                <input
                                    type='checkbox'
                                    checked={formData.completed}
                                    disabled
                                />
                            </label>
                        </form>
                        <div className='d-flex gap-2 mt-3'>
                            <button type="button" className="btn btn-primary" onClick={ () => navigate('/') }>Volver</button>
                        </div>
                </div>
            </div>
        </div>
    </div>
    );
}

export default TaskItem;