import { Router } from 'express';
import * as Controller from '../../controller/voiceController.js';

const Routes = Router();

// Voice agent for the supplier questionnaire assistant — public, like /api/ai-chat,
// because the questionnaire is also reachable via unauthenticated supplier links.
Routes.post('/api/voice/transcribe', Controller.transcribe);
Routes.post('/api/voice/speak', Controller.speak);

export default Routes;
