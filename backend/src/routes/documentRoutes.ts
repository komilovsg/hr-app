import { Router } from 'express';
import { findUserById } from '../data/mockData';

const router = Router();

// GET /api/users/:id/documents
router.get('/users/:id/documents', (req, res) => {
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
      data: user.documents
    });

  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({
      success: false,
      error: 'Внутренняя ошибка сервера'
    });
  }
});

// POST /api/users/:id/documents
router.post('/users/:id/documents', (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        error: 'Неверный ID пользователя'
      });
    }

    const { name, type } = req.body;

    if (!name || !type) {
      return res.status(400).json({
        success: false,
        error: 'Название и тип документа обязательны'
      });
    }

    // В будущем здесь будет загрузка файла и сохранение в БД
    const newDocument = {
      id: Date.now(),
      name,
      type,
      uploadedAt: new Date().toISOString(),
      url: `/uploads/${userId}/${name}`
    };

    res.status(201).json({
      success: true,
      data: newDocument
    });

  } catch (error) {
    console.error('Upload document error:', error);
    res.status(500).json({
      success: false,
      error: 'Внутренняя ошибка сервера'
    });
  }
});

export default router;
