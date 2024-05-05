import { Router } from 'express';
import { register, login, checkSession, logout } from './controllers/auth.controller';
import { render } from './controllers/render';

const router = Router();

// views
router.get('/register', 
    render('register')
);
router.get('/login',
    render('login')
);
router.get('/',
    render('index')
);

// api
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