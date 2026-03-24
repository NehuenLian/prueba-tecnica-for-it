import express from 'express';
import db from '../persistence/db_config.js';

const router = express.Router();

async function getTaskById(request, response) {

    const id = parseInt(request.params.id);

    try {
        const task = await db.get('SELECT * FROM tasks WHERE id = ?', [id]);
        console.log("Task obtained.");

        return response.status(200).json(task);
    }
    catch (error) {
        return response.status(404).json({ error: "No se pudo obtener la tarea "}); // no revelamos info del servidor al cliente: solo mensajes
    }
}

async function getAllTasks(request, response) {

    try  {
        const tasks = await db.all("SELECT * FROM tasks");

        console.log("Tasks obtained.");
        return response.status.json(200).json(tasks);
    }
    catch (error) {
        return response.status(500).json({ error: "Ocurrió un error al obtener las tareas" })
    }
}

async function createTask(request, response) {
    const title = request.body.title;
    const description = request.body.description;
    const completed = request.body.completed;

    // validaciones en backend
    if (!title) {
        return response.status(400).json({ error: "El título es obligatorio." });
    }

    try {
        const query = "INSERT INTO tasks (title, description, completed) VALUES (?, ?, ?)";
        const result = await db.run(query, [title, description, completed]);

        console.log("Task created.");
        return response.status(201).json({
            id: result.lastID,
            title,
            description,
            completed
        });
    }
    catch (error) {
        return response.status(500).json({ error: "Ocurrió un error al crear la tarea." });
    }
}

async function updateTask(request, response) {
    const id = parseInt(request.params.id);
    const title = request.body.title;
    const description = request.body.description;
    const completed = request.body.completed;

    try {
        const task = await db.get("SELECT * FROM tasks WHERE id = ?", [id]); // primero verificar con id que esa tarea existe
        if (!task) {
            return response.status(404).json({ error: "Tarea no encontrada." });
        }

        const query = "UPDATE tasks SET title = ?, description = ?, completed = ? WHERE id = ?";
        await db.run(query, [
            title ?? task.title,
            description ?? task.description,
            completed ?? task.completed,
            id,
        ]);
        console.log("Task updated.");
        return response.status(200).json({ message: "Tarea actualizada." });
    }
    catch (error) {
        return response.json(500).json({ message: "Ocurrió un error al actualizar la tarea." });
    }
}

async function deleteTask(request, response) {
    const id = parseInt(request.params.id);

    try {
        const selectQuery = "SELECT * FROM tasks WHERE id = ?";
        const task = await db.get(query, [id]);
        if (!task) {
            return response.status(404).json({ message: "Tarea no encontrada."} );
        }

        const deleteQuery = "DELETE FROM tasks WHERE id = ?";
        await db.run(query, [id]);
        console.log("Task deleted.");

        return response.status(200).json({ message: "Tarea eliminada." });
    }
    catch (error) {
        return response.status(500).json({ message: "Ocurrió un error al eliminar la tarae." });
    }
}

router.get('/', getTaskById);
router.get('/:id', getAllTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;