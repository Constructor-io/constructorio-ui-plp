| property    | type                                                                             | description                                                                                              |
| ----------- | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| item        | [Item](./?path=/docs/components-productcard--props#item)                         | Constructor's Transformed API Item Object                                                                |
| productInfo | `ProductInfo`                                                                    | Renderable item fields                                                                                   |
| formatPrice | [formatters.formatPrice](./?path=/docs/components-cioplp--props#formatters)      | Function to format the price. Defaults to "$0.00". Set globally at the CioPlp provider level             |
| onAddToCart | [callbacks.onAddToCart](./?path=/docs/components-cioplp--props#callbacks)        | Function to run on add-to-cart event. Set globally at the CioPlp provider level. Includes C.io tracking  |
| onClick     | [callbacks.onProductCardClick](./?path=/docs/components-cioplp--props#callbacks) | Function to run on Product Card Click. Set globally at the CioPlp provider level. Includes C.io tracking |

- `ProductInfo`:

  | property      | type                                                                                                                  | description               |
  | ------------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------- |
  | productSwatch | [ProductSwatch](../?path=/docs/components-productswatch--code-examples#arguments-passed-to-children-via-render-props) | Result ID of the response |
  | itemName      | `string`                                                                                                              | Name of item              |
  | itemPrice     | `number`                                                                                                              | Price of item             |
  | itemImageUrl  | `string`                                                                                                              | URL of item image         |
  | itemUrl       | `string`                                                                                                              | URL to item PDP           |
