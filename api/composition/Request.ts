import RestComposer, {IRestComposerOpt} from "../../api/RestComposer"
import {SchemaDefinition, Schema as MSchema} from "mongoose"

const location: SchemaDefinition = new MSchema({
  street: String,
  postCode: String,
  type: {type: String, enum: ['Point'], default: 'Point'},
  coordinates: {type: [Number], required: [true, 'location coordinates not provided']}
})

const Schema: SchemaDefinition = {
  user: {
    _id: { type: String, required: true },
    displayName: String
  },
  package: {
    width: Number,
    height: Number,
    length: Number
  },
  status: {
    type: String, enum: [
      'pending',
      'assigned to shipping',
      'on route',
      'delivered',
      'failed'
    ], default: 'pending'
  },
  delivery: {
    date: {type: Date, required: true},
    phoneNumber: {type: String, required: [true, 'delivery phone number required']},
    location: {type: location, required: [true, 'delivery address not provided']}
  },
  pickup: {
    date: {type: Date, required: true},
    phoneNumber: {type: String, required: [true, 'origin phone number required']},
    location: {type: location, required: [true, 'origin address not provided']}
  },
  driver_id: String,
  price: Number
}

export default class Request extends RestComposer {
  constructor(cxt: IRestComposerOpt) {
    super('request', Schema, cxt)
  }
}
