module.exports = {
  "$schema" : "http://json-schema.org/draft-04/schema#",
  "id" : "/listing",
  "title" : "Dog Listing",
  "description" : "Dog listings in the blog",
  "type" : "object",
  "properties": {
    "dogName": {
      "description" : "The dog's name",
      "type" : "string",
    },
    "details":{
      "description" : "Description of the dog's details",
      "type" : "string",
    },
    "imageURL":{
      "description" : "URL for dog image to show in blog",
      "type" : "uri",
    },
     "published":{
      "description" : "Is the listing published or not",
      "type" : "boolean",
    },
     "employeeID":{
      "description" : "User ID of the article author",
      "type" : "integer",
      "minimum": 0
    },
     "location":{
      "description" : "The shelter dogs location ",
      "type" : "string",
    },
     "breeds":{
      "description" : "Type of dog breeds",
      "type" : "string",
    },
    
  },
  "required": ["dogName", "details", "employeeID"]
}