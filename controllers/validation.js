//validation middleware 
const {Validator, ValidationError} = require ('jsonschema');

const listingSchema = require ('../schemas/listings.schema.js');
const employeeSchema = require ('../schemas/employees.schema.js');
const userSchema = require ('../schemas/users.schema.js');
const favouriteSchema = require ('../schemas/favourites.schema.js');

//validation factory to encapsulate the creation of the middleware
const makeKoaValidator = (schema, resource) => {
  
    const v = new Validator();
    const validationOptions = {
      throwError: true,
      allowUnknownAttributes: false
    };
     
    const handler = async (ctx, next) => {    

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
  return handler;
}

exports.validateListing = makeKoaValidator(listingSchema, 'listings');
exports.validateEmployee = makeKoaValidator(employeeSchema, 'employees');
exports.validateUser = makeKoaValidator(userSchema, 'users');
exports.validateFavourite = makeKoaValidator(favouriteSchema, 'favourites');
