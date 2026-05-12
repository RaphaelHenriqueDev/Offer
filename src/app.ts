import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { sequelize } from './config/database.js'
import { router } from './routes/index.js'
import { errorHandler } from './middlewares/errorHandler.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

app.use(express.json())
app.use(express.static(path.resolve(__dirname, '../public')))

app.use('/api', router)
app.use(errorHandler)

await sequelize.sync({ force: false })

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Offer rodando na porta ${port} 🚀`)
})
