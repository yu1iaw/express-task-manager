import express from 'express';
import authRoutes from './routes/authRoutes.js';
import todoRoutes from './routes/todoRoutes.js';
import authMiddleware from './middleware/authMiddleware.js';
import bodyParser from 'body-parser';
// import path, { dirname } from 'path'
// import { fileURLToPath } from 'url'


const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

/* for express static files serving itself ⬇️

const __filename = fileURLToPath(import.meta.url);
console.log('__filename: ', __filename);
const __dirname = dirname(__filename);
console.log('__dirname: ', __dirname);

app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})
*/

app.use('/api/auth', authRoutes);
app.use('/api/todos', authMiddleware, todoRoutes);

// app.listen(PORT, () => console.log(`App is running on port ${PORT}`));

export default app;

/*

[[headers]]
    for = "/*"
        [headers.values]
            Cache-Control = "no-cache, no-store, must-revalidate"
            Pragma = "no-cache"
            Expires = "0"

[functions]
    node_bundler = "nft"

*/