{
  "name": "Product",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Product name"
    },
    "slug": {
      "type": "string",
      "description": "URL-friendly slug"
    },
    "description": {
      "type": "string",
      "description": "Product description"
    },
    "price": {
      "type": "number",
      "description": "Regular price"
    },
    "sale_price": {
      "type": "number",
      "description": "Sale price (if on sale)"
    },
    "images": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Product image URLs"
    },
    "category": {
      "type": "string",
      "description": "Product category"
    },
    "sizes": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Available sizes"
    },
    "colors": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "hex": {
            "type": "string"
          }
        }
      },
      "description": "Available colors"
    },
    "stock": {
      "type": "number",
      "description": "Stock quantity"
    },
    "featured": {
      "type": "boolean",
      "default": false
    },
    "is_new": {
      "type": "boolean",
      "default": false
    },
    "is_flash_deal": {
      "type": "boolean",
      "default": false
    },
    "rating": {
      "type": "number",
      "description": "Average rating"
    },
    "reviews_count": {
      "type": "number",
      "description": "Number of reviews"
    },
    "meta_title": {
      "type": "string"
    },
    "meta_description": {
      "type": "string"
    }
  },
  "required": [
    "name",
    "price",
    "category"
  ]
}