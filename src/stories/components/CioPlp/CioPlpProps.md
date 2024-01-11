
  ### `Formatters`: 

  | property              | type                                   | description                  |
  |-----------------------|----------------------------------------|------------------------------|
  | formatPrice           | `(price: number) => string`            | Format price funciton        |

  ### `Getters`: 

  | property              | type                                   | description                  |
  |-----------------------|----------------------------------------|------------------------------|
  | getPrice              | `(item: Item) => number`               | Get price funciton        |

  ### `Callbacks`: 

  | property              | type                                              | description                  |
  |-----------------------|---------------------------------------------------|------------------------------|
  | onAddToCart           | `(event: React.MouseEvent, item: Item) => void`   | Product add to cart callback function        |
  | onProductCardClick    | `(event: React.MouseEvent, item: Item) => void`   | Product click callback function      |
