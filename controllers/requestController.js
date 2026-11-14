import { prisma } from '../prismaClient.js';

// 1. Получить все заявки (с подтягиванием пользователя и оборудования)
export const getAllRequests = async (req, res) => {
    try {
        const requests = await prisma.requests.findMany({
            include: {
                users: { select: { name: true, email: true } },
                request_items: {
                    include: {
                        equipment: { select: { name: true, inventory_number: true } }
                    }
                }
            }
        });
        res.json(requests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка при получении заявок' });
    }
};

// 2. Создать заявку (Преподаватель просит оборудование)
export const createRequest = async (req, res) => {
    try {
        const { user_id, comment, equipment_ids } = req.body; // equipment_ids — массив ID

        const newRequest = await prisma.requests.create({
            data: {
                user_id: parseInt(user_id),
                comment,
                status: 'pending',
                request_items: {
                    create: equipment_ids.map(id => ({ equipment_id: parseInt(id) }))
                }
            },
            include: { request_items: true }
        });
        res.status(201).json(newRequest);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка при создании заявки' });
    }
};

// 3. Обновить статус заявки (Лаборант/Админ одобряет или отклоняет)
export const updateRequestStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, rejection_reason } = req.body;

        const updatedRequest = await prisma.requests.update({
            where: { id: parseInt(id) },
            data: { status, rejection_reason },
        });
        res.json(updatedRequest);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка при обновлении заявки' });
    }
};