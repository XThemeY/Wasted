import { Schema, model } from 'mongoose'

const roleSchema = new Schema({
  role: {
    type: String,
    unique: true,
    required: true,
    enum: ['User', 'Premium', 'Moderator', 'Admin'],
  },
  category: { type: String },
  permissions: [{ type: String }],
  __v: { type: Number, select: false },
})

const Role = model('Role', roleSchema)

export const getRoles = () => Role.find()
export const getRole = (role) => Role.findOne({ role })
