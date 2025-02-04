import mongoose from "mongoose";
import MongoosePaginate from "mongoose-paginate-v2";

const Schema = mongoose.Schema;

const invoiceSchema = new Schema({
  invoiceNo: {
    type: String,
    unique: true
  },
  booking: {
    type: Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Paid', 'UnPaid', 'Cancelled'],
    default: 'Pending'
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  versionKey: false
});

// Plugin for pagination
invoiceSchema.plugin(MongoosePaginate);

// Pre-save middleware to generate invoice number
invoiceSchema.pre('save', async function(next) {
  if (this.isNew) {
    try {
      // Find the last invoice to get the last invoice number
      const lastInvoice = await this.constructor.findOne({}, {}, { sort: { createdAt: -1 } });
      
      let nextNumber = 1;
      if (lastInvoice && lastInvoice.invoiceNo) {
        // Extract the numeric part and increment
        const lastNumber = parseInt(lastInvoice.invoiceNo.replace('INV', ''), 10);
        nextNumber = lastNumber + 1;
      }
      
      // Format the invoice number with leading zeros
      this.invoiceNo = `INV${nextNumber.toString().padStart(4, '0')}`;
      
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

// Export the Invoice model
const Invoice = mongoose.model('Invoice', invoiceSchema);

export default Invoice;