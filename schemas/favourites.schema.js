module.exports = {
  "$schema": "http://json-schema.org/draft-04/schema#",
  "id": "/favourite",
  "title": "Favourite",
  "description": "A favourite of the dog listing",
  "type": "object",
  "properties": {
    "listingID": {
      "description": "ID of the listing this favourite is about",
      "type": "integer",
      "minimum": 0
    },
    "userID": {
      "description": "ID of the user favouriting this listing",
      "type": "integer",
      "minimum": 0
    }
  },
  "required": ["articleID", "authorID"],
  "additionalProperties": false
}