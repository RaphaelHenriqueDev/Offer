import type { Request, Response } from 'express'
import { Product } from '../models/index.js'

export const ProductController = {
  async create(req: Request, res: Response) {
    try {
      const { name, description, price, imageUrl } = req.body
      const product = await Product.create({
        name,
        description,
        price,
        imageUrl,
      })
      res.status(201).json(product)
    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar produto', error })
    }
  },

  async update(req: Request, res: Response) {
    try {
      const id = req.params['id'] as string
      const { name, description, price, imageUrl } = req.body
      const product = await Product.findByPk(id)

      if (!product) {
        res.status(404).json({ message: 'Produto não encontrado' })
        return
      }

      await product.update({ name, description, price, imageUrl })
      res.status(200).json(product)
    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar produto', error })
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const id = req.params['id'] as string
      const product = await Product.findByPk(id)

      if (!product) {
        res.status(404).json({ message: 'Produto não encontrado' })
        return
      }

      await product.destroy()
      res.status(200).json({ message: 'Produto deletado com sucesso' })
    } catch (error) {
      res.status(500).json({ message: 'Erro ao deletar produto', error })
    }
  },
  async getAll(req: Request, res: Response) {
    try {
      const products = await Product.findAll()
      res.status(200).json(products)
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar produtos', error })
    }
  },
}
