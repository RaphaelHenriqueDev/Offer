import { DataTypes, Model, type Optional } from 'sequelize'
import { sequelize } from '../config/database.js'

interface CartAttributes {
  id: number
  userId: number
}

type CartCreationAttributes = Optional<CartAttributes, 'id'>

class Cart extends Model<CartAttributes, CartCreationAttributes> {
  declare id: number
  declare userId: number
  declare readonly createdAt: Date
  declare readonly updatedAt: Date
}

Cart.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'carts',
    timestamps: true,
  },
)

export { Cart }
export type { CartAttributes, CartCreationAttributes }
