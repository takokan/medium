import { Hono } from 'hono'
import { userRouter } from './routes/user';
import { bookRouter } from './routes/blog';

const app = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string
    }
}>()

app.route("/api/v1/blog", bookRouter);
app.route("/api/v1/user", userRouter);

export default app
