{
  "name": "Cart",
  "type": "object",
  "properties": {
    "user_email": {
      "type": "string"
    },
    "product_id": {
      "type": "string"
    },
    "product_name": {
      "type": "string"
    },
    "product_image": {
      "type": "string"
    },
    "price": {
      "type": "number"
    },
    "size": {
      "type": "string"
    },
    "color": {
      "type": "string"
    },
    "quantity": {
      "type": "number",
      "default": 1
    }
  },
  "required": [
    "user_email",
    "product_id",
    "quantity"
  ]
}