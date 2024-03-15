import mongoose, { Schema, model } from 'mongoose';

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
    const counter = await mongoose.connection
      .collection('counters')
      .findOneAndUpdate(
        { _id: 'prodCompanyid' },
        { $inc: { seq: 1 } },
        { upsert: true },
      );
    this.id = counter.seq + 1;
  }
  next();
});

const ProdCompany = model('ProdCompany', prodCompanySchema);

export default ProdCompany;
