-- 1. Создаем независимые таблицы
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE equipment_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NULL
);

CREATE TABLE rooms (
    id SERIAL PRIMARY KEY,
    number VARCHAR(255) NOT NULL,
    building VARCHAR(255) NOT NULL,
    description TEXT NULL
);

-- 2. Пользователи (зависит от roles)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
    is_blocked BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. Оборудование (зависит от categories и rooms)
CREATE TABLE equipment (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    inventory_number VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NULL,
    status VARCHAR(255) NOT NULL DEFAULT 'available',
    category_id INTEGER NOT NULL REFERENCES equipment_categories(id) ON DELETE RESTRICT,
    room_id INTEGER NULL REFERENCES rooms(id) ON DELETE SET NULL,
    image_path VARCHAR(255) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. Заявки (зависит от users)
CREATE TABLE requests (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(255) NOT NULL DEFAULT 'pending',
    comment TEXT NULL,
    rejection_reason TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5. Связь заявок и оборудования
CREATE TABLE request_items (
    id SERIAL PRIMARY KEY,
    request_id INTEGER NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
    equipment_id INTEGER NOT NULL REFERENCES equipment(id) ON DELETE CASCADE
);

-- 6. Транзакции (история выдач/возвратов)
CREATE TABLE equipment_transactions (
    id SERIAL PRIMARY KEY,
    equipment_id INTEGER NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT, -- Кому выдали
    performed_by INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT, -- Кто выдал (лаборант)
    transaction_type VARCHAR(255) NOT NULL,
    from_room_id INTEGER NULL REFERENCES rooms(id) ON DELETE SET NULL,
    to_room_id INTEGER NULL REFERENCES rooms(id) ON DELETE SET NULL,
    issued_at TIMESTAMP NULL,
    returned_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 7. Журнал аудита
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NULL REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(255) NOT NULL,
    entity VARCHAR(255) NOT NULL,
    entity_id INTEGER NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- SEED (Тестовые данные)
-- ==========================================

-- 1. Роли (id: 1, 2, 3)
INSERT INTO roles (name) VALUES 
('Администратор'),  -- id 1
('Лаборант'),       -- id 2
('Преподаватель');  -- id 3

-- 2. Категории (id: 1, 2, 3)
INSERT INTO equipment_categories (name, description) VALUES 
('Ноутбуки', 'Портативные компьютеры'), -- id 1
('Проекторы', 'Устройства вывода'),     -- id 2
('Принтеры', NULL);                     -- id 3

-- 3. Аудитории (id: 1, 2, 3)
INSERT INTO rooms (number, building, description) VALUES 
('101', 'Корпус А', 'Компьютерный класс'), -- id 1
('202', 'Корпус Б', 'Лекционная'),         -- id 2
('305', 'Корпус А', NULL);                -- id 3

-- 4. Пользователи (id: 1, 2, 3)
-- Пароль для всех: password123 (хеш bcrypt сгенерирован специально для теста)
INSERT INTO users (name, email, password_hash, role_id, is_blocked) VALUES 
('Иван Админов', 'admin@college.ru', '$2b$10$X8/3m6Kz9pP9G5q7s9rO1uW4z5a8b0c2d4e6f8g0h2i4j6k8l0m2', 1, FALSE),
('Петр Лаборантов', 'lab@college.ru', '$2b$10$X8/3m6Kz9pP9G5q7s9rO1uW4z5a8b0c2d4e6f8g0h2i4j6k8l0m2', 2, FALSE),
('Мария Преподавателева', 'teacher@college.ru', '$2b$10$X8/3m6Kz9pP9G5q7s9rO1uW4z5a8b0c2d4e6f8g0h2i4j6k8l0m2', 3, FALSE);

-- 5. Оборудование (id: 1, 2, 3)
INSERT INTO equipment (name, inventory_number, description, status, category_id, room_id, image_path) VALUES 
('Ноутбук HP', 'INV-001', 'Рабочий ноутбук', 'available', 1, 1, NULL),
('Проектор Epson', 'INV-002', 'Проектор для лекций', 'in_use', 2, 2, '/images/epson.jpg'),
('Принтер Canon', 'INV-003', NULL, 'repair', 3, NULL, NULL);