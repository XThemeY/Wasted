const { Schema, model } = require("mongoose");

const roleSchema = new Schema({
  role: { type: String, unique: true, default: "User" },
});

const Role = model("Role", roleSchema);

module.exports = Role;
