import { Schema, model } from 'mongoose';

const roleSchema = new Schema({
  role: {
    type: String,
    unique: true,
    required: true,
    enum: ['User', 'Premium', 'Moderator', 'Admin'],
  },
  category: { type: String },
  permissions: [{ type: String }],
});

const Role = model('Role', roleSchema);

export default Role;
