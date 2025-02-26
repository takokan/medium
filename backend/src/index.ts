import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/extension';
import { withAccelerate } from '@prisma/extension-accelerate';

const app = new Hono<{
    Bindings: {
        DATABASE_URL: string
    }
}>()

// endpoint to get the blogs with id
app.get('/api/v1/blog/:id', (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    return c.text("/api/v1/blog")
});

// to post a new blog
app.post('/api/v1/blog', (c) => {
    return c.text("/api/v1/blogp")
});

app.post('/api/v1/signup', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const body = await c.req.json();
    await prisma.user.create({
        data: {
            email: body.email,
            password: body.password,
        },
    })
    return c.text("/api/v1/signup")
});

app.post('/api/v1/signin', (c) => {
    return c.text("/api/v1/signin")
});


app.put('/api/v1/blog', (c) => {
    return c.text("put blogs")
});

export default app
