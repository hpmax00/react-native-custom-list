import React, { Component } from 'react'
import {
  EVENT_HEADER_REFRESH,
  G_STATUS_NONE,
  STATUS_HEADER_REFRESHING,
  STATUS_PULLING_DOWN,
  STATUS_RELEASE_HEADER_TO_REFRESH,
  T_HEADER_ANI
} from './constant'
import { Animated, DeviceEventEmitter, PanResponder, ScrollView, View, Platform, StyleSheet } from 'react-native'
import HeaderRefresh from './HeaderRefresh'
import { _onHeaderRefreshing, headerRefreshDone } from './func'

export default class ScrollComponent extends Component {
  _headerRefreshHandle = -1 //刷新完成句柄
  _scrollPosHandle = -1 //滚动定时句柄

  _headerRefreshDoneHandle = null //刷新操作完成监听句柄
  _headerRefresh = null //刷新头实例

  static defaultProps = {
    showsVerticalScrollIndicator: false,
    onHeaderRefreshing: _onHeaderRefreshing
  }

  constructor(props) {
    super(props)
    this.state = {
      //当前手势状态
      gestureStatus: G_STATUS_NONE,
      //当前拖动状态
      onDrag: false,
      //当前是否惯性滚动状态
      onScrollWithoutDrag: false,

      startPageY: 0,
      movePageY: 0,
      dragDirection: 0, //-1上拉 0无 1下拉

      //用于不足一屏时的手势拖动
      p_translateY: new Animated.Value(0),
      p_currPullDistance: this.props.pullDownDistance,
      p_lastPullDistance: 0,
      l_onTopReached_down: false
    }
    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponderCapture: this.onMoveShouldSetPanResponderCapture,
      onPanResponderMove: this.onPanResponderMove,
      onPanResponderEnd: this.onPanResponderEnd
    })
  }

  componentDidMount() {
    // 复位header的100空白
    if (Platform.OS === 'ios') {
      this._scrollToPos(0, this.props.pullDownDistance, true)
    } else {
      this._timeout = setTimeout(() => {
        this._scrollToPos(0, this.props.pullDownDistance, true)
      }, 50)
    }

    this._headerRefreshDoneHandle = this.props.enableHeaderRefresh
      ? DeviceEventEmitter.addListener(EVENT_HEADER_REFRESH, this._headerRefreshDone)
      : null
  }

  componentWillUnmount() {
    this._headerRefreshDoneHandle && this._headerRefreshDoneHandle.remove()
    clearTimeout(this._headerRefreshHandle)
    clearTimeout(this._scrollPosHandle)
    clearTimeout(this._timeout)
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    nextProps.refreshState === false && prevState.gestureStatus === STATUS_HEADER_REFRESHING && headerRefreshDone()
    return null
  }

  onMoveShouldSetPanResponderCapture = (evt, gestureState) => {
    this.state.l_onTopReached_down = this.state.l_onTopReached_up = false
    this.state.p_lastPullDistance = this.state.p_currPullDistance

    let _pullDown = gestureState.dy > 0 && gestureState.vy > 0
    let _pullUp = gestureState.dy < 0 && gestureState.vy < 0

    if (this.scrollContentHeight - this.props.pullDownDistance <= this.scrollViewHeight) {
      //到顶部
      if (_pullDown) {
        //下拉
        this.state.l_onTopReached_down = this.state.p_currPullDistance === 0
      }
    }

    return this.props.enableHeaderRefresh && (this.state.l_onTopReached_down || this.state.l_onTopReached_up)
  }

  onPanResponderMove = (evt, gestureState) => {
    let _translateY = Math.ceil(Math.abs(gestureState.dy)) * this.props.pullFriction
    //下拉刷新
    if (this.state.l_onTopReached_down && gestureState.dy > 0) {
      this.state.p_currPullDistance = _translateY >= this.props.pullDownDistance ? this.props.pullDownDistance : _translateY
      this.state.p_translateY.setValue(-this.props.pullDownDistance + this.state.p_currPullDistance)
      this._headerRefresh.setCurrOffset(this.state.p_currPullDistance, null)

      if (this.state.gestureStatus !== STATUS_HEADER_REFRESHING) {
        if (this.state.p_currPullDistance >= this.props.pullDownDistance) {
          if (this.state.gestureStatus !== STATUS_RELEASE_HEADER_TO_REFRESH) {
            this._setGestureStatus('onPanResponderMove 松开加载', STATUS_RELEASE_HEADER_TO_REFRESH)
          }
        } else {
          if (this.state.gestureStatus !== STATUS_PULLING_DOWN) {
            this._setGestureStatus('onPanResponderMove 下拉', STATUS_PULLING_DOWN)
          }
        }
      }
    }
    //上拉隐藏刷新面板
    else if (this.state.l_onTopReached_up && gestureState.dy < 0) {
      let _currPullDistance = this.state.p_lastPullDistance - _translateY
      this.state.p_currPullDistance = _currPullDistance <= 0 ? 0 : _currPullDistance
      this.state.p_translateY.setValue(-this.props.pullDownDistance + this.state.p_currPullDistance)
      this._headerRefresh.setCurrOffset(this.state.p_currPullDistance, null)

      if (this.state.gestureStatus !== STATUS_HEADER_REFRESHING) {
        if (this.state.p_currPullDistance < this.props.pullDownDistance) {
          if (this.state.gestureStatus !== STATUS_PULLING_DOWN) {
            this._setGestureStatus('onPanResponderMove 上拉隐藏刷新面板 下拉', STATUS_PULLING_DOWN)
          }
        }
      }
    }
  }

  onPanResponderEnd = () => {
    //下拉刷新
    if (this.state.l_onTopReached_down) {
      if (this.state.p_currPullDistance < this.props.pullDownDistance) {
        Animated.timing(this.state.p_translateY, {
          toValue: -this.props.pullDownDistance,
          duration: T_HEADER_ANI,
          useNativeDriver: true
        }).start(() => {
          this.state.p_currPullDistance = 0
          this._headerRefresh.setCurrOffset(this.state.p_currPullDistance, null)
        })
      } else {
        if (this.state.gestureStatus !== STATUS_HEADER_REFRESHING) {
          this.props.onHeaderRefreshing instanceof Function && this.props.onHeaderRefreshing()
          this._setGestureStatus('onPanResponderEnd', STATUS_HEADER_REFRESHING)
        }
      }
    }
    //上拉隐藏刷新面板
    else if (this.state.l_onTopReached_up) {
      Animated.timing(this.state.p_translateY, {
        toValue: -this.props.pullDownDistance,
        duration: T_HEADER_ANI,
        useNativeDriver: true
      }).start(() => {
        this.state.p_currPullDistance = 0
        this._headerRefresh.setCurrOffset(this.state.p_currPullDistance, null)
      })
    }
  }

  _headerRefreshDone = (done, time) => {
    //定时是因为：存在可能scrollContentLayout函数调用比_headerRefreshDone函数调用慢，导致两个值的比较没有真实反映出scrollView的内容宽度
    if (done) {
      this._headerRefreshHandle = setTimeout(() => {
        if (this.scrollContentHeight - this.props.pullDownDistance <= this.scrollViewHeight) {
          this._scrollView.setNativeProps({ scrollEnabled: false })
          Animated.timing(this.state.p_translateY, {
            toValue: -this.props.pullDownDistance,
            duration: T_HEADER_ANI,
            useNativeDriver: true
          }).start(() => {
            this.setState({ gestureStatus: G_STATUS_NONE })
            this.state.p_currPullDistance = 0
            this._headerRefresh.setCurrOffset(this.state.p_currPullDistance, null)
          })
        } else {
          this._scrollView.setNativeProps({ scrollEnabled: true })
          this.state.p_translateY.setValue(0)
          this.state.p_currPullDistance = 0
          this.setState({ gestureStatus: G_STATUS_NONE })
          this._scrollToPos(0, this.props.pullDownDistance, true)
        }
      }, 200)
    }
  }

  _setGestureStatus = (callFrom, status) => {
    // this.state.gestureStatus = status;
    // console.log(111111,callFrom)
    this.setState({ gestureStatus: status })
    this._headerRefresh.setGestureStatus(status)
  }

  _scrollToPos = (x, y, animated) => {
    this._scrollView.scrollTo({ x, y, animated })
  }

  onScroll = e => {
    let { y } = e.nativeEvent.contentOffset
    let { contentSize, layoutMeasurement } = e.nativeEvent
    let { gestureStatus, onDrag, onScrollWithoutDrag, dragDirection } = this.state
    //                    所有内容高度           scrollView高度
    let _maxOffsetY = contentSize.height - layoutMeasurement.height

    //下拉 header
    if (dragDirection === 1) {
      //手指正在拖动视图
      if (onDrag) {
        if (gestureStatus === STATUS_PULLING_DOWN) {
          if (y <= this.props.pullDownThreshold) {
            //释放刷新
            this._setGestureStatus('onScorll 释放刷新', STATUS_RELEASE_HEADER_TO_REFRESH)
          }
        } else if (gestureStatus === STATUS_RELEASE_HEADER_TO_REFRESH) {
          if (y > this.props.pullDownThreshold) {
            //下拉刷新
            this._setGestureStatus('onScorll 下拉刷新', STATUS_PULLING_DOWN)
          }
        }
        y <= this.props.pullDownDistance && this._headerRefresh.setCurrOffset(this.props.pullDownDistance - y, null)
      }
      //交互操作之后，视图正在滚动
      else if (onScrollWithoutDrag) {
      }
      //函数滚动，scrollTo，scrollTo不会触发 onMomentumScrollBegin
      else {
        if (gestureStatus === G_STATUS_NONE) {
          if (y === this.props.pullDownDistance) {
            this._setGestureStatus('onScorll 函数滚动', G_STATUS_NONE)
            this._headerRefresh.setCurrOffset(0, null)
          }
        }
      }
    }
    //未确定方向，可能从中部下拉到下拉刷新的阈值，也可能是从中部上拉到上拉加载的阈值
    else {
      //手指正在拖动视图
      if (onDrag) {
        //无状态
        if (gestureStatus === G_STATUS_NONE) {
          //开始下拉
          if (y <= this.props.pullDownDistance) {
            this.state.dragDirection = 1
            this._setGestureStatus('从位置方向下拉', STATUS_PULLING_DOWN)
          }
        }
      }
      //交互操作之后，视图正在滚动
      else if (onScrollWithoutDrag) {
      }
      //函数滚动，scrollTo，scrollTo不会触发 onMomentumScrollBegin
      else {
        if (gestureStatus === G_STATUS_NONE) {
          if (y === this.props.pullDownDistance) {
            //刷新完毕归位
            this._setGestureStatus('位置刷新完毕', G_STATUS_NONE)
            this._headerRefresh.setCurrOffset(0, null)
          } else if (y < this.props.pullDownDistance) {
            //修正最终滚动位置
            clearTimeout(this._scrollPosHandle)
            //定时是因为当滚动到下拉刷新区域时便重置滚动区域的话，刷新区域表现为闪烁
            this._scrollPosHandle = setTimeout(() => this._scrollToPos(0, this.props.pullDownDistance), 80)
          }
        }
      }
    }

    this.props.onScroll instanceof Function && this.props.onScroll(e)
  }

  onTouchStart = e => {
    this.state.startPageY = e.nativeEvent.pageY

    this.props.onTouchStart instanceof Function && this.props.onTouchStart(e)
  }

  onTouchMove = e => {
    this.state.movePageY = e.nativeEvent.pageY

    this.props.onTouchMove instanceof Function && this.props.onTouchMove(e)
  }

  onScrollBeginDrag = e => {
    this.state.onDrag = true
    this.state.dragDirection = 0

    let { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent
    let { gestureStatus, startPageY, movePageY } = this.state
    if (contentOffset.y <= this.props.pullDownDistance) {
      //到顶部
      if (movePageY > startPageY) {
        //下拉
        if (gestureStatus !== STATUS_HEADER_REFRESHING) {
          this.state.dragDirection = 1
          this._setGestureStatus('onScrollBeginDrag下拉', STATUS_PULLING_DOWN)
        }
      }
    } else if (contentOffset.y >= contentSize.height - layoutMeasurement.height) {
    }

    this.props.onScrollBeginDrag instanceof Function && this.props.onScrollBeginDrag(e)
  }

  onScrollEndDrag = e => {
    this.state.onDrag = false
    this.state.startPageY = this.state.movePageY = 0

    let { gestureStatus, dragDirection } = this.state
    let { contentSize, layoutMeasurement } = e.nativeEvent
    let _maxOffsetY = contentSize.height - layoutMeasurement.height
    //下拉
    if (dragDirection === 1) {
      if (gestureStatus === STATUS_PULLING_DOWN) {
        this.setState({ gestureStatus: G_STATUS_NONE })
        this._scrollToPos(0, this.props.pullDownDistance, true)
      } else if (gestureStatus === STATUS_RELEASE_HEADER_TO_REFRESH) {
        this._setGestureStatus('onScrollEndDrag 下拉 松开加载', STATUS_HEADER_REFRESHING)
        this.props.onHeaderRefreshing instanceof Function && this.props.onHeaderRefreshing()
      }
    }

    this.props.onScrollEndDrag instanceof Function && this.props.onScrollEndDrag(e)
  }

  onMomentumScrollBegin = e => {
    //scrollTo 设置 animated 为 true 时，不会触发 onMomentumScrollBegin
    this.state.onScrollWithoutDrag = true
    this.props.onMomentumScrollBegin instanceof Function && this.props.onMomentumScrollBegin(e)
  }

  onMomentumScrollEnd = e => {
    this.state.onScrollWithoutDrag = false

    let { gestureStatus, dragDirection } = this.state
    let { contentOffset } = e.nativeEvent

    if (dragDirection === 0) {
      if (gestureStatus === G_STATUS_NONE) {
        if (contentOffset.y < this.props.pullDownDistance) {
          this._scrollToPos(0, this.props.pullDownDistance, true)
        }
      }
    }

    this.props.onMomentumScrollEnd instanceof Function && this.props.onMomentumScrollEnd(e)
  }

  scrollViewLayout = e => {
    this.scrollViewHeight = e.nativeEvent.layout.height
  }

  scrollContentLayout = e => {
    this.scrollContentHeight = e.nativeEvent.layout.height
  }

  getRef = ref => {
    this._scrollView = ref
    this.props.getRef instanceof Function && this.props.getRef(ref)
  }

  renderHeaderRefresh = () => {
    if (this.props.enableHeaderRefresh) {
      return <HeaderRefresh ref={ins => (this._headerRefresh = ins)} headerRefresh={this.props.headerRefresh} />
    }
  }

  render() {
    // console.log('child', this.props)
    return (
      <View style={styles.container} {...this._panResponder.panHandlers}>
        <ScrollView
          {...this.props}
          ref={this.getRef}
          onLayout={this.scrollViewLayout}
          onTouchStart={this.onTouchStart}
          onTouchMove={this.onTouchMove}
          scrollEventThrottle={16}
          onScroll={this.onScroll}
          onScrollBeginDrag={this.onScrollBeginDrag}
          onScrollEndDrag={this.onScrollEndDrag}
          onMomentumScrollBegin={this.onMomentumScrollBegin}
          onMomentumScrollEnd={this.onMomentumScrollEnd}
        >
          <Animated.View style={{ transform: [{ translateY: this.state.p_translateY }] }} onLayout={this.scrollContentLayout}>
            <View ref={ref => (this._headerRefreshContainer = ref)} style={{ backgroundColor: 'transparent' }}>
              {this.renderHeaderRefresh()}
            </View>
            {this.props.children}
            {/*<View*/}
            {/*ref={ref => (this._footerInfiniteContainer = ref)}*/}
            {/*style={{ height: 0, backgroundColor: "transparent" }}*/}
            {/*>*/}
            {/*{this.renderFooterInfinite()}*/}
            {/*</View>*/}
          </Animated.View>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
