/**
 * Created by kusob on 2017. 7. 17..
 */

import React, { Component } from 'react';
import { View, AsyncStorage, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Actions } from 'react-native-router-flux';
import Camera from 'react-native-camera'
import Common from "./common";
import StateStorage from "./stateStore";

export default class Scanner extends Component {
    constructor(props) {
        super(props);

        this.state = {
            scanning: false,
        }

    }

    async onRead(obj) {
        console.log(obj);
        alert('스캔 완료!\n' + obj.data.toString() + '\n지갑 주소를 확인하세요');
        try {
            await StateStorage.setAddr(obj.data.toString());
            Actions.main({ goTo: 'myWalletAdd' });
        } catch (error) {
            alert("스캔 후 저장 오류 : " + error);
        }
    }

    render() {
        return (
            <View>
                <Camera style={styles.camera} onBarCodeRead={(obj) => this.onRead(obj)}>
                     <View style={styles.rectangleContainer}>
                        <View style={styles.rectangle} />
                    </View>
                </Camera> 
                <TouchableOpacity
                    style={styles.backBtn}
                    underlayColor={'#000000'}
                    onPress={() => Actions.main({ goTo: 'myWalletAdd' })}
                >
                    <Text style={styles.btnText}>
                        뒤로가기
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const dpi = Common.getRatio();
const styles = StyleSheet.create({
    camera: {
        height: 568,
        alignItems: 'center',
        justifyContent: 'center',
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
    backBtn: {
        width: 80 * dpi,
        height: 40 * dpi,
        borderWidth: 1 * dpi,
        borderRadius: 20 * dpi,
        borderColor: '#000000',
        padding: 5 * dpi,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.6,
        margin: 15 * dpi,
    },
    btnText: {
        color: '#000000',
        fontSize: 15 * dpi,
    },
});