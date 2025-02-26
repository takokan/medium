import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/extension';
import { withAccelerate } from '@prisma/extension-accelerate';
import { sign, verify } from 'hono/jwt';

const app = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string
    }
}>()

app.use('/api/v1/blog/*', async (c, next) => {
    const header = c.req.header("authorization") || "";
    const token = header.split(" ")[1];
    
    const response = await verify(token, c.env.JWT_SECRET);
    if(response){
        next()
    } else {
        c.status(403);
        return c.json({error: "unauthorized"})
    }
})

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
    const user = await prisma.user.create({
        data: {
            email: body.email,
            password: body.password,
        },
    })
    const secret = c.env.JWT_SECRET;
    const token = sign({id: user.id}, secret);

    return c.json({
        jwt: token
    });
});

app.post('/api/v1/signin', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    const body = await c.req.json();
    const user = prisma.user.findUnique({
        where: {
            email: body.email
        }
    });

    if(!user){
        c.status(403);
        return c.json({error: "User not found"})
    }

    const jwt = await sign({id: user.id}, c.env.JWT_SECRET);
    return c.json({jwt})
});


app.put('/api/v1/blog', (c) => {
    return c.text("put blogs")
});

export default app
