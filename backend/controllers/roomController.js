import { prisma } from '../prismaClient.js';

// 1. Получить все аудитории
export const getAllRooms = async (req, res) => {
    try {
        const rooms = await prisma.rooms.findMany();
        res.json(rooms);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка при получении аудиторий' });
    }
};

// 2. Создать новую аудиторию
export const createRoom = async (req, res) => {
    try {
        const { number, building, description } = req.body;
        const newRoom = await prisma.rooms.create({
            data: { number, building, description },
        });
        res.status(201).json(newRoom);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка при создании аудитории' });
    }
};

// 3. Обновить аудиторию
export const updateRoom = async (req, res) => {
    try {
        const { id } = req.params;
        const { number, building, description } = req.body;
        const updatedRoom = await prisma.rooms.update({
            where: { id: parseInt(id) },
            data: { number, building, description },
        });
        res.json(updatedRoom);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка при обновлении аудитории' });
    }
};

// 4. Удалить аудиторию
export const deleteRoom = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.rooms.delete({ where: { id: parseInt(id) } });
        res.json({ message: 'Аудитория удалена' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка при удалении аудитории' });
    }
};