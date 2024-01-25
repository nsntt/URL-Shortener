import express from 'express';
import morgan from 'morgan';
import apiRoutes from './routes/api';

import { config } from 'dotenv';
import { corsMiddleware } from './middlewares/cors';

import './database';

config()
const app = express();

app.set('port', process.env.PORT || 3001);
app.disable('x-powered-by');

// only use this middleware if you want to go into production client.
/* app.use(corsMiddleware()) */
app.use(express.json());
app.use(morgan('dev'));

app.use('/api', apiRoutes);

app.listen(
    app.get('port'),
    () => console.log("[🧹] App listening on port", app.get('port'))
)