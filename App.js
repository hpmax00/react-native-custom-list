import React, {Component} from "react";
import {Dimensions, StyleSheet, Text, View, Image, ActivityIndicator} from "react-native";
import {CustomList} from "./app/react-native-custom-list";
import {HeaderRefresh} from "./app/HeaderRefresh";

export default class Example extends Component {
  _timer = -1;
  data = [];

  constructor(props) {
    super(props);
    this.getData();
    this.state = {
      data: this.data,
      loading: false,
      loadMore: false
    };
  }

  componentWillUnmount() {
    clearTimeout(this._timer)
  }

  getData(init) {
    let total = 14;
    if (init) {
      this.data = [];
      total = Math.ceil(Math.random() * 17);
    }
    for (let i = 0; i < total; i++) {
      this.data.push("row" + Math.ceil(Math.random() * total));
    }
  }

  refresh = () => {
    clearTimeout(this._timer);
    this.setState({
      loading: true
    })
    this.getData(true)
    this._timer = setTimeout(() => {
      this.setState({
        data: this.data,
        loading: false
      })
    }, 1000)
  }

  loadMore = () => {
    if (!this.props.loading) {
      if (!this.state.loadMore && this.state.data.length > 0) {
        clearTimeout(this._timer);
        this.setState({
          loadMore: true
        })
        this.getData()
        this._timer = setTimeout(() => {
          this.setState({
            data: this.data,
            loadMore: false
          })
        }, 1000)
      }
    }
  }

  _getKeyExtrator(item, index) {
    return item + '_' + index;
  }

  renderRow = ({ item, index }) => {
    return (
      <View style={styles.flatListItem}>
        <Text style={styles.fontItem}>{item + ":" + index}</Text>
      </View>
    );
  };

  renderFooter = () => {
    if (this.state.loading) {
      return null
    } else if (this.state.loadMore) {
      return (
          <View style={styles.footerInfinite}>
            <ActivityIndicator
                size={"small"}
                animating={true}
                color={"#75c5fe"}
                style={{marginRight: 10}}
            />
            <Text style={styles.refreshFont}>加载中</Text>
          </View>
      )
    } else if (this.state.data.length === 0) {
      return <Text>暂无数据</Text>
    } else {
      return (
          <View style={styles.footerContainer}>
            <Text>到底了</Text>
          </View>
      )
    }
  }

  render() {
    return (
        <View style={styles.wrap}>
          <View
              style={{
                height: 40,
                width: Dimensions.get("window").width,
                backgroundColor: "#d5c639"
              }}
          />
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
              // enableFooterInfinite
              // footerState={this.state.loading}
              // setFooterHeight={130}
              // onEndReachedThreshold={10}
              // footerInfinite={FooterInfinite}
              // onFooterInfiniting={this.loadMore}

          />
        </View>
    );
  }

}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    overflow: "hidden"
  },
  headerRefresh: {
    width: Dimensions.get("window").width,
    height: 100,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  footerInfinite: {
    width: Dimensions.get("window").width,
    height: 60,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  refreshFont: {
    fontSize: 16,
    color: "#b84f35"
  },
  flatListItem: {
    width: Dimensions.get("window").width,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#feafea"
  },
  fontItem: {
    fontSize: 15
  },
  footerContainer: {
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
    height: 130
  },
  footerImage: {
    width: 141,
    height: 50
  },
});
