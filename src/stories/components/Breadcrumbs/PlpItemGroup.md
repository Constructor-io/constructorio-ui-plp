### `PlpItemGroup`

| property    | type                       | description                                    |
| ----------- | -------------------------- | ---------------------------------------------- | ------------------- |
| groupId     | `string`                   | Unique identifier for the group group          |
| displayName | `string`                   | Name to be displayed for the group on the UI   |
| count       | `number`                   | Number of items contained within current group |
| data        | `object                    | null`                                          | Additional metadata |
| children    | `Array<PlpItemGroup>`      | Children groups relative to current group      |
| parents     | `{ groupId, displayName }` | Parent groups relative to current group        |
