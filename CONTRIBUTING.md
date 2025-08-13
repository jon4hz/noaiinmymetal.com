# Contributing

Thanks for helping keep AI out of the metal scene.

## How to add or edit entries
1. Edit `data/list.yml`.
2. Add an item with a unique `id`, set `type` to `artist`, `festival`, or `merchant`.
3. Provide a short `summary`, optional `thumb`, `tags`, and a `description` explaining why it’s listed.
4. Link to sources in the description when possible.

Example:

```yaml
- id: my-unique-id
  type: artist
  name: Some Band
  summary: Used AI cover art in 2025.
  thumb: assets/img/some-image.png
  tags: [ai-art, cover]
  links:
    website: https://example.com
  description: |
    In Aug 2025, they posted AI cover art. Source: [Instagram](https://instagram.com/...)
```

## Local preview
Serve the site with any static server and open http://localhost:8080
