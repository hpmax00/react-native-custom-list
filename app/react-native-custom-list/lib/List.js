/**
 * Created by Max on 2018/7/28.
 */
"use strict";
import React, { Component } from "react";
import { Dimensions, FlatList } from "react-native";
import PropTypes from "prop-types";

import {
  PULL_UP_DISTANCE,
  PULL_DOWN_DISTANCE,
  PULL_UP_THRESHOLD,
  PULL_DOWN_THRESHOLD,
  PULL_FRICTION
} from "./constant";
import ScrollComponent from "./ScrollComponent";

const { height } = Dimensions.get("window");

export default class List extends Component {
  static propTypes = {
    getRef: PropTypes.func,

    enableHeaderRefresh: PropTypes.bool,
    setHeaderHeight: PropTypes.number,
    onTopReachedThreshold: PropTypes.number,
    // headerRefresh: PropTypes.elements,
    onHeaderRefreshing: PropTypes.func,

    pullFriction: PropTypes.number,

    enableFooterInfinite: PropTypes.bool,
    setFooterHeight: PropTypes.number,
    onEndReachedThreshold: PropTypes.number,
    // footerInfinite: PropTypes.elements,
    onFooterInfiniting: PropTypes.func
  };

  static defaultProps = {
    enableHeaderRefresh: true,
    setHeaderHeight: PULL_DOWN_DISTANCE,
    onTopReachedThreshold: PULL_DOWN_THRESHOLD,
    pullFriction: PULL_FRICTION,

    setFooterHeight: PULL_UP_DISTANCE,
    onEndReachedThreshold: PULL_UP_THRESHOLD
  };

  constructor(props) {
    super(props);
    //-height 则判断流程中不会进入下拉刷新的判断，省去了之后继续判断enableHeaderRefresh的值
    this.pullDownDistance = props.enableHeaderRefresh
      ? props.setHeaderHeight
      : -height;
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (nextProps.enableHeaderRefresh !== undefined) {
      //-height 则判断流程中不会进入下拉刷新的判断，省去了之后继续判断enableHeaderRefresh的值
      this.pullDownDistance = nextProps.enableHeaderRefresh
        ? this.props.setHeaderHeight
        : -height;
    }
  }

  render() {
    let {
      ...others
    } = this.props;
    let ListComponent = <FlatList {...others} />;

    if (this.props.enableHeaderRefresh) {
      return React.cloneElement(ListComponent, {
        renderScrollComponent: props => (
          <ScrollComponent
            {...props}
            pullDownDistance={this.pullDownDistance}
            pullDownThreshold={this.props.onTopReachedThreshold}
          />
        )
      });
    } else {
      return ListComponent
    }


  }
}
