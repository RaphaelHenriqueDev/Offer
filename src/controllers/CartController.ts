import type { Request, Response } from 'express'
import { Cart, CartItem, Product } from '../models/index.js'

// Definir a interface para o Request para incluir o userId
interface AuthRequest extends Request {
  userId?: number
}

export const CartController = {
  async addItem(req: AuthRequest, res: Response) { // Usar AuthRequest
    try {
      const { productId, quantity } = req.body
      const userId = req.userId // Obter userId do token JWT

      if (!userId) {
        return res.status(401).json({ message: 'Usuário não autenticado.' })
      }

      // Verifica se o produto existe
      const product = await Product.findByPk(productId)
      if (!product) {
        res.status(404).json({ message: 'Produto não encontrado' })
        return
      }

      // Busca ou cria o carrinho do usuário
      const [cart] = await Cart.findOrCreate({
        where: { userId },
      })

      // Verifica se o produto já está no carrinho
      const existingItem = await CartItem.findOne({
        where: { cartId: cart.id, productId },
      })

      if (existingItem) {
        // Se já existe, incrementa a quantidade
        await existingItem.update({
          quantity: existingItem.quantity + (quantity ?? 1),
        })
        res.status(200).json(existingItem)
        return
      }

      // Se não existe, cria o item
      const item = await CartItem.create({
        cartId: cart.id,
        productId,
        quantity: quantity ?? 1,
      })
      res.status(201).json(item)
    } catch (error) {
      console.error('Erro ao adicionar item ao carrinho:', error)
      res
        .status(500)
        .json({ message: 'Erro ao adicionar item ao carrinho', error })
    }
  },

  async listItems(req: AuthRequest, res: Response) { // Usar AuthRequest
    try {
      const userId = req.userId // Obter userId do token JWT

      if (!userId) {
        return res.status(401).json({ message: 'Usuário não autenticado.' })
      }

      const cart = await Cart.findOne({
        where: { userId },
        include: [{ model: CartItem, include: [Product] }],
      })

      if (!cart) {
        res.status(404).json({ message: 'Carrinho não encontrado' })
        return
      }

      res.status(200).json(cart)
    } catch (error) {
      console.error('Erro ao listar itens do carrinho:', error)
      res
        .status(500)
        .json({ message: 'Erro ao listar itens do carrinho', error })
    }
  },

  async updateItemQuantity(req: AuthRequest, res: Response) {
    try {
      const { itemId } = req.params
      const { quantity } = req.body
      const userId = req.userId

      if (!userId) {
        return res.status(401).json({ message: 'Usuário não autenticado.' })
      }

      if (quantity === undefined || quantity < 1) {
        return res.status(400).json({ message: 'A quantidade deve ser um número positivo.' })
      }

      const cart = await Cart.findOne({ where: { userId } })
      if (!cart) {
        return res.status(404).json({ message: 'Carrinho não encontrado.' })
      }

      const item = await CartItem.findOne({
        where: { id: itemId, cartId: cart.id },
      })

      if (!item) {
        return res.status(404).json({ message: 'Item do carrinho não encontrado.' })
      }

      await item.update({ quantity })
      res.status(200).json(item)
    } catch (error) {
      console.error('Erro ao atualizar quantidade do item no carrinho:', error)
      res.status(500).json({ message: 'Erro ao atualizar quantidade do item no carrinho', error })
    }
  },

  async removeItem(req: AuthRequest, res: Response) { // Usar AuthRequest
    try {
      const { itemId } = req.params
      const userId = req.userId

      if (!userId) {
        return res.status(401).json({ message: 'Usuário não autenticado.' })
      }

      const cart = await Cart.findOne({ where: { userId } })
      if (!cart) {
        return res.status(404).json({ message: 'Carrinho não encontrado.' })
      }

      const item = await CartItem.findOne({
        where: { id: itemId, cartId: cart.id },
      })

      if (!item) {
        return res.status(404).json({ message: 'Item do carrinho não encontrado.' })
      }

      await item.destroy()
      res.status(200).json({ message: 'Item removido do carrinho com sucesso.' })
    } catch (error) {
      console.error('Erro ao remover item do carrinho:', error)
      res
        .status(500)
        .json({ message: 'Erro ao remover item do carrinho', error })
    }
  },

  async clearCart(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId

      if (!userId) {
        return res.status(401).json({ message: 'Usuário não autenticado.' })
      }

      const cart = await Cart.findOne({ where: { userId } })
      if (!cart) {
        return res.status(404).json({ message: 'Carrinho não encontrado.' })
      }

      await CartItem.destroy({ where: { cartId: cart.id } })
      res.status(200).json({ message: 'Carrinho limpo com sucesso.' })
    } catch (error) {
      console.error('Erro ao limpar carrinho:', error)
      res.status(500).json({ message: 'Erro ao limpar carrinho', error })
    }
  },
}
