{
  "name": "Category",
  "type": "object",
  "properties": {
    "name": {
      "type": "string"
    },
    "slug": {
      "type": "string"
    },
    "image": {
      "type": "string"
    },
    "description": {
      "type": "string"
    },
    "parent_category": {
      "type": "string"
    },
    "display_order": {
      "type": "number",
      "default": 0
    }
  },
  "required": [
    "name",
    "slug"
  ]
}