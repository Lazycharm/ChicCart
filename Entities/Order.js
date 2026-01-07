{
  "name": "Order",
  "type": "object",
  "properties": {
    "order_number": {
      "type": "string"
    },
    "customer_email": {
      "type": "string"
    },
    "customer_name": {
      "type": "string"
    },
    "items": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "product_id": {
            "type": "string"
          },
          "product_name": {
            "type": "string"
          },
          "product_image": {
            "type": "string"
          },
          "size": {
            "type": "string"
          },
          "color": {
            "type": "string"
          },
          "quantity": {
            "type": "number"
          },
          "price": {
            "type": "number"
          }
        }
      }
    },
    "subtotal": {
      "type": "number"
    },
    "discount": {
      "type": "number",
      "default": 0
    },
    "coupon_code": {
      "type": "string"
    },
    "shipping": {
      "type": "number"
    },
    "total": {
      "type": "number"
    },
    "status": {
      "type": "string",
      "enum": [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled"
      ],
      "default": "pending"
    },
    "payment_method": {
      "type": "string",
      "enum": [
        "card",
        "paypal",
        "cod"
      ]
    },
    "payment_status": {
      "type": "string",
      "enum": [
        "pending",
        "paid",
        "failed",
        "refunded"
      ],
      "default": "pending"
    },
    "shipping_address": {
      "type": "object",
      "properties": {
        "street": {
          "type": "string"
        },
        "city": {
          "type": "string"
        },
        "state": {
          "type": "string"
        },
        "zip": {
          "type": "string"
        },
        "country": {
          "type": "string"
        },
        "phone": {
          "type": "string"
        }
      }
    },
    "tracking_number": {
      "type": "string"
    },
    "notes": {
      "type": "string"
    }
  },
  "required": [
    "order_number",
    "customer_email",
    "items",
    "total"
  ]
}