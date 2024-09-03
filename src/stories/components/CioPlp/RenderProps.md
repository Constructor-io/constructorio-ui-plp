| property            | type                                                                        | description                                                                  |
| ------------------- | --------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| cioClient           | `Nullable<ConstructorIOClient>`                                             | The Constructor IO client instance                                           |
| cioClientOptions    | `CioClientOptions`                                                          | The Constructor IO client options                                            |
| setCioClientOptions | `React.Dispatch<CioClientOptions>`                                          | The Constructor IO options setter                                            |
| formatters          | [Formatters](./?path=/docs/components-cioplp--props#formatters)             | Data formatter functions for things like price, description, etc             |
| itemFieldGetters    | [ItemFieldGetters](./?path=/docs/components-cioplp--props#itemfieldgetters) | Data getter functions for things like price, description, etc                |
| callbacks           | [Callbacks](./?path=/docs/components-cioplp--props#callbacks)               | Callback functions to be composed with the library's internal tracking calls |
