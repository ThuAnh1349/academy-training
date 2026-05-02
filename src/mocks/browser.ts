import { setupWorker } from 'msw/browser';
import { academyHandlers } from './handlers/academy.handlers';

export const worker = setupWorker(...academyHandlers);
