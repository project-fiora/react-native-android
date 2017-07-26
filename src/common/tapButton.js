/**
 * Created by kusob on 2017. 6. 26..
 */

import React, {Component} from "react";
import {Image, Text, View, StyleSheet, TouchableOpacity} from "react-native";
import {Actions} from 'react-native-router-flux';
import Common from "./common";

export default class TabButton extends Component {
    render() {
        return (
            <View style={styles.taps}>
                <Tap img={images.home} text="홈" goTo="home"/>
                <Tap img={images.price} text="시세" goTo="price"/>
                <Tap img={images.wallet} text="내지갑" goTo="myWallet"/>
                <Tap img={images.friendWallet} text="친구지갑" goTo="friendWallet"/>
                {/*<Tap img={images.exchange} text="자동거래" goTo="exchange"/>*/}
                <Tap img={images.more} text="더보기" goTo="more"/>
            </View>
        )
    }
}

class Tap extends Component {
    goTo(part) {
        Actions.main({goTo:part});
    }

    render() {
        return (
            <View style={styles.tab}>
                <TouchableOpacity
                    underlayColor={'#AAAAAA'}
                    onPress={() => this.goTo(this.props.goTo)}
                >
                    <View>
                        <Image
                            source={this.props.img}
                            style={styles.img}
                        />
                        <Text style={styles.boxText}>{this.props.text}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

const images = {
    home: require('./img/home.png'),
    wallet: require('./img/wallet2.png'),
    friendWallet: require('./img/friend.png'),
    exchange: require('./img/exchange2.png'),
    price: require('./img/price.png'),
    more: require('./img/more.png'),
};

const dpi = Common.getRatio();
var styles = StyleSheet.create({
    taps: {
        width:'100%',
        height: 80*dpi,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1*dpi,
        borderColor: '#FFFFFF',
        opacity:0.6,
        padding:5*dpi,
    },
    tab: {
        justifyContent: 'center',
    },
    img: {
        marginTop: -8*dpi,
        height: '95%',
        width: '95%',
        alignSelf:'center',
    },
    boxText: {
        minWidth: 50*dpi,
        marginTop: -9*dpi,
        color:'#FFFFFF',
        fontSize:14,
        textAlign:'center',
    }
});