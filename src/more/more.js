/**
 * Created by kusob on 2017. 6. 26..
 */
import React, {Component} from 'react';
import {
    Image,
    StyleSheet,
    Text, TouchableOpacity,
    View, AsyncStorage, ScrollView
} from 'react-native';
import {Actions} from 'react-native-router-flux';

export default class More extends Component {
    render() {
        return (
            <ScrollView>
                <View style={styles.box}>
                    <MoreBtn text="거래소 바로가기" img={images.exchange} goTo="exchangeLink"/>
                    <MoreBtn text="coin -> KRW" img={images.convert} goTo="convert"/>
                    <MoreBtn text="커뮤니티" img={images.post} goTo="post"/>
                    <MoreBtn text="공지사항" img={images.notice} goTo="notice"/>
                    <MoreBtn text="버전정보" img={images.version} goTo="version"/>
                    <MoreBtn text="문의하기" img={images.ask} goTo="inquire"/>
                    <MoreBtn text="로그아웃" img={images.logout} goTo="logout"/>
                </View>
            </ScrollView>
        );
    }
}

class MoreBtn extends Component {
    async goTo(part) {
        if (part == 'logout') {
            await AsyncStorage.removeItem('Token');
            Actions.title();
        } else {
            Actions.main({goTo: part});
        }
    }

    render() {
        return (
            <View style={styles.btn}>
                <TouchableOpacity
                    underlayColor={'#AAAAAA'}
                    onPress={() => this.goTo(this.props.goTo)}
                >
                    <Text style={styles.menuText}>
                        <Image source={this.props.img} style={styles.menuIcon}/>
                        {this.props.text}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
}


const images = {
    logout: require('../common/img/logout.png'),
    exchange: require('../common/img/exchange2.png'),
    convert: require('../common/img/exchange2.png'),
    post: require('../common/img/version.png'),
    // option: require('../common/img/option.png'),
    notice: require('../common/img/notice.png'),
    version: require('../common/img/version.png'),
    ask: require('../common/img/ask.png'),
};

var styles = StyleSheet.create({
    frame: {
        flex: 1,
    },
    box: {
        // borderBottomWidth: 0.5,
        // borderColor: '#A0A0A0',
    },
    btn: {
        borderBottomWidth: 0.5,
        borderColor: '#FFFFFF',
        padding: 20,
    },
    menuIcon: {
        resizeMode:'stretch',
        width: 17,
        height: 17,
        marginTop:4,
        opacity:0.7
    },
    menuText: {
        backgroundColor:'transparent',
        fontSize: 17,
        paddingLeft: 17,
        color:'white',
        opacity:0.9
    }
});
