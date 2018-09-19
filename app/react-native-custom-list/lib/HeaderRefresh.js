import React, { Component } from "react";
import {View, StyleSheet } from "react-native";
import { G_STATUS_NONE } from "./constant";
import Header from "./Header";

export default class HeaderRefresh extends Component {
  static defaultProps = {
    headerRefresh: Header
  };

  constructor(props) {
    super(props);
    this.state = {
      gestureStatus: G_STATUS_NONE,
      currentOffset: 0
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextState.gestureStatus !== this.state.gestureStatus ||
      nextState.currentOffset !== this.state.currentOffset
    );
  }

  // static getDerivedStateFromProps(nextProps, prevState) {
  //   let { refreshData } = nextProps
  //   prevState.gestureStatus === 4 && refreshData instanceof Function && refreshData()
  //
  //   return null
  // }

  setGestureStatus = (gestureStatus, callback) => {
    if (gestureStatus !== this.state.gestureStatus) {
      this.setState(
        { gestureStatus },
        () => callback instanceof Function && callback()
      );
    }
  };

  setCurrOffset = (currentOffset, callback) => {
    if (currentOffset !== this.state.currentOffset) {
      this.setState(
        { currentOffset },
        () => callback instanceof Function && callback()
      );
    }
  };

  render() {
    let { gestureStatus, currentOffset } = this.state;
    let HeaderRefresh = this.props.headerRefresh
    // return this.props.renderHeaderRefresh(gestureStatus, currentOffset);
    return (
        <HeaderRefresh gestureStatus={gestureStatus} offset={currentOffset} />
    )
  }
}
