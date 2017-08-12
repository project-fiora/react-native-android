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
import Common from "../common/common";

export default class More extends Component {
    render() {
        return (
            <ScrollView>
                <MoreBtn text="거래소 바로가기" img={images.stockMarket} goTo="exchangeLink"/>
                <MoreBtn text="자동거래" img={images.autoDeal} goTo="exchange"/>
                <MoreBtn text="모의환전" img={images.sampleExchange} goTo="convert"/>
                <MoreBtn text="커뮤니티" img={images.community} goTo="post"/>
                <MoreBtn text="공지사항" img={images.notice} goTo="notice"/>
                {/*<MoreBtn text="버전정보" img={images.version} goTo="version"/>*/}
                <MoreBtn text="문의하기" img={images.ask} goTo="inquire"/>
                <MoreBtn text="개인정보처리방침" img={images.privatePolicy} goTo="privatePolicy"/>
                <MoreBtn text="오픈소스 라이센스" img={images.openSource} goTo="license"/>
                <MoreBtn text="로그아웃" img={images.logout} goTo="logout"/>
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
                    <View style={styles.iconNtext}>
                        <View style={styles.iconWrapper}>
                            <Image source={this.props.img} style={styles.menuIcon}/>
                        </View>

                        <Text style={styles.menuText}>
                            {this.props.text}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}


const images = {
    stockMarket: require('../common/img/stockMarket.png'),
    autoDeal: require('../common/img/autoDeal.png'),
    sampleExchange: require('../common/img/sampleExchange.png'),
    community: require('../common/img/community.png'),
    notice: require('../common/img/notice.png'),
    // version: require('../common/img/version.png'),
    ask: require('../common/img/ask.png'),
    privatePolicy:require('../common/img/notice.png'),
    openSource:require('../common/img/openSource.png'),
    logout: require('../common/img/logout.png'),
};

const dpi = Common.getRatio();
const wid = Common.winWidth();
const hei = Common.winHeight();
var styles = StyleSheet.create({
    frame: {
        flex: 1,
    },
    btn: {
        borderBottomWidth: 0.5,
        borderColor: '#FFFFFF',
        paddingLeft: 0.07*wid,
        paddingVertical: 0.025 *hei,
    },
    iconNtext: {
        flexDirection: 'row',
    },
    iconWrapper: {
        justifyContent: 'center',
        marginBottom: -2 * dpi,
    },
    menuIcon: {
        width: 0.055 * wid,
        height: 0.055 * wid,
        opacity: 0.7
    },
    menuText: {
        // backgroundColor: 'transparent',
        justifyContent: 'center',
        fontSize: 17 * dpi,
        marginLeft: 20 * dpi,
        color: 'white',
        opacity: 0.9
    }
});
