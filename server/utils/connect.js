import mongoose from 'mongoose';
import log from './log.js';
export default mongoose
    .connect(process.env.database_uri, { dbName: 'reports', directConnection: true })
    .then((success) => {
        log('Database connected succesfully');
    })
    .catch((err) => {
        log('error database');
    });
