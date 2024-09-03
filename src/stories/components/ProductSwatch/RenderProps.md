| property          | type                | description                            |
| ----------------- | ------------------- | -------------------------------------- |
| swatchList        | `Array<SwatchItem>` | List of renderable swatches            |
| selectedVariation | `SwatchItem`        | Selected swatch                        |
| selectVariation   | `number`            | Function to toggle the selected swatch |

<div></div>

- `SwatchItem`:

  | property      | type     | description                                                               |
  | ------------- | -------- | ------------------------------------------------------------------------- |
  | itemName      | `string` | Item name                                                                 |
  | variationId   | `string` | ID of the swatch variation                                                |
  | url           | `string` | URL to item's product details page                                        |
  | imageUrl      | `string` | URL associated with swatch, will override ProductCard image if provided   |
  | price         | `number` | Price associated with swatch, will override ProductCard price if provided |
  | swatchPreview | `string` | Either a url, or hexcode (Ex: #FFFFFF). Will be used as swatch icon       |
