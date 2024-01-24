import express from 'express';
import { config } from 'dotenv';
import morgan from 'morgan';

import './database';

config()
const app = express();

app.set('port', process.env.PORT || 3001);
app.disable('x-powered-by');

app.use(express.json());
app.use(morgan('dev'));

app.listen(
    app.get('port'),
    () => console.log("[🧹] App listening on port", app.get('port'))
)