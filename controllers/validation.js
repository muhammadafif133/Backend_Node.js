/**
 * A module to run JSON Schema based validation on request/response data.
 * @module controllers/validation
 * @author Muhammad Afif bin Zainuddin
 * @see schemas/* for JSON Schema definition files
 */

const {Validator, ValidationError} = require ('jsonschema');

const listingSchema = require ('../schemas/listing.json').definitions.listing;
const userSchema = require ('../schemas/user.json').definitions.user;
const userUpdateSchema = require('../schemas/user.json').definitions.userUpdate;
const favouriteSchema = require ('../schemas/favourite.json').definitions.favourite;

/**
 * Wrapper that returns a Koa middleware validator for a given schema.
 * @param {object} schema - The JSON schema definiton of the resource.
 * @param {string} resource - The name of the resource e.g 'listings'
 * @returns {function} - A Koa middleawre handle taking (ctx,next) params
 */   

//validation factory to encapsulate the creation of the middleware
const makeKoaValidator = (schema, resource) => {
  
    const v = new Validator();
    const validationOptions = {
      throwError: true,
      propertyName: resource   
    };
     
    /**
     * Koa middleware handler function to do a validation
     * @param {object} ctx - The Koa request/response context object
     * @param {function} next - The Koa next callback
     * @throws {ValidationError} a jsonschema library exception
     */
     
   const handler = async (ctx, next) => {    

    const body = ctx.request.body;

    try {
      v.validate(body, schema, validationOptions); // if the this validation is passed, then go to next()
      await next(); //go to the model to save to database
    }catch (error){
      if (error instanceof ValidationError){
        console.error(error);
        ctx.status = 400
        ctx.body = error;
      }else{
        throw error;
      }
    }
  }
  return handler;
}

/** Validate data against listings schema */
exports.validateListing = makeKoaValidator(listingSchema, 'listing');
/** Validate data against users schema */
exports.validateUser = makeKoaValidator(userSchema, 'user');
/** Validate data against user schema for updating existing users */
exports.validateUserUpdate = makeKoaValidator(userUpdateSchema, 'userUpdate');
/** Validate data against favourites schema */
exports.validateFavourite = makeKoaValidator(favouriteSchema, 'favourite');
