## Show Cases

**Header animation**

![]()

### Run example

```bash
npm i
```

### Basic Usage

- Install react-native-custom-list

```bash
$ npm install --save react-native-custom-list
```

- Then, use this:

```typescript
import CustomList from "react-native-custom-list";


export default class App extends React.Component {
    render: function() {
        return (
          <CustomList
              data={this.state.data}
              renderItem={this.renderRow}
              keyExtractor={this._getKeyExtrator}
              extraData={this.state.data.length}
              // getRef={ref => (this.refOfScrollList = ref)}
              enableHeaderRefresh
              refreshState={this.state.loading}
              setHeaderHeight={225}
              onTopReachedThreshold={10}
              headerRefresh={HeaderRefresh}
              onHeaderRefreshing={this.refresh}
              onEndReached={this.loadMore}
              ListFooterComponent={this.renderFooter}
              onEndReachedThreshold={0.8}
          />
        )
    }
}
```
You can see detail in the example

### Props

| parameter              | type                                                                                   | required | description                                                                                                                                                                                                                          | default                                                   |
| :--------------------- | :------------------------------------------------------------------------------------- | :------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------- |
| data              | array                                                                                  | yes      | Data Source                                                                                                                                                                                                                         |                                                           |
| renderItem        | function                                                                                | yes       | as FlatList renderItem                                                                                                                                                                                                                    | `true`                                                    |
| keyExtractor            | function<br><br>`(content?: JSX.Element) => string`                                      | no       | as FlatList keyExtractor                                                                                                                                                                                                           | `() => {}`                                                |
| extraData               | function<br><br>`() => void`                                                           | no       | as FlatList extraData                                                                                                                                                                                                        | `() => {}`                                                |
| refreshState          | boolean                                                                                 | yes       | State indicate refresh                                                                                                                                                                                                     | `80`                                                      |
| setHeaderHeight            | number                                                                                 | yes       | HeaderRefresh height                                                                                                                                                                 | `300`                                                     |
| onTopReachedThreshold                  | number                                                                                 | no       | Init index of images                                                                                                                                                                                                                 | `0`                                                       |
| enableHeaderRefresh        | boolean                                                  | no       | Enable Header Refresh                                                                                                                                                                                                                 | `''`                                                      |
| headerRefresh          |  React.ReactElement<any>                                       | no       | HeaderRefresh component                                                                                                                                                                                                             | `() => null`                                              |
| onHeaderRefreshing         | function<br><br>`() => void`                                              | no       | Function used to load data when refresh                                                                                                                                                                                                     | `() => {}`                                                |
| onEndReached               | function<br><br>`() => void`                                              | no       | as FlatList onEndReached                                                                                                                                                                                                            | `() => {}`                                                |
| ListFooterComponent | function<br><br> `() => React.ReactElement<any>`                                                                                | no       | as FlatList ListFooterComponent                                                                                                                                                                                              | `true`                                                    |
| onEndReachedThreshold                | function<br><br>`(onCancel?: function) => void`                                        | no       | Onclick                                                                                                                                                                                                                              | `(onCancel) => {onCancel()}`                              |