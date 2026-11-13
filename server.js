import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/prisma/client.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import equipmentRoutes from './routes/equipmentRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import requestRoutes from './routes/requestRoutes.js';

dotenv.config();

// Безопасность: если JWT_SECRET не задан, сервер не запустится
if (!process.env.JWT_SECRET) {
    console.error('КРИТИЧЕСКАЯ ОШИБКА: JWT_SECRET не задан');
    process.exit(1);
}

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;

app.use(cors());
app.use(express.json());

// Middleware для проверки ролей
const checkRole = (allowedRoles) => {
    return (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: 'Нет токена авторизации' });
        }

        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            if (!allowedRoles.includes(decoded.role)) {
                return res.status(403).json({ error: 'Доступ запрещен: недостаточно прав' });
            }
            req.user = decoded;
            next();
        } catch (error) {
            return res.status(401).json({ error: 'Неверный токен' });
        }
    };
};

// Регистрация (Роль всегда "Преподаватель", ID 3)

app.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await prisma.users.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Пользователь с таким email уже существует' });
        }

        // Ищем роль "Преподаватель" по её ID (3)
        const defaultRole = await prisma.roles.findUnique({ where: { id: 3 } });
        if (!defaultRole) {
            return res.status(500).json({ error: 'Роль по умолчанию не найдена в базе' });
        }

        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        const newUser = await prisma.users.create({
            data: {
                name,
                email,
                password_hash,
                role_id: defaultRole.id,
                is_blocked: false,
            },
        });

        res.status(201).json({ message: 'Пользователь успешно создан', userId: newUser.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка при регистрации' });
    }
});

// Вход

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.users.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Неверный email или пароль' });
        }

        if (user.is_blocked) {
            return res.status(403).json({ error: 'Пользователь заблокирован' });
        }

        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(401).json({ error: 'Неверный email или пароль' });
        }

        if (!user.role_id) {
            return res.status(500).json({ error: 'У пользователя не назначена роль' });
        }

        const role = await prisma.roles.findUnique({ where: { id: user.role_id } });
        if (!role) {
            return res.status(500).json({ error: 'Роль не найдена в базе' });
        }

        const token = jwt.sign(
            { userId: user.id, role: role.name, email: user.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ message: 'Вход выполнен', token, role: role.name });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка при входе' });
    }
});

// Смена роли пользователя (только для Администратора)

app.put('/users/:id/role', checkRole(['Администратор']), async (req, res) => {
    try {
        const { id } = req.params;
        const { role_id } = req.body;

        // Проверяем, существует ли такая роль
        const role = await prisma.roles.findUnique({ where: { id: parseInt(role_id) } });
        if (!role) {
            return res.status(400).json({ error: 'Роль с таким ID не найдена' });
        }

        const updatedUser = await prisma.users.update({
            where: { id: parseInt(id) },
            data: { role_id: parseInt(role_id) },
        });

        res.json({ 
            message: `Пользователь ${updatedUser.email} теперь имеет роль: ${role.name}`,
            userId: updatedUser.id,
            newRole: role.name
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка при смене роли' });
    }
});
// Защищенный маршрут (Админ-панель)

app.get('/admin-panel', checkRole(['Администратор', 'Лаборант']), (req, res) => {
    res.json({ message: `Добро пожаловать в админ-панель, ${req.user.email}!` });
});

// Подключаем CRUD для оборудования

app.use('/equipment', equipmentRoutes);
app.use('/rooms', roomRoutes);
app.use('/requests', requestRoutes);

app.get('/', (req, res) => {
    res.send('Сервер работает! База подключена.');
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});