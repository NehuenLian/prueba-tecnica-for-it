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
        return <p>Cargando...</p>
    }
    if (error) {
        return <p>Ocurrió un error con el servidor al intentar obtener la tarea.</p>
    }
    if (!id) {
        return <p>Error: no se proporcionó una ID de tarea.</p>
    }

    return (
        <div>
            <h1>Detalle de la tarea</h1>
            <form>
                <input 
                    type="text"
                    value={formData.title}
                    readOnly
                />

                <input 
                    type='text'
                    value={formData.description}
                    readOnly
                />

                <label>
                    <input 
                        type='checkbox'
                        checked={formData.completed}
                        disabled
                    />
                </label>
            </form>

            <button type="button" onClick={ () => navigate('/') }>Volver</button>
        
        </div>
    );
}

export default TaskItem;