import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/prisma/client.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

dotenv.config();

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_123';

app.use(cors());
app.use(express.json());

// ==========================================
// 1. Middleware для проверки ролей
// ==========================================
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

// ==========================================
// 2. Маршрут: Регистрация (/register)
// ==========================================
app.post('/register', async (req, res) => {
    try {
        const { name, email, password, role_id } = req.body;

        const existingUser = await prisma.users.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Пользователь с таким email уже существует' });
        }

        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        const newUser = await prisma.users.create({
            data: {
                name,
                email,
                password_hash,
                role_id: parseInt(role_id),
                is_blocked: false,
            },
        });

        res.status(201).json({ message: 'Пользователь успешно создан', userId: newUser.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка при регистрации' });
    }
});

// ==========================================
// 3. Маршрут: Вход (/login)
// ==========================================
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

        const role = await prisma.roles.findUnique({ where: { id: user.role_id } });

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

// ==========================================
// 4. Тестовый защищенный маршрут
// ==========================================
app.get('/admin-panel', checkRole(['Администратор', 'Лаборант']), (req, res) => {
    res.json({ message: `Добро пожаловать в админ-панель, ${req.user.email}!` });
});

app.get('/', (req, res) => {
    res.send('Сервер работает! База подключена.');
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});