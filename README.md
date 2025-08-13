# No AI In My Metal 🤘

A small static website listing artists, festivals, and merchants in the metal scene to publicly shame them because they promote AI work.

## Local preview
Use any static web server. For example with Python:

```sh
python3 -m http.server 8080
```

Then open http://localhost:8080

## Add content
Edit `data/list.yml` and add items:

```yaml
- id: unique-id
  type: artist | festival | merchant
  name: Display Name
  summary: Short card blurb
  thumb: /assets/img/some-image.png
  tags: [tag1, tag2]
  links:
    website: https://example.com
  description: |
    Markdown text explaining why this is listed, with links.
```