{
  "name": "Review",
  "type": "object",
  "properties": {
    "product_id": {
      "type": "string"
    },
    "user_email": {
      "type": "string"
    },
    "user_name": {
      "type": "string"
    },
    "rating": {
      "type": "number"
    },
    "title": {
      "type": "string"
    },
    "comment": {
      "type": "string"
    },
    "images": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "verified_purchase": {
      "type": "boolean",
      "default": false
    },
    "helpful_count": {
      "type": "number",
      "default": 0
    }
  },
  "required": [
    "product_id",
    "rating"
  ]
}