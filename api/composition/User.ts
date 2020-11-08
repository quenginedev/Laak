import RestComposer, {IRestComposerOpt} from "../../api/RestComposer";
import { SchemaDefinition } from 'mongoose'

const UserSchema : SchemaDefinition = {
  uid: {type: String, required: true},
  displayName: { type: String },
  phoneNumber: String,
  email: String
}

export default class User extends RestComposer{
  constructor(cxt: IRestComposerOpt) {
    super('user', UserSchema, cxt);
  }
}
