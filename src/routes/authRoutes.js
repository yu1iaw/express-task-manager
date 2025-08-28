import expess from 'express';
import bcrypt from 'bcryptjs';
import sql from '../db.js';
import jwt from 'jsonwebtoken';


const router = expess.Router();

router.post('/register', async (req, res) => {
    let { username, password } = JSON.parse(req.body); // for Netlify should parse req.body because it is Buffer format

    const hashedPassword = bcrypt.hashSync(password, 8);

    try {
        const user = await sql`
            INSERT INTO users(username, password)
            VALUES(${username}, ${hashedPassword})
            RETURNING id;
        `;

        const defaultTodo = `Hello, ${username} 👋🏻! Add your first todo!`;
        const insertTodo = await sql`
            INSERT INTO todos(user_id, task) 
            VALUES(${user[0].id}, ${defaultTodo});
        `;

        const token = jwt.sign({ id: user[0].id }, process.env.JWT_SECRET, { expiresIn: "24h" });

        res.json({ token });

    } catch (error) {
        console.log(error.message);
        res.sendStatus(503);
    }
})

router.post('/login', async (req, res) => {
    const { username, password } = JSON.parse(req.body); // for Netlify should parse req.body because it is Buffer format

    const user = await sql`
        SELECT * FROM users
        WHERE username = ${username};
    `;

    if (!user[0]) {
        return res.status(404).send({ message: 'User not found' });
    }

    const passwordIsValid = bcrypt.compareSync(password, user[0].password);

    if (!passwordIsValid) {
        return res.status(401).send({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user[0].id }, process.env.JWT_SECRET, { expiresIn: "24h" });

    res.json({ token });
})



export default router;
