<p align="center">
  <img src="https://github.com/stevebauman/showcode/blob/master/static/logo.svg" width="200">
</p>

<p align="center">
  Create beautiful images of code.
</p>

<p align="center">
  <a href="https://github.com/stevebauman/showcode/actions">
    <img src="https://github.com/stevebauman/showcode/actions/workflows/run-tests.yml/badge.svg">
  </a>

  <a href="https://app.netlify.com/sites/festive-hermann-8f687a/deploys">
    <img src="https://api.netlify.com/api/v1/badges/d70b101b-8b59-4615-ade1-23c055a6133b/deploy-status">
  </a>
</p>

## Highlighting

To add code higlighting, type a code comment in your language of choice, containing the following:

- `{*}` - Focus
- `{+}` - Add
- `{-}` - Remove
- `{#[hex]}` - Custom Hex Color

For example, this:

```php
public function index() // {#caebf9}
{
    return User::all(); // {-}{*}
    return User::paginate(); // {+}{*}
}
```

Produces this:

<img src="https://user-images.githubusercontent.com/6421846/162449550-4635aa6b-5e4b-4d71-b14b-6ab40e484cc8.png" width="400"/>

## Local Installation

1. Clone the git repo
2. Run `npm install && npm run dev`
3. Visit http://localhost:3000

## Showcode Desktop

Showcode can also be purchased as a standalone desktop application:

https://showcode.app/buy

Thank you for your support! 🙏
