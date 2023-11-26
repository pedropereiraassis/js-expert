import { NotImplementedException } from "../util/exceptions.js";

export default class BaseBusiness {
  _validateRequiredFields(_data) {
    throw new NotImplementedException(this._validateRequiredFields.name)
  }

  _create(_data) {
    throw new NotImplementedException(this._create.name)
  }

  /*
  Martin Fowler pattern - garantee methods flow, defining subsequencies to be executed
  This create() is the effective implementation of Template Method
  */
  create(data) {
    const isValid = this._validateRequiredFields(data)
    if (!isValid) {
      throw new Error(`invalid data`)
    }

    return this._create(data)
  }
}