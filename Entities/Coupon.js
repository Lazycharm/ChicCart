{
  "name": "Coupon",
  "type": "object",
  "properties": {
    "code": {
      "type": "string",
      "description": "Coupon code"
    },
    "type": {
      "type": "string",
      "enum": [
        "percentage",
        "fixed"
      ],
      "default": "percentage"
    },
    "value": {
      "type": "number",
      "description": "Discount value"
    },
    "min_order": {
      "type": "number",
      "description": "Minimum order amount"
    },
    "max_uses": {
      "type": "number"
    },
    "used_count": {
      "type": "number",
      "default": 0
    },
    "expires_at": {
      "type": "string",
      "format": "date"
    },
    "is_active": {
      "type": "boolean",
      "default": true
    }
  },
  "required": [
    "code",
    "type",
    "value"
  ]
}