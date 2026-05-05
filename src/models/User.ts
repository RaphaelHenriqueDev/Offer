import { DataTypes, Model, type Optional } from 'sequelize'
import { sequelize } from '../config/database.js'

interface UserAttributes {
  id: number
  name: string
  email: string
  phone: string
  password?: string
}

type UserCreationAttributes = Optional<UserAttributes, 'id'>

class User extends Model<UserAttributes, UserCreationAttributes> {
  declare id: number
  declare name: string
  declare email: string
  declare phone: string
  declare password?: string
  declare readonly createdAt: Date
  declare readonly updatedAt: Date
}
User.init(
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
  },
)

export { User }
export type { UserAttributes, UserCreationAttributes }
