import React, {Component} from "react";
import {Image, View, StyleSheet, Dimensions} from "react-native";
import GifImage from "./GifImage";
import {STATUS_PULLING_DOWN, STATUS_RELEASE_HEADER_TO_REFRESH, STATUS_HEADER_REFRESHING} from './react-native-custom-list'

const images = [
  require("../refresh/refresh_1.png"),
  require("../refresh/refresh_2.png"),
  require("../refresh/refresh_3.png"),
  require("../refresh/refresh_4.png"),
  require("../refresh/refresh_5.png"),
  require("../refresh/refresh_6.png"),
  require("../refresh/refresh_7.png"),
  require("../refresh/refresh_8.png"),
  require("../refresh/refresh_9.png"),
  require("../refresh/refresh_10.png"),
  require("../refresh/refresh_11.png"),
  require("../refresh/refresh_12.png")
];

export class HeaderRefresh extends Component {
  static defaultProps = {
    gestureStatus: 2,
    offset: 0
  };

  constructor(props) {
    super(props);
  }

  render() {
    let {gestureStatus} = this.props
        // _refreshFont = "";
    let index = 0;
    switch (gestureStatus) {
      case STATUS_PULLING_DOWN:
        // _refreshFont = "pull-up-to-load-more";
        index = Math.ceil(this.props.offset / 20);
        break;
      case STATUS_RELEASE_HEADER_TO_REFRESH:
        // _refreshFont = "release-to-refresh";
        index = 9;
        // break;
      case STATUS_HEADER_REFRESHING:
        return (
            <View style={Styles.headerRefresh}>
              <GifImage
                  images={images}
                  style={{
                    width: 300,
                    height: 225
                  }}
              />
            </View>
        );
        break;
      default:
        // _refreshFont = "pull-to-refresh";
    }
    if (index === 0) {
      return <View style={Styles.headerRefresh} />
    } else {
      return (
          <View style={Styles.headerRefresh}>
            <Image
                source={images[index]}
                style={{
                  width: 300,
                  height: 225
                }}
            />
          </View>
      );
    }

  }
}

const Styles = StyleSheet.create({
  headerRefresh: {
    width: Dimensions.get("window").width,
    height: 225,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#F3F3F3'
  }
});