import { User } from './User.js'
import { Product } from './Product.js'
import { Cart } from './Cart.js'
import { CartItem } from './CartItem.js'

// Um usuário tem um carrinho
User.hasOne(Cart, { foreignKey: 'userId' })
Cart.belongsTo(User, { foreignKey: 'userId' })

// Um carrinho tem muitos itens
Cart.hasMany(CartItem, { foreignKey: 'cartId' })
CartItem.belongsTo(Cart, { foreignKey: 'cartId' })

// Um produto pode estar em muitos itens
Product.hasMany(CartItem, { foreignKey: 'productId' })
CartItem.belongsTo(Product, { foreignKey: 'productId' })

export { User, Product, Cart, CartItem }
