import type { IProdCompanyModel } from '#interfaces/IModel';
import { Schema, model } from 'mongoose';

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
    this.id = (await ProdCompany.countDocuments()) + 1;
  }
  next();
});

const ProdCompany = model<IProdCompanyModel>('ProdCompany', prodCompanySchema);

export default ProdCompany;
