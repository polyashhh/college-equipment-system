import { prisma } from '../prismaClient.js';

// 1. Получить всех пользователей (только для Администратора)
export const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.users.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role_id: true,
                is_blocked: true,
                created_at: true,
            }
        });
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка при получении пользователей' });
    }
};

// 2. Заблокировать/разблокировать пользователя (только для Администратора)
export const toggleBlockUser = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Находим пользователя, чтобы узнать его текущий статус
        const user = await prisma.users.findUnique({ where: { id: parseInt(id) } });
        if (!user) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }

        // Меняет статус на противоположный
        const updatedUser = await prisma.users.update({
            where: { id: parseInt(id) },
            data: { is_blocked: !user.is_blocked },
        });

        res.json({ 
            message: `Пользователь ${updatedUser.email} ${updatedUser.is_blocked ? 'заблокирован' : 'разблокирован'}`,
            is_blocked: updatedUser.is_blocked
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка при блокировке пользователя' });
    }
};