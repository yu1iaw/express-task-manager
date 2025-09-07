import express from 'express';
import sql from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const todos = await sql`
        SELECT * FROM todos
        WHERE user_id = ${req.userId};
    `;
        res.json(todos);
    } catch (error) {
        res.sendStatus(503);
    }
})


router.post('/', async (req, res) => {
    const { task } = JSON.parse(req.body);

    try {
        const insertTodo = await sql`
            INSERT INTO todos(user_id, task)
            VALUES(${req.userId}, ${task})
            RETURNING id, task, completed;
        `;

        res.json({ message: { 'created_todo': insertTodo[0] ?? null } });
    } catch (error) {
        res.status(401).json({ message: `${error.name}: ${error.message}` });
    }
})


router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const { completed } = JSON.parse(req.body);

    const updateTodo = await sql`
        UPDATE todos
        SET completed = ${completed}
        WHERE user_id = ${req.userId}
        AND id = ${id}
        RETURNING id, task, completed;
    `;

    res.json({ message: { 'updated_todo': updateTodo[0] ?? null } });
})

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    const deleteTodo = await sql`
        DELETE FROM todos
        WHERE user_id = ${req.userId}
        AND id = ${id}
        RETURNING id, task, completed;
    `;

    res.json({ message: { 'deleted_todo': deleteTodo[0] ?? null } });
})


export default router;