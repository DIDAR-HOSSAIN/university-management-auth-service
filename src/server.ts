import mongoose from 'mongoose';
import app from './app';
import config from './config/index';
import { logger, errorLogger } from './shared/logger';
import { Server } from 'http';

process.on('uncaughtException', error => {
  errorLogger.error(error);
  process.exit(1);
});

let server: Server;

async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    logger.info(`Database Connected Successfully`);

    server = app.listen(config.port, () => {
      logger.info(`UM Application listening on port ${config.port}`);
    });
  } catch (err) {
    errorLogger.error('Failed to Connect Database', err);
  }

  process.on('unhandledRejection', error => {
    console.log('unhandled rejection is detected, we are closing server...');
    if (server) {
      server.close(() => {
        errorLogger.error(error);
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
}

main();

process.on('SIGTERM', () => {
  logger.info('SIGTERM is receved');
  if (server) {
    server.close();
  }
});
