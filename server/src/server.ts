import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { mongoDbProvider } from './mongoDBProvider';
import { agentsRouter } from './routers/agentsRouter.router';
import { conversationsRouter } from './routers/conversationsRouter.router';
import { dataAggregationRouter } from './routers/dataAggregationRouter.router';
import { experimentsRouter } from './routers/experimentsRouter.router';
import { formsRouter } from './routers/formsRouter';
import { usersRouter } from './routers/usersRouter.router';
<<<<<<< HEAD
import { pylipsRouter } from './routers/pylipsRouter.router';
import { whisperRouter } from './routers/whisperRouter.router';
=======
import { sadTalkerRouter } from './routers/sadtalkerRouter.router';
>>>>>>> 399a6bc00e2a6010e154a1560a20838e0d7632ea
import { usersService } from './services/users.service';

dotenv.config();

mongoDbProvider.initialize();

const createAdminUser = (username: string, password: string) => {
    if (!username || !password) {
        console.warn('Username and password are required');
        process.exit(1);
    }

    usersService
        .createAdminUser(username, password)
        .then(() => {
            console.log('Admin user created successfully');
            process.exit(0);
        })
        .catch((error) => {
            console.error('Error creating admin user:', error);
            process.exit(1);
        });
};

const setupServer = () => {
    const app = express();
    // 增加请求体大小限制以支持头像上传 (50MB)
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ limit: '50mb', extended: true }));
    const corsOptions = {
        origin: process.env.FRONTEND_URL,
        credentials: true,
    };
    app.use(cors(corsOptions));
    app.use(cookieParser());

    // 添加静态文件服务，提供上传的头像文件
    const uploadsPath = path.join(process.cwd(), 'uploads');
    app.use('/uploads', express.static(uploadsPath));

    const PORT = process.env.PORT || 5000;
    app.use('/health', (req, res) => res.status(200).send('OK'));
    app.use('/conversations', conversationsRouter());
    app.use('/experiments', experimentsRouter());
    app.use('/users', usersRouter());
    app.use('/agents', agentsRouter());
    app.use('/dataAggregation', dataAggregationRouter());
    app.use('/forms', formsRouter());
<<<<<<< HEAD
    app.use('/pylips', pylipsRouter());
    app.use('/whisper', whisperRouter());
=======
    app.use('/sadtalker', sadTalkerRouter());
>>>>>>> 399a6bc00e2a6010e154a1560a20838e0d7632ea

    app.listen(PORT, () => {
        console.log(`Server started on http://localhost:${PORT}`);
    });
};

if (process.argv[2] === 'create-user') {
    const [, , , username, password] = process.argv;
    createAdminUser(username, password);
} else {
    setupServer();
}
