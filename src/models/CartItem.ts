import { DataTypes, Model, type Optional } from 'sequelize'
import { sequelize } from '../config/database.js'

interface CartItemAttributes {
  id: number
  cartId: number
  productId: number
  quantity: number
}

type CartItemCreationAttributes = Optional<CartItemAttributes, 'id'>

class CartItem extends Model<CartItemAttributes, CartItemCreationAttributes> {
  declare id: number
  declare cartId: number
  declare productId: number
  declare quantity: number
  declare readonly createdAt: Date
  declare readonly updatedAt: Date
}

CartItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    cartId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    sequelize,
    tableName: 'cart_items',
    timestamps: true,
  },
)

export { CartItem }
export type { CartItemAttributes, CartItemCreationAttributes }
