import { Schema, model } from 'mongoose';

const roleSchema = new Schema({
  role: {
    type: String,
    unique: true,
    required: true,
  },
  permissions: [{ type: String }],
});

const Role = model('Role', roleSchema);

export default Role;
