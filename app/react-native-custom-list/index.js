/**
 * Created by woowalker on 2018/1/23.
 */
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import List from './lib/List'
import {headerRefreshDone, footerInfiniteDone} from './lib/func'
import {STATUS_PULLING_UP, STATUS_PULLING_DOWN, STATUS_RELEASE_HEADER_TO_REFRESH, STATUS_RELEASE_FOOTER_TO_REFRESH , STATUS_HEADER_REFRESHING, STATUS_FOOTER_REFRESHING} from './lib/constant'

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

export { headerRefreshDone, footerInfiniteDone, STATUS_PULLING_UP, STATUS_PULLING_DOWN, STATUS_RELEASE_HEADER_TO_REFRESH, STATUS_RELEASE_FOOTER_TO_REFRESH, STATUS_HEADER_REFRESHING, STATUS_FOOTER_REFRESHING }
