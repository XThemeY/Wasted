import { Schema, model } from "mongoose";

const roleSchema = new Schema({
  role: { type: String, unique: true, default: "User" },
});

const Role = model("Role", roleSchema);

export default Role;
