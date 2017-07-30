import React, {Component} from 'react';
import {View, Image, StyleSheet} from 'react-native';
import Common from "./common";

export default class LoadingIcon extends Component{
    render(){
        return(
            <View style={styles.loadingIconWrapper}>
                <Image style={styles.loadingIcon} source={require('./img/loading.gif')}/>
            </View>
        );
    }
}

const dpi = Common.getRatio();
const wid = Common.winWidth();
const styles = StyleSheet.create({
    loadingIconWrapper: {
        position: 'absolute',
        top: 0.5*wid,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
    },
    loadingIcon: {
        width: 40*dpi,
        height: 40*dpi,
    },
});