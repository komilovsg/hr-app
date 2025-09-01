import { Router } from 'express';
import { 
  getVacationRequestsByUserId, 
  getPendingVacationRequestsForManager,
  createVacationRequest,
  updateVacationRequestStatus,
  getManagerByTeam,
  findUserById
} from '../data/mockData';

const router = Router();

// GET /api/vacation/requests - получить заявки пользователя
router.get('/requests', (req, res) => {
  try {
    const userId = parseInt(req.query.userId as string);
    
    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        error: 'Неверный ID пользователя'
      });
    }

    const requests = getVacationRequestsByUserId(userId);

    res.json({
      success: true,
      data: requests
    });

  } catch (error) {
    console.error('Get vacation requests error:', error);
    res.status(500).json({
      success: false,
      error: 'Внутренняя ошибка сервера'
    });
  }
});

// GET /api/vacation/pending - получить pending заявки для менеджера
router.get('/pending', (req, res) => {
  try {
    const managerId = parseInt(req.query.managerId as string);
    
    if (isNaN(managerId)) {
      return res.status(400).json({
        success: false,
        error: 'Неверный ID менеджера'
      });
    }

    const requests = getPendingVacationRequestsForManager(managerId);

    res.json({
      success: true,
      data: requests
    });

  } catch (error) {
    console.error('Get pending requests error:', error);
    res.status(500).json({
      success: false,
      error: 'Внутренняя ошибка сервера'
    });
  }
});

// POST /api/vacation/request - создать новую заявку
router.post('/request', (req, res) => {
  try {
    const { userId, type, reason, startDate, endDate } = req.body;

    if (!userId || !type || !reason || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: 'Все поля обязательны'
      });
    }

    const user = findUserById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Пользователь не найден'
      });
    }

    // Находим менеджера команды
    const manager = getManagerByTeam(user.team);
    if (!manager) {
      return res.status(400).json({
        success: false,
        error: 'Менеджер команды не найден'
      });
    }

    const newRequest = createVacationRequest({
      userId,
      userName: user.name,
      userTeam: user.team,
      type,
      reason,
      startDate,
      endDate,
      managerId: manager.id,
      managerName: manager.name
    });

    res.status(201).json({
      success: true,
      data: newRequest
    });

  } catch (error) {
    console.error('Create vacation request error:', error);
    res.status(500).json({
      success: false,
      error: 'Внутренняя ошибка сервера'
    });
  }
});

// PUT /api/vacation/request/:id/status - обновить статус заявки (для менеджера)
router.put('/request/:id/status', (req, res) => {
  try {
    const requestId = parseInt(req.params.id);
    const { status, managerComment } = req.body;
    
    if (isNaN(requestId)) {
      return res.status(400).json({
        success: false,
        error: 'Неверный ID заявки'
      });
    }

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Неверный статус'
      });
    }

    const updatedRequest = updateVacationRequestStatus(requestId, status, managerComment);

    if (!updatedRequest) {
      return res.status(404).json({
        success: false,
        error: 'Заявка не найдена'
      });
    }

    res.json({
      success: true,
      data: updatedRequest
    });

  } catch (error) {
    console.error('Update request status error:', error);
    res.status(500).json({
      success: false,
      error: 'Внутренняя ошибка сервера'
    });
  }
});

export default router;
