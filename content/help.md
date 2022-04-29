## Code Highlighting

To add code higlighting, type a code comment in the language you
have selected in the editor toolbar containing the following:

-   `{*}` - Focus
-   `{+}` - Add
-   `{-}` - Remove
-   `{#[hex]}` - Custom Hex Color

For example, this:

```php
public function index() // {#caebf9}
{
    return User::all(); // {-}{*}
    return User::paginate(); // {+}{*}
}
```

Will produce this:

<p align="center">
<img src="https://user-images.githubusercontent.com/6421846/162449550-4635aa6b-5e4b-4d71-b14b-6ab40e484cc8.png" width="400"/>
</p>
