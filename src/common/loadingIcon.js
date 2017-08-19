import React, { Component } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import Common from "./common";

export default class LoadingIcon extends Component {
    render() {
        return (
            <View style={styles.loadingIconWrapper}>
                <Image style={styles.loadingIcon} source={require('./img/loading.gif')} />
            </View>
        );
    }
}

const wid = Common.winWidth();
const styles = StyleSheet.create({
    loadingIconWrapper: {
        position: 'absolute',
        top: 0.45 * wid,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
    },
    loadingIcon: {
        width: 40,
        height: 40,
    },
});