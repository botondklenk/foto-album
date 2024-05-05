import { Router } from 'express';
import { register, login, checkSession, logout } from './services/auth'

const router = Router();

router.post('/register',
    register, 
);
router.post('/login',
    login,
);
router.get('/logout',
    checkSession,
    logout
);

export default router;