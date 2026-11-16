import bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/prisma/client.js';
import dotenv from 'dotenv';

dotenv.config();

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function createAdmin() {
    try {
        // Берем данные из .env 
        const email = process.env.ADMIN_EMAIL;
        const password = process.env.ADMIN_PASSWORD;
        const name = 'Иван Админов';
        const roleId = 1; // ID роли "Администратор"

        // Проверка: если переменные не заданы, скрипт не запустится
        if (!email || !password) {
            console.error('ОШИБКА: ADMIN_EMAIL или ADMIN_PASSWORD не заданы в .env');
            process.exit(1);
        }

        // 1. Проверяем, есть ли уже такой админ
        const existingAdmin = await prisma.users.findUnique({ where: { email } });
        if (existingAdmin) {
            console.log(`Администратор с email ${email} уже существует.`);
            return;
        }

        // 2. Генерируем хеш пароля
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // 3. Создаем пользователя
        const admin = await prisma.users.create({
            data: {
                name,
                email,
                password_hash,
                role_id: roleId,
                is_blocked: false,
            },
        });

        console.log('✅ Администратор успешно создан!');
        console.log(`Email: ${admin.email}`);
        console.log(`Роль: Администратор (ID: ${admin.role_id})`);

    } catch (error) {
        console.error('Ошибка при создании админа:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createAdmin();