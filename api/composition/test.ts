import RestComposer, {IRestComposerOpt} from "../../api/RestComposer";
import {SchemaDefinition} from "mongoose";


const Schema: SchemaDefinition = {
  name: {
    type: String, default: 'hello'
  }
}

export default class TestComposer extends RestComposer {
  constructor(cxt: IRestComposerOpt) {
    super('test', Schema, cxt)
  }

}
