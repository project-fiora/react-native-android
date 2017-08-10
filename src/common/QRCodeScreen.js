import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Vibration,
} from 'react-native';

import Camera from 'react-native-camera';

class QRCodeScreen extends Component {

  static property = {
    cancelButtonVisible: React.PropTypes.bool,
    cancelButtonTitle: React.PropTypes.string,
    onSucess: React.PropTypes.func,
  }

  static defaultProps = {
    cancelButtonVisible: false,
    cancelButtonTitle: 'Cancel',
  }

  _onBarCodeRead(result) {
    var $this = this;

    if (this.barCodeFlag) {
      this.barCodeFlag = false;

      setTimeout(function () {
        Vibration.vibrate();
        $this.props.navigator.pop();
        $this.props.onSucess(result.data);
      }, 1000);
    }
  }

  render() {
    this.barCodeFlag = true;

    return (
      <Camera onBarCodeRead={this._onBarCodeRead} style={styles.camera}>
        <View style={styles.rectangleContainer}>
          <View style={styles.rectangle} />
        </View>
      </Camera>
    );
  }
}

const styles = StyleSheet.create({
  camera: {
    height: 568,
    alignItems: 'center',
  },

  rectangleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },

  rectangle: {
    height: 250,
    width: 250,
    borderWidth: 2,
    borderColor: '#00FF00',
    backgroundColor: 'transparent',
  },
});

module.exports = QRCodeScreen;
