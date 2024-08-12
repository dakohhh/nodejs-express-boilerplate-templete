import express from 'express';
import routers from '@/routers';
import settings from '@/settings';
import configureProcessesMiddleware from '@/middleware/processes.middleware';
import configureErrorMiddleware from '@/middleware/exception.middleware';
import { connect_to_mongo } from '@/libraries/mongodb';

const app = express();
const port = settings.port;

configureProcessesMiddleware(app);

// Routes
app.use(routers());

// Error Handling Middleware
configureErrorMiddleware(app);

app.listen(port, async () => {
    await connect_to_mongo();

    console.log(`Server is running on port ${port}`);
});
