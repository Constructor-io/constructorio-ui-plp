| property           | type                                | description                                                                                                                 |
| ------------------ | ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| groupOptions       | `Array<PlpItemGroup>`               | List of transformed child groups that can be used as options                                                                |
| optionsToRender    | `Array<PlpItemGroup>`               | Dynamic list of child groups to be rendered as options                                                                      |
| setOptionsToRender | `(Array<PlpItemGroup>) => void`     | Setter function for `optionsToRender`                                                                                       |
| setGroup           | `(groupId: string \| null) => void` | Function to update the groupFilter in the url. This triggers a page refresh by default                                      |
| currentGroupId     | `string`                            | The current group_id of the query. Defaults to the root group                                                               |
| selectedGroupId    | `string`                            | The current group_id selected. Used for rendering the selected group before updating the url                                |
| setSelectedGroupId | `(string) => void`                  | Setter function for `selectedGroupId`                                                                                       |
| onOptionSelect     | `(string\|null) => void`            | Callback function to be used when an option is selected. Updates both `selectedGroupId` and url                             |
| goToGroupFilter    | `(Breadcrumb) => void`              | Callback function to be used when a breadcrumb is selected for backwards navigation. Updates both `selectedGroupId` and url |
| breadcrumbs        | `Array<Breadcrumbs>`                | Returned from `useCioBreadcrumbs`                                                                                           |
| initialNumOptions  | `number`                            | The initial number of options to render. Defaults to 5                                                                      |
| isShowAll          | `boolean`                           | Boolean indicating if all child group options are shown                                                                     |
| setIsShowAll       | `(boolean) => void`                 | Setter function for isShowAll                                                                                               |
