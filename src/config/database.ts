import { Sequelize } from 'sequelize'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.resolve(__dirname, '../../database/offer.sqlite'),
})

try {
  await sequelize.authenticate()
  console.log('Conexão com o db feita com sucesso!')
} catch (error) {
  console.error('Não foi possível conectar ao db:', error)
}
