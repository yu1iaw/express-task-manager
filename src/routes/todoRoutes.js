import express from 'express';
import sql from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
    const todos = await sql`
        SELECT * FROM todos
        WHERE user_id = ${req.userId};
    `;

    res.json(todos);
})


router.post('/', async (req, res) => {
    const { task } = JSON.parse(req.body);

    const insertTodo = await sql`
        INSERT INTO todos(user_id, task)
        VALUES(${req.userId}, ${task})
        RETURNING id;
    `;

    res.json({ id: insertTodo[0].id, task, completed: 0 });
})


router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const { completed } = JSON.parse(req.body);

    const updateTodo = await sql`
        UPDATE todos
        SET completed = ${completed}
        WHERE user_id = ${req.userId}
        AND id = ${id};
    `;

    res.json({ message: "Todo completed" });
})

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    const deleteTodo = await sql`
        DELETE FROM todos
        WHERE user_id = ${req.userId}
        AND id = ${id};
    `;

    res.json({ message: "Todo deleted" });
})


export default router;