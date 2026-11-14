import { prisma } from '../prismaClient.js';

// 1. Получить все категории
export const getAllCategories = async (req, res) => {
    try {
        const categories = await prisma.equipment_categories.findMany();
        res.json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка при получении категорий' });
    }
};

// 2. Создать новую категорию
export const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const newCategory = await prisma.equipment_categories.create({
            data: { name, description },
        });
        res.status(201).json(newCategory);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка при создании категории' });
    }
};

// 3. Обновить категорию
export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        const updatedCategory = await prisma.equipment_categories.update({
            where: { id: parseInt(id) },
            data: { name, description },
        });
        res.json(updatedCategory);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка при обновлении категории' });
    }
};

// 4. Удалить категорию
export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.equipment_categories.delete({ where: { id: parseInt(id) } });
        res.json({ message: 'Категория удалена' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка при удалении категории' });
    }
};