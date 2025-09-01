import { Router } from 'express';
import { findUserByEmail } from '../data/mockData';

const router = Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email обязателен'
      });
    }

    // Проверяем, что email заканчивается на @zinda.ai
    if (!email.endsWith('@zinda.ai')) {
      return res.status(400).json({
        success: false,
        error: 'Используйте корпоративную почту @zinda.ai'
      });
    }

    const user = findUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Пользователь не найден'
      });
    }

    // В будущем здесь будет JWT токен
    const mockToken = `mock_token_${user.id}_${Date.now()}`;

    res.json({
      success: true,
      data: {
        user,
        token: mockToken
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Внутренняя ошибка сервера'
    });
  }
});

export default router;
