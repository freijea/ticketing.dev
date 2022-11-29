import express, { Request, Response } from 'express';
import { requireAuth } from '@sitehub-website/common/build';

const router = express.Router();

router.post('/api/tickets', requireAuth, async (req: Request, res: Response) => {
  res.sendStatus(201);
});

export { router as createTicketRouter };

