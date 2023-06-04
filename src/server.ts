import mongoose from 'mongoose'
import app from './app'
import config from './config/index'
import { logger, errorLogger } from './shared/logger'

async function main() {
  try {
    await mongoose.connect(config.database_url as string)
    logger.info(`Database Connected Successfully`)

    app.listen(config.port, () => {
      logger.info(`UM Application listening on port ${config.port}`)
    })
  } catch (err) {
    errorLogger.error('Failed to Connect Database', err)
  }
}

main()
