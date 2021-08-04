import { Router } from 'express';
import UserRouter from './user';
import JobsRouter from './jobs';
import LicenseRouter from './license';
import GameDataRouter from './game_data';
const router = Router();

router.use('/user', UserRouter);
router.use('/jobs', JobsRouter);
router.use('/license', LicenseRouter);
router.use('/game_data', GameDataRouter);

export default router;