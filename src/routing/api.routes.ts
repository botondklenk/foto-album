import { Router } from 'express';
import { register, login, checkSession, logout } from '../services/auth'
import { getImage, getImages, saveImageData, uploadImage } from '../services/images';

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

router.post('/upload',
    checkSession,
    uploadImage(),
    saveImageData
);

router.get('/',
    getImages,
    getImage,
);

export default router;