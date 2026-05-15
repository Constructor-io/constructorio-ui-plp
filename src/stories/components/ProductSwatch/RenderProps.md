| property          | type                          | description                            |
| ----------------- | ----------------------------- | -------------------------------------- |
| swatchList        | `Array<SwatchItem>`           | List of renderable swatches            |
| selectedVariation | `SwatchItem`                  | Selected swatch                        |
| selectVariation   | `(swatch: SwatchItem) => void`| Function to toggle the selected swatch |
| visibleSwatches   | `SwatchItem[] \| undefined`   | Subset of `swatchList` limited by `maxVisibleSwatches`. Equals `swatchList` when no limit is set. (📦 v1.16.1) |
| hiddenSwatches    | `SwatchItem[] \| undefined`   | Swatches beyond the `maxVisibleSwatches` limit. `undefined` when no swatches are hidden. (📦 v1.16.1) |
| totalSwatchCount  | `number`                      | Total number of swatches in `swatchList`. (📦 v1.16.1) |
| hasMoreSwatches   | `boolean`                     | Whether there are hidden swatches beyond the visible limit. (📦 v1.16.1) |

<div></div>

- `SwatchItem`:

  | property      | type     | description                                                               |
  | ------------- | -------- | ------------------------------------------------------------------------- |
  | itemName      | `string` | Item name                                                                 |
  | variationId   | `string` | ID of the swatch variation                                                |
  | url           | `string` | URL to item's product details page                                        |
  | imageUrl      | `string` | URL associated with swatch, will override ProductCard image if provided   |
  | price         | `number` | Price associated with swatch, will override ProductCard price if provided |
  | salePrice     | `number` | Sale price associated with swatch                                         |
  | rolloverImage | `string` | Rollover image URL associated with swatch                                 |
  | swatchPreview | `string` | Either a url, or hexcode (Ex: #FFFFFF). Will be used as swatch icon       |
