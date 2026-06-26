# GradeBook — Электронный журнал

Веб-приложение для автоматизации учёта посещаемости, оценок и взаимодействия между студентами и преподавателями.

## Стек технологий

| Слой | Технологии |
|------|-----------|
| Frontend | React 19, TypeScript, Vite, Material UI, React Router, TanStack Query |
| Backend | NestJS, TypeScript, Express |
| БД | **PostgreSQL 16** (TypeORM) |
| Аутентификация | JWT (Bearer token) |
| Файлы | Локальное хранилище (`backend/uploads/`) |

## Возможности

### Студент
- **Расписание** — актуальное расписание группы
- **Электронный журнал** — таблица пропусков и оценок по предметам
- **Страница предмета** — успеваемость по лабам, контрольным, практикам, тестам
- **Лабораторная работа** — загрузка решения, комментарии, оценка, дедлайн, напарники

### Преподаватель
- **Расписание** — занятия преподавателя
- **Журнал** — оценки (ЛКМ), опоздания (СКМ), отсутствия (ПКМ), подсветка строк/столбцов
- **Программа** — шаблон занятий, дедлайны, ТЗ, командные работы
- **Сдача лаб** — проверка работ, выставление оценок и комментариев

## Быстрый старт

### Требования
- Node.js 18+
- npm
- Docker (для PostgreSQL)

### 1. База данных

```bash
# Из корня проекта
npm run db:up
```

PostgreSQL поднимется на `localhost:5433` (порт 5433, чтобы не конфликтовать с локальным PostgreSQL на Windows).

### 2. Backend

```bash
cd backend
cp .env.example .env   # если файла .env ещё нет
npm install
npm run start:dev
```

API: `http://localhost:3000/api`

При первом запуске TypeORM создаст таблицы и заполнит демо-данными.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Приложение: `http://localhost:5173`

### Всё одной командой (из корня)

```bash
npm run install:all
npm run db:up
# в двух терминалах:
npm run dev:backend
npm run dev:frontend
```

## Демо-аккаунты

| Роль | Email | Пароль |
|------|-------|--------|
| Преподаватель | `teacher@gradebook.ru` | `password` |
| Преподаватель 2 | `teacher2@gradebook.ru` | `password` |
| Студент | `student1@gradebook.ru` | `password` |
| Студент 2–8 | `student2@gradebook.ru` … `student8@gradebook.ru` | `password` |

## Управление журналом (преподаватель)

| Действие | Способ |
|----------|--------|
| Выставить оценку | ЛКМ по ячейке → ввод 2–5 |
| Быстрая оценка | Клавиши `2`–`5` в диалоге |
| Опоздание | СКМ (средняя кнопка мыши) |
| Отсутствие | ПКМ (правая кнопка мыши) |

Отчисленные студенты отображаются обесцвеченными, новые — с жёлтой подсветкой.

## Структура проекта

```
GradeBook/
├── docker-compose.yml     # PostgreSQL
├── backend/
│   ├── src/
│   │   ├── auth/          # JWT аутентификация
│   │   ├── journal/       # Журнал оценок и посещаемости
│   │   ├── schedule/      # Расписание
│   │   ├── program/       # Программа и лабораторные
│   │   ├── database/      # Конфиг TypeORM
│   │   ├── seed/          # Демо-данные
│   │   └── entities/      # TypeORM сущности
│   ├── .env.example
│   └── uploads/           # Загруженные файлы
├── frontend/
│   └── src/
│       ├── pages/         # Страницы приложения
│       ├── components/    # UI компоненты
│       └── api/           # HTTP клиент
└── README.md
```

## Переменные окружения

Скопируйте `backend/.env.example` в `backend/.env`:

```env
DB_HOST=localhost
DB_PORT=5433
DB_USER=gradebook
DB_PASSWORD=gradebook
DB_NAME=gradebook
JWT_SECRET=change-me-in-production
```

## Сброс базы данных

```bash
npm run db:reset
# перезапустите backend — seed создаст данные заново
```

## API Endpoints

| Метод | Путь | Описание |
|-------|------|----------|
| POST | `/api/auth/login` | Вход |
| GET | `/api/auth/me` | Профиль |
| GET | `/api/schedule` | Расписание |
| GET | `/api/journal/my` | Журнал студента |
| GET | `/api/journal/:id` | Журнал предмета |
| POST | `/api/journal/:id/days` | Добавить день |
| PATCH | `/api/journal/entries/:id` | Обновить запись |
| GET | `/api/program/:id` | Программа предмета |
| POST | `/api/program/lab/:id/submit` | Сдать лабу |
| PATCH | `/api/program/submissions/:id/grade` | Оценить работу |
