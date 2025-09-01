import express from 'express';
import { mockUsers, findUserById, getTeamMembers } from '../data/mockData';

const router = express.Router();

// Получить всех пользователей
router.get('/', (req, res) => {
  res.json(mockUsers);
});

// Получить пользователя по ID
router.get('/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const user = findUserById(userId);
  
  if (!user) {
    return res.status(404).json({ error: 'Пользователь не найден' });
  }
  
  res.json(user);
});

// Получить членов команды
router.get('/team/:team', (req, res) => {
  const team = req.params.team;
  const teamMembers = getTeamMembers(team);
  res.json(teamMembers);
});

// Получить подчиненных руководителя
router.get('/manager/:managerId/subordinates', (req, res) => {
  const managerId = parseInt(req.params.managerId);
  const manager = findUserById(managerId);
  
  if (!manager || manager.role !== 'manager') {
    return res.status(404).json({ error: 'Руководитель не найден' });
  }
  
  const subordinates = mockUsers.filter(user => 
    user.role === 'employee' && user.team === manager.team
  );
  
  res.json(subordinates);
});

// Получить рейтинг сотрудника
router.get('/:userId/rating', (req, res) => {
  const userId = parseInt(req.params.userId);
  const user = findUserById(userId);
  
  if (!user) {
    return res.status(404).json({ error: 'Пользователь не найден' });
  }
  
  // Mock данные для рейтинга
  const mockRating = {
    id: 1,
    employeeId: userId,
    managerId: 2, // Далер для frontend, Денис для backend
    managerName: user.team === 'frontend' ? 'Далер Алямов' : 'Денис',
    rating: 4,
    comment: 'Отличный сотрудник, всегда выполняет задачи в срок',
    characteristic: 'Высокопроизводительный сотрудник с отличными результатами. Работает в команде ' + user.team + ', демонстрирует командный дух. Проявляет инициативу в решении задач и готов к развитию.',
    createdAt: '2025-01-01T10:00:00Z',
    updatedAt: '2025-01-01T10:00:00Z'
  };
  
  res.json(mockRating);
});

export default router;
