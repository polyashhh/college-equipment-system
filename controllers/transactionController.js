import { prisma } from '../prismaClient.js';

// 1. Получить историю всех транзакций
export const getAllTransactions = async (req, res) => {
    try {
        const transactions = await prisma.equipment_transactions.findMany({
            include: {
                equipment: { select: { name: true, inventory_number: true } },
                users_equipment_transactions_user_idTousers: { select: { name: true } },
                users_equipment_transactions_performed_byTousers: { select: { name: true } },
                rooms_equipment_transactions_from_room_idToroooms: { select: { number: true } },
                rooms_equipment_transactions_to_room_idToroooms: { select: { number: true } },
            },
            orderBy: { created_at: 'desc' }
        });
        res.json(transactions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка при получении транзакций' });
    }
};

// 2. Создать операцию (выдача, возврат или перемещение) + Обновить оборудование
export const createTransaction = async (req, res) => {
    try {
        const { 
            equipment_id, 
            user_id, 
            performed_by, 
            transaction_type, 
            from_room_id, 
            to_room_id, 
            issued_at, 
            returned_at 
        } = req.body;

        if (!['issue', 'return', 'move'].includes(transaction_type)) {
            return res.status(400).json({ error: 'Неверный тип операции. Используйте: issue, return или move' });
        }

        // Использует транзакцию базы данных, чтобы изменения были атомарными (всё или ничего)
        const result = await prisma.$transaction(async (tx) => {
            // 1. Создает запись в истории транзакций
            const newTransaction = await tx.equipment_transactions.create({
                data: {
                    equipment_id: parseInt(equipment_id),
                    user_id: parseInt(user_id),
                    performed_by: parseInt(performed_by),
                    transaction_type,
                    from_room_id: from_room_id ? parseInt(from_room_id) : null,
                    to_room_id: to_room_id ? parseInt(to_room_id) : null,
                    issued_at: issued_at ? new Date(issued_at) : null,
                    returned_at: returned_at ? new Date(returned_at) : null,
                },
            });

            // 2. Обновляет статус и аудиторию оборудования в зависимости от типа операции
            let updateData = {};

            if (transaction_type === 'issue') {
                // Выдача: оборудование уходит на руки преподавателю
                updateData = { status: 'in_use', room_id: null };
            } else if (transaction_type === 'return') {
                // Возврат: оборудование возвращается в аудиторию
                updateData = { status: 'available', room_id: to_room_id ? parseInt(to_room_id) : null };
            } else if (transaction_type === 'move') {
                // Перемещение: меняется только аудитория, статус остается прежним
                updateData = { room_id: to_room_id ? parseInt(to_room_id) : null };
            }

            await tx.equipment.update({
                where: { id: parseInt(equipment_id) },
                data: updateData,
            });

            return newTransaction;
        });

        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка при создании транзакции' });
    }
};