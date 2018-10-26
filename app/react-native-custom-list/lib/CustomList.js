import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import List from 'react-native-custom-list/lib/List'
import PropTypes from "prop-types"

export default class CustomList extends Component {
  static headerRefreshDone = () => List.headerRefreshDone()
  static footerInfiniteDone = () => List.footerInfiniteDone()

  static propTypes = {
    getRef: PropTypes.func,

    enableHeaderRefresh: PropTypes.bool,
    setHeaderHeight: PropTypes.number,
    onTopReachedThreshold: PropTypes.number,
    // headerRefresh: PropTypes.element,
    onHeaderRefreshing: PropTypes.func,

    pullFriction: PropTypes.number,

    enableFooterInfinite: PropTypes.bool,
    setFooterHeight: PropTypes.number,
    onEndReachedThreshold: PropTypes.number,
    // footerInfinite: PropTypes.element,
    onFooterInfiniting: PropTypes.func,
  }

  render() {
    return <List {...this.props}/>
  }
}