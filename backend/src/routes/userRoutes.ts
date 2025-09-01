import { Router } from 'express';
import { mockUsers, findUserById, getTeamMembers } from '../data/mockData';

const router = Router();

// GET /api/users
router.get('/', (req, res) => {
  try {
    // В будущем здесь будет фильтрация по команде и роли
    res.json({
      success: true,
      data: mockUsers
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      error: 'Внутренняя ошибка сервера'
    });
  }
});

// GET /api/users/:id
router.get('/:id', (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        error: 'Неверный ID пользователя'
      });
    }

    const user = findUserById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Пользователь не найден'
      });
    }

    res.json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      error: 'Внутренняя ошибка сервера'
    });
  }
});

// GET /api/users/team/:team
router.get('/team/:team', (req, res) => {
  try {
    const { team } = req.params;
    const teamMembers = getTeamMembers(team);

    res.json({
      success: true,
      data: teamMembers
    });

  } catch (error) {
    console.error('Get team members error:', error);
    res.status(500).json({
      success: false,
      error: 'Внутренняя ошибка сервера'
    });
  }
});

export default router;
