import React, { Component } from 'react'
import { Image, ImageStyle, StyleSheet, View } from 'react-native'


export default class GifImage extends Component {

  static defaultProps = {
    interval: 100
  }

  constructor(props) {
    super(props)
    this.state = {
      imageIndex: 0
    }
  }

  componentDidMount() {
    this.intervalId = setInterval(() => {
      let imageIndex = this.state.imageIndex + 1
      if (imageIndex >= this.props.images.length) {
        imageIndex = 0
      }
      this.setState({imageIndex})
    }, this.props.interval)
  }

  componentWillUnmount() {
    clearInterval(this.intervalId)
  }

  render() {
    return (
      <View>
        <Image {...this.props} source={this.props.images[this.state.imageIndex]} />
      </View>
    )
  }
}

const styles = StyleSheet.create({})
