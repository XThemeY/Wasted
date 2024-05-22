import { Schema, model } from 'mongoose';
import { Counter } from '#db/models/index.js';

const prodCompanySchema = new Schema(
  {
    id: { type: Number, unique: true, immutable: true },
    name: { type: String, required: true, index: true },
    logo_url: { type: String },
  },
  {
    timestamps: true,
  },
);

prodCompanySchema.pre('save', async function (next) {
  if (this.isNew) {
    this.id = (
      await Counter.findOneAndUpdate(
        { _id: 'prodcompanyid' },
        { $inc: { count: 1 } },
        { returnDocument: 'after', upsert: true },
      )
    ).count;
  }
  next();
});

const ProdCompany = model('ProdCompany', prodCompanySchema);

export default ProdCompany;
