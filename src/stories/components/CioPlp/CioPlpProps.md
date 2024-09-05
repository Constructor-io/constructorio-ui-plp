### `Formatters`

Formatters will be used to modify how certain fields are rendered

| property    | type                        | description           |
| ----------- | --------------------------- | --------------------- |
| formatPrice | `(price: number) => string` | Format price funciton |

### `ItemFieldGetters`

ItemFieldGetters maps the fields sent in the catalog feeds to the fields the libary expects for rendering

| property | type                     | description        |
| -------- | ------------------------ | ------------------ |
| getPrice | `(item: Item) => number` | Get price funciton |

### `Callbacks`

Callbacks will be composed with the library's internal tracking calls for a given event

| property           | type                                                       | description                            |
| ------------------ | ---------------------------------------------------------- | -------------------------------------- |
| onAddToCart        | `(event: React.MouseEvent, item: Item) => void`            | Product add to cart callback function  |
| onProductCardClick | `(event: React.MouseEvent, item: Item) => void`            | Product click callback function        |
| onSwatchClick      | `(e: React.MouseEvent, clickedSwatch: SwatchItem) => void` | Product swatch click callback function |
| onRedirect         | `(url: string) => void`                                    | Redirect callback function             |
