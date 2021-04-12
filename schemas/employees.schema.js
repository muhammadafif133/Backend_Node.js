module.exports = {
  "$schema": "http://json-schema.org/draft-04/schema#",
  "id": "/user",
  "title": "User",
  "description": "A registered user of the blog",
  "type": "object",
  "properties": {
    "firstName": {
      "description": "First name",
      "type": "string"
    },
    "lastName": {
      "description": "Last name",
      "type": "string"
    },
    "empUsername": {
      "description": "Unique username",
      "type": "string"
    },
    "password": {
      "description": "Password for registration",
      "type": "string"
    },
    "email": {
      "description": "Unique email address",
      "type": "email"
    },
    "avatarURL": {
      "description": "URL of avatar image",
      "type": "uri"
    },    
  },
  "required": ["empUsername", "email", "password"],
  "additionalProperties": false
}
