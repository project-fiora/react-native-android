/**
 * Created by kusob on 2017. 6. 27..
 */

import React, {Component} from 'react';
import {
    Image, ImageBackground,
    StyleSheet, Text, TouchableHighlight, TouchableOpacity,
    View, Alert, BackHandler
} from 'react-native';
import {Actions} from 'react-native-router-flux';

import TabButton from '../common/tapButton';
import Home from '../home/home';

import MyWallet from '../myWallet/myWallet';
import MyWalletMng from "../myWallet/myWalletMng";
import MyWalletEdit from '../myWallet/myWalletEdit';
import MyWalletAdd from '../myWallet/myWalletAdd';

import FriendWallet from '../friendWallet/friendWallet';
import FriendWalletMng from '../friendWallet/friendWalletMng';

import Exchange from '../more/exchange/exchange';

import Coinmarketcap from "../price/coinmarketcap";
import Cryptocompare from '../price/cryptocompare';

import More from '../more/more';
import ExchangeLink from '../more/exchangeLink';
import ExchangeSite from '../more/exchangeSite';
import Convert from '../more/convert';
import Post from "../more/post/post";
import PostRead from '../more/post/postRead';
import PostAdd from "../more/post/postAdd";
import Option from '../more/option/option';
import OptionDetail from "../more/option/optionDetail";

import Notice from '../more/notice/notice';
import NoticeDetail from "../more/notice/noticeDetail";

import Version from '../more/version';
import Inquire from '../more/inquire';
import Common from "../common/common";
import PostAddEdit from "../more/post/postAddEdit";
import StateStore from "../common/stateStore";
import License from "../more/license";

export default class Main extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: '',
            enableBackBtn: false,
            backBtnGoTo: '',
            enableRightBtn: false,
            rightBtnGoTo: '',
            rightBtnText: '',
        };
        StateStore.setGlobalLoaded('none');
        this.handleBack = (() => {
            Alert.alert(
                '경고!',
                '앱이 종료됩니다',
                [
                    {
                        text: 'Cancel', onPress: () => {
                        return true;
                    }, style: 'cancel'
                    },
                    {
                        text: 'OK', onPress: () => {
                        BackHandler.exitApp();
                        return false;
                    }
                    },
                ],
            );
            return true;
        }).bind(this);
    }
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBack);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBack);
    }

    componentWillMount() { //title, backBtn handler
        var p = this.props.goTo;

        if (p == 'home') {
            this.setState({title: '요약'});
        } else if (p == 'price') {
            this.setState({
                title: '시세 정보',
                enableRightBtn: true, rightBtnText: '다른 정보', rightBtnGoTo: 'coinmarketcap'
            });
        } else if (p == 'coinmarketcap') {
            this.setState({
                title: '시세 정보',
                enableBackBtn: true, backBtnGoTo: 'price'
            });
        } else if (p == 'myWallet') {
            this.setState({
                title: '내지갑',
                enableRightBtn: true, rightBtnText: '지갑 관리', rightBtnGoTo: 'myWalletMng'
            });
        } else if (p == 'myWalletMng') {
            this.setState({
                title: '지갑 관리',
                enableBackBtn: true, backBtnGoTo: 'myWallet',
                enableRightBtn: true, rightBtnText: '지갑 추가', rightBtnGoTo: 'myWalletAdd'
            });
        } else if (p == 'myWalletEdit') {
            this.setState({
                title: '지갑 수정',
                enableBackBtn: true, backBtnGoTo: 'myWalletMng',
                enableRightBtn: true, rightBtnText: '저장', rightBtnGoTo: 'callEditWallet'
            });
        } else if (p == 'myWalletAdd') {
            this.setState({
                title: '지갑 추가',
                enableBackBtn: true, backBtnGoTo: 'myWalletMng',
                enableRightBtn: true, rightBtnText: '저장', rightBtnGoTo: 'callAddWallet'
            });
        } else if (p == 'friendWallet') {
            this.setState({
                title: '친구 지갑',
                enableRightBtn: true, rightBtnText: '친구 관리', rightBtnGoTo: 'friendWalletMng'
            });
        } else if (p == 'friendWalletMng') {
            this.setState({
                title: '친구 관리', enableBackBtn: true, backBtnGoTo: 'friendWallet',
            });
        } else if (p == 'exchange') {
            this.setState({
                title: '자동 거래',
                enableBackBtn: true, backBtnGoTo: 'more',
            });

        } else if (p == 'more') {
            this.setState({
                title: '더보기'
            });
        } else if (p == 'exchangeLink') {
            this.setState({
                title: '거래소 바로가기',
                enableBackBtn: true, backBtnGoTo: 'more'
            });
        } else if (p == 'exchangeSite') {
            this.setState({
                title: this.props.siteName,
                enableBackBtn: true, backBtnGoTo: 'exchangeLink'
            });
        } else if (p == 'convert') {
            this.setState({
                title: '모의환전',
                enableBackBtn: true, backBtnGoTo: 'more'
            });
        } else if (p == 'optionDetail') {
            this.setState({
                title: this.props.title,
                enableBackBtn: true, backBtnGoTo: 'option'
            });
        } else if (p == 'post') {
            this.setState({
                title: '커뮤니티',
                enableBackBtn: true, backBtnGoTo: 'more',
                enableRightBtn: true, rightBtnText: '글쓰기', rightBtnGoTo: 'postAdd'
            });
        } else if (p == 'postRead') {
            this.setState({
                title: '게시물 읽기',
                enableBackBtn: true, backBtnGoTo: 'post',
            });
        } else if (p == 'postAdd') {
            this.setState({
                title: '게시물 작성',
                enableBackBtn: true, backBtnGoTo: 'post',
                enableRightBtn: true, rightBtnText: '등록', rightBtnGoTo: 'postWrite'
            });
        } else if (p == 'postEdit') {
            this.setState({
                title: '게시물 수정',
                enableBackBtn: true, backBtnGoTo: 'post',
                enableRightBtn: true, rightBtnText: '등록', rightBtnGoTo: 'postEdit'
            });
        } else if (p == 'notice') {
            this.setState({
                title: '공지사항',
                enableBackBtn: true, backBtnGoTo: 'more'
            });
        } else if (p == 'noticeDetail') {
            this.setState({
                title: this.props.title,
                enableBackBtn: true, backBtnGoTo: 'notice'
            });
        } else if (p == 'version') {
            this.setState({
                title: '버전정보',
                enableBackBtn: true, backBtnGoTo: 'more'
            });
        } else if (p == 'inquire') {
            this.setState({
                title: '문의하기',
                enableBackBtn: true, backBtnGoTo: 'more'
            });
        } else if (p == 'license') {
            this.setState({
                title: '오픈소스 라이센스',
                enableBackBtn: true, backBtnGoTo: 'more'
            });
        }
    }

    goTo(part) {
        if(part == 'callAddWallet'){
            Common.addWallet();
        } else if(part=='callEditWallet'){
            Common.editWallet();
        } else if(part=='postWrite'){
            PostAddEdit.writePost();
        } else if(part=='postEdit'){
            PostAddEdit.editPost();
        } else {
            Actions.main({goTo: part});
        }
    }

    render() {
        return (
            <ImageBackground
                imageStyle={styles.backgroundImg}
                source={require('../common/img/background.png')}
                style={styles.container}
            >
                <View style={styles.wrapper}>
                    <View style={styles.summaryTitleWrapper}>
                        <View style={styles.navBtnWrapper}>
                            {this.state.enableBackBtn &&
                            <TouchableOpacity
                                style={styles.navBackBtn}
                                underlayColor={'#AAAAAA'}
                                onPress={() => this.goTo(this.state.backBtnGoTo)}
                            >
                                <Image source={require('../common/img/navArrow.png')}
                                       style={styles.navBackArrow}/>
                            </TouchableOpacity>
                            }
                        </View>
                        <Text style={styles.summaryTitle}>
                            {this.state.title}
                        </Text>
                        <View style={styles.navBtnWrapper}>
                            {this.state.enableRightBtn &&
                            <TouchableHighlight
                                style={styles.rightBtn}
                                underlayColor={'#000000'}
                                onPress={() => this.goTo(this.state.rightBtnGoTo)}
                            >
                                <Text style={styles.rightBtnText}>{this.state.rightBtnText}</Text>
                            </TouchableHighlight>
                            }
                        </View>

                    </View>
                    <View style={styles.hr}/>
                    {this.props.goTo === 'home' && <Home/>}
                    {this.props.goTo === 'price' && <Cryptocompare/>}
                    {this.props.goTo === 'coinmarketcap' && <Coinmarketcap/>}

                    {this.props.goTo === 'myWallet' && <MyWallet/>}
                    {this.props.goTo === 'myWalletMng' && <MyWalletMng/>}
                    {this.props.goTo === 'myWalletEdit' &&
                    <MyWalletEdit id={this.props.id}/>
                    }
                    {this.props.goTo === 'myWalletAdd' && <MyWalletAdd/>}

                    {this.props.goTo === 'friendWallet' && <FriendWallet/>}
                    {this.props.goTo === 'friendWalletMng' && <FriendWalletMng/>}


                    {this.props.goTo === 'more' && <More/>}

                    {this.props.goTo === 'exchangeLink' && <ExchangeLink/>}
                    {this.props.goTo === 'exchangeSite' && <ExchangeSite link={this.props.link}/>}

                    {this.props.goTo === 'exchange' && <Exchange/>}
                    {this.props.goTo === 'convert' && <Convert/>}
                    {/*{this.props.goTo === 'option' && <Option/>}*/}
                    {/*{this.props.goTo === 'optionDetail' && <OptionDetail/>}*/}
                    {this.props.goTo === 'post' && <Post/>}
                    {this.props.goTo === 'postRead' && <PostRead post_id={this.props.post_id}/>}
                    {this.props.goTo === 'postAdd' && <PostAdd/>}
                    {this.props.goTo === 'postEdit' && <PostAdd post_id={this.props.post_id}/>}

                    {this.props.goTo === 'notice' && <Notice/>}
                    {this.props.goTo === 'noticeDetail' &&
                    <NoticeDetail id={this.props.id}
                                  content={this.props.content}
                                  date={this.props.date}
                    />
                    }
                    {this.props.goTo === 'version' && <Version/>}
                    {this.props.goTo === 'inquire' && <Inquire/>}
                    {this.props.goTo === 'license' && <License/>}
                </View>
                <TabButton/>
            </ImageBackground>
        );
    }
}

const dpi = Common.getRatio();
const wid = Common.winWidth();
const hei = Common.winHeight();
const navArrowSize = 40 * dpi;
const navArrowWrapperSize = navArrowSize + 10 * dpi;
var styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch',
    },
    backgroundImg: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    wrapper: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    summaryTitleWrapper: {
        height: 70 * dpi,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal:15*dpi,
    },
    navBtnWrapper:{
        minWidth: 0.22*wid,
        justifyContent: 'center',
    },
    navBackBtn: {
        width: navArrowWrapperSize,
        height: navArrowWrapperSize,
    },
    navBackArrow: {
        width: navArrowSize,
        height: navArrowSize,
        opacity: 0.3,
    },
    summaryTitle: {
        color: '#FFFFFF',
        opacity: 0.9,
        fontSize: 20 * dpi,
        textAlign: 'center',
        alignSelf: 'center'
    },
    rightBtn: {
        borderWidth: 1 * dpi,
        borderRadius: 20 * dpi,
        borderColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.6,
        paddingVertical:5*dpi,
    },
    rightBtnText: {
        color: '#FFFFFF',
        fontSize: 14 * dpi
    },
    hr: {
        borderBottomWidth: 1 * dpi,
        borderColor: '#FFFFFF',
        opacity: 0.8,
    },
});
