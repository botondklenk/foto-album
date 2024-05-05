import { Router } from 'express';
import { render } from './services/render';

const router = Router();

router.get('/register', 
    render('register')
);
router.get('/login',
    render('login')
);
router.get('/',
    render('index')
);

export default router;