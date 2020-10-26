import RestComposer from "../../api/RestComposer";
import {SchemaDefinition, Schema as MSchema} from "mongoose";


const location: SchemaDefinition = new MSchema({
  street: String,
  postCode: String,
  type: {type: String, enum: ['Point'], default: 'Point'},
  coordinates: {type: [Number], required: true}
})

const Schema: SchemaDefinition = {
  deliveryStatus: {type: String, default: 'pending'},
  deliveryAddress: {type: location, required: [true, 'delivery address not provided']},
  originAddress: {type: location, required: [true, 'origin address not provided']},
  trackingNumber: {type: String, default: Date.now()}
}

export default class Request extends RestComposer {
  constructor() {
    super('request', Schema)
  }

}
