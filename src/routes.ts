import { Router } from 'express';
import { register, login, checkSession, logout } from './controllers/auth.controller';
import { render } from './controllers/render';

const router = Router();

router.use('/register',
    // register,
    render('register')
);

router.use('/login', 
    // login,
    render('login')
);

router.use('/logout',
    checkSession,
    logout
);

router.use('/protected', 
    checkSession,
    (req, res) => { res.send('You are authenticated');}
);

router.use('/',
    render('index')
);

export default router;