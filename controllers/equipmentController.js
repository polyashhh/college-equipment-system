import { prisma } from '../prismaClient.js';

// 1. Получить всё оборудование (READ)
export const getAllEquipment = async (req, res) => {
    try {
        const equipment = await prisma.equipment.findMany({
            include: {
                equipment_categories: true, // Подтягиваем название категории
                rooms: true,                // Подтягиваем номер аудитории
            }
        });
        res.json(equipment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка при получении оборудования' });
    }
};

// 2. Получить одно оборудование по ID (READ)
export const getEquipmentById = async (req, res) => {
    try {
        const { id } = req.params;
        const equipment = await prisma.equipment.findUnique({
            where: { id: parseInt(id) },
            include: {
                equipment_categories: true,
                rooms: true,
            }
        });
        if (!equipment) {
            return res.status(404).json({ error: 'Оборудование не найдено' });
        }
        res.json(equipment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка при получении оборудования' });
    }
};

// 3. Создать новое оборудование (CREATE)
export const createEquipment = async (req, res) => {
    try {
        const { name, inventory_number, description, status, category_id, room_id, image_path } = req.body;
        
        const newEquipment = await prisma.equipment.create({
            data: {
                name,
                inventory_number,
                description,
                status: status || 'available',
                category_id: parseInt(category_id),
                room_id: room_id ? parseInt(room_id) : null,
                image_path: image_path || null,
            },
        });
        res.status(201).json(newEquipment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка при создании оборудования' });
    }
};

// 4. Обновить оборудование (UPDATE)
export const updateEquipment = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, inventory_number, description, status, category_id, room_id, image_path } = req.body;

        const updatedEquipment = await prisma.equipment.update({
            where: { id: parseInt(id) },
            data: {
                name,
                inventory_number,
                description,
                status,
                category_id: category_id ? parseInt(category_id) : undefined,
                room_id: room_id ? parseInt(room_id) : null,
                image_path,
            },
        });
        res.json(updatedEquipment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка при обновлении оборудования' });
    }
};

// 5. Удалить оборудование (DELETE)
export const deleteEquipment = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.equipment.delete({ where: { id: parseInt(id) } });
        res.json({ message: 'Оборудование удалено' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка при удалении оборудования' });
    }
};