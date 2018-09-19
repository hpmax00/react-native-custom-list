import {Text, View, Dimensions, ActivityIndicator} from "react-native";
import React from "react";
import {
  STATUS_HEADER_REFRESHING,
  STATUS_PULLING_DOWN,
  STATUS_RELEASE_TO_REFRESH
} from './constant'

const { width } = Dimensions.get("window");

const Header = ({gestureStatus, offset}) => {
  switch (gestureStatus) {
    case STATUS_PULLING_DOWN:
      return (
          <View
              style={{
                width,
                height: 60,
                justifyContent: "center",
                alignItems: "center"
              }}
          >
            <Text>{"下拉刷新"}</Text>
          </View>
      );
      break;
    case STATUS_RELEASE_TO_REFRESH:
      return (
          <View
              style={{
                width,
                height: 60,
                justifyContent: "center",
                alignItems: "center"
              }}
          >
            <Text>{"松开即可刷新"}</Text>
          </View>
      );
      break;
    case STATUS_HEADER_REFRESHING:
      return (
          <View style={{width, height: 60, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator
                size={'small'}
                animating={true}
                color={'#75c5fe'}
                style={{marginRight: 10}}/>
            <Text>{'正在刷新...'}</Text>
          </View>
      )
      break;
    default:
      return (
          <View
              style={{
                width,
                height: 60,
                justifyContent: "center",
                alignItems: "center"
              }}
          >
            <Text>{"下拉刷新"}</Text>
          </View>
      );
  }
};

export default Header