import express from 'express';
import env from './config/env.js';
import sequelize, { connectDB } from './config/database.js';
import router from './routes/routes.js';
const app = express();
//middleware
app.use(express.json());
//routes
app.use('/api/v1', router);
//app listen
const PORT = env.PORT;
app.listen(PORT, async () => {
    await connectDB();
    console.log(`app is running on http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map