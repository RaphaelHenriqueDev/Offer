import { DataTypes, Model, type Optional } from 'sequelize'
import { sequelize } from '../config/database.js'

interface ProductAttributes {
  id: number
  name: string
  description: string
  price: number
  imageUrl: string
  createdAt?: Date
  updatedAt?: Date
}

type ProductCreationAttributes = Optional<ProductAttributes, 'id'>

class Product
  extends Model<ProductAttributes, ProductCreationAttributes>
  implements ProductAttributes
{
  declare id: number
  declare name: string
  declare description: string
  declare price: number
  declare imageUrl: string
  declare readonly createdAt: Date
  declare readonly updatedAt: Date
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'products',
    timestamps: true,
  },
)

export { Product }
export type { ProductAttributes, ProductCreationAttributes }
