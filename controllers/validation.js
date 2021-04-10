//validation middleware 
const {Validator, ValidationError} = require ('jsonschema');
const schema = require ('../schemas/listings.schema.js');
const v = new Validator();

exports.validateListings = async (ctx, next) => {
  
  const validationOptions = {
    throwError: true,
    allowUnknownAttributes: false
  };
  
  const body = ctx.request.body;
  
  try {
    v.validate(body, schema, validationOptions); // if the this validation is passed, then go to next()
    await next(); //go to the model to save to database
  }catch (error){
    if (error instanceof ValidationError){
      ctx.body = error;
      ctx.status = 400;
    }else{
      throw error;
    }
  }
}