import { SchemaDefinition } from 'mongoose'
import RestComposer, { IRestComposerOpt } from '../RestComposer'
import { Types } from 'mongoose'

const ShippingSchema: SchemaDefinition = {
  driver_id: { type: Types.ObjectId, ref: 'driver' },
  products_ids: [{type: Types.ObjectId, ref: 'request'}],
  last_seen_log: [{
    time: Date,
    type: {type: String, enum: ['Point'], default: 'Point'},
    coordinates: {type: [Number]}
  }]
}

export default class Shipping extends RestComposer {
  constructor(cxt: IRestComposerOpt) {
    super('shipping', ShippingSchema, cxt);
  }
}
