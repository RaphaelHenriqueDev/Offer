import type { Request, Response } from 'express'
import { User } from '../models/index.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Definir uma chave secreta para o JWT. Em um ambiente de produção, isso deve vir de variáveis de ambiente.
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey'

export const UserController = {
  async register(req: Request, res: Response) {
    try {
      const { name, email, phone, password } = req.body

      if (!name || !email || !phone || !password) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' })
      }

      const existingUser = await User.findOne({ where: { email } })
      if (existingUser) {
        return res.status(409).json({ message: 'Usuário com este email já existe.' })
      }

      const hashedPassword = await bcrypt.hash(password, 10)
      const user = await User.create({ name, email, phone, password: hashedPassword })

      // Não retornar a senha hasheada na resposta
      const userResponse = { id: user.id, name: user.name, email: user.email, phone: user.phone }
      res.status(201).json(userResponse)
    } catch (error) {
      console.error('Erro ao registrar usuário:', error)
      res.status(500).json({ message: 'Erro ao registrar usuário', error })
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body

      if (!email || !password) {
        return res.status(400).json({ message: 'Email e senha são obrigatórios.' })
      }

      const user = await User.findOne({ where: { email } })
      if (!user) {
        return res.status(401).json({ message: 'Credenciais inválidas.' })
      }

      const isPasswordValid = await bcrypt.compare(password, user.password || '')
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Credenciais inválidas.' })
      }

      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' })
      res.status(200).json({ token })
    } catch (error) {
      console.error('Erro ao fazer login:', error)
      res.status(500).json({ message: 'Erro ao fazer login', error })
    }
  },

  async update(req: Request, res: Response) {
    try {
      const id = req.params['id'] as string
      const { name, email, phone, password } = req.body
      const user = await User.findByPk(id)

      if (!user) {
        res.status(404).json({ message: 'Usuário não encontrado' })
        return
      }

      const updateData: { name?: string; email?: string; phone?: string; password?: string } = { name, email, phone }
      if (password) {
        updateData.password = await bcrypt.hash(password, 10)
      }

      await user.update(updateData)
      // Não retornar a senha hasheada na resposta
      const userResponse = { id: user.id, name: user.name, email: user.email, phone: user.phone }
      res.status(200).json(userResponse)
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error)
      res.status(500).json({ message: 'Erro ao atualizar usuário', error })
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const id = req.params['id'] as string
      const user = await User.findByPk(id)

      if (!user) {
        res.status(404).json({ message: 'Usuário não encontrado' })
        return
      }

      await user.destroy()
      res.status(200).json({ message: 'Usuário deletado com sucesso' })
    } catch (error) {
      console.error('Erro ao deletar usuário:', error)
      res.status(500).json({ message: 'Erro ao deletar usuário', error })
    }
  },
}
