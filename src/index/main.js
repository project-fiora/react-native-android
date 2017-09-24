/**
 * Created by kusob on 2017. 6. 27..
 */

import React, { Component } from 'react';
import {
    Image, ImageBackground,
    StyleSheet, Text, TouchableHighlight, TouchableOpacity,
    View, Alert, BackHandler
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Menu, {
    MenuContext,
    MenuTrigger,
    MenuOptions,
    MenuOption,
    renderers
} from 'react-native-popup-menu';

const { SlideInMenu } = renderers;
import Common from "../common/common";

import TabButton from '../common/tapButton';

import MyWallet from '../myWallet/myWallet';
import MyWalletCreate from '../myWallet/myWalletCreate';
import MyWalletAdd from '../myWallet/myWalletAdd';
import MyWalletEdit from '../myWallet/myWalletEdit';


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

import Notice from '../more/notice/notice';
import NoticeDetail from "../more/notice/noticeDetail";

import Inquire from '../more/inquire';
import PostAddEdit from "../more/post/postAddEdit";
import StateStore from "../common/stateStore";
import PrivatePolicy from "../more/privateInfoPolicy";
import License from "../more/license";
import TradeRecord from "../common/TradeRecord";

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
            enableRightHambug: false,
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

    //////////////////////////////////////////네비게이션 버튼과 타이틀 설정/////////////////////////////////////
    componentWillMount() { //title, backBtn handler
        var p = this.props.goTo;
        switch (p) {
            case 'price':
                this.setState({
                    title: '시세 정보',
                    enableRightBtn: true, rightBtnText: '다른 정보', rightBtnGoTo: 'coinmarketcap'
                });
                break;
            case 'coinmarketcap':
                this.setState({
                    title: '시세 정보',
                    enableBackBtn: true,
                });
                break;
            case 'myWallet':
                this.setState({
                    title: '내지갑',
                    enableRightHambug: true,
                });
                break;
            case 'myWalletCreate':
                this.setState({
                    title: '지갑 생성',
                    enableBackBtn: true,
                    enableRightBtn: true, rightBtnText: '저장', rightBtnGoTo: 'callCreateWallet'
                });
                break;
            case 'myWalletAdd':
                this.setState({
                    title: '지갑 추가',
                    enableBackBtn: true,
                    enableRightBtn: true, rightBtnText: '저장', rightBtnGoTo: 'callAddWallet'
                });
                break;
            case 'myWalletEdit':
                this.setState({
                    title: '지갑 관리',
                    enableBackBtn: true,
                    enableRightBtn: true, rightBtnText: '저장', rightBtnGoTo: 'callEditWallet'
                });
                break;
            case 'tradeRecord':
                this.setState({
                    title: '거래 기록 조회',
                    enableBackBtn: true,
                });
                break;
            case 'friendWallet':
                this.setState({
                    title: '친구 지갑',
                    enableRightHambug: true,
                });
                break;
            case 'friendWalletMng':
                this.setState({
                    title: '친구 관리',
                    enableBackBtn: true,
                });
                break;
            case 'exchange':
                this.setState({
                    title: '자동 거래',
                    enableBackBtn: true,
                });
                break;
            case 'more':
                this.setState({
                    title: '더보기'
                });
                break;
            case 'exchangeLink':
                this.setState({
                    title: '거래소 바로가기',
                    enableBackBtn: true,
                });
                break;
            case 'exchangeSite':
                this.setState({
                    title: this.props.siteName,
                    enableBackBtn: true,
                });
                break;
            case 'convert':
                this.setState({
                    title: '모의환전',
                    enableBackBtn: true,
                });
                break;
            case 'optionDetail':
                this.setState({
                    title: this.props.title,
                    enableBackBtn: true,
                });
                break;
            case 'post':
                this.setState({
                    title: '커뮤니티',
                    enableBackBtn: true,
                    enableRightBtn: true, rightBtnText: '글쓰기', rightBtnGoTo: 'postAdd'
                });
                break;
            case 'postRead':
                this.setState({
                    title: '게시물 읽기',
                    enableBackBtn: true,
                });
                break;
            case 'postAdd':
                this.setState({
                    title: '게시물 작성',
                    enableBackBtn: true,
                    enableRightBtn: true, rightBtnText: '등록', rightBtnGoTo: 'postWrite'
                });
                break;
            case 'postEdit':
                this.setState({
                    title: '게시물 수정',
                    enableBackBtn: true,
                    enableRightBtn: true, rightBtnText: '등록', rightBtnGoTo: 'postEdit'
                });
                break;
            case 'notice':
                this.setState({
                    title: '공지사항',
                    enableBackBtn: true,
                });
                break;
            case 'noticeDetail':
                this.setState({
                    title: this.props.title,
                    enableBackBtn: true,
                });
                break;
            case 'inquire':
                this.setState({
                    title: '문의하기',
                    enableBackBtn: true,
                });
                break;
            case 'privatePolicy':
                this.setState({
                    title: '개인정보처리방침',
                    enableBackBtn: true,
                });
                break;
            case 'license':
                this.setState({
                    title: '오픈소스 라이센스',
                    enableBackBtn: true,
                });
                break;
        }
        if (StateStore.guest()) {
            this.setState({
                enableRightHambug: false,
            });
            if (p == 'post') {
                this.setState({
                    enableRightBtn: false,
                });
            }
        }
    }

    selectMenu(val) { //myWallet SideMenu
        switch (val) {
            case 0:
                this.close;
                break;
            case 1: //지갑생성
                Actions.main({ goTo: 'myWalletCreate' });
                break;
            case 2: //지갑추가
                Actions.main({ goTo: 'myWalletAdd' });
                break;
            case 3: //지갑관리
                if (StateStore.currentMyWalletId() != undefined) {
                    Actions.main({
                        goTo: 'myWalletEdit',
                        id: StateStore.currentMyWalletId()
                    });
                } else { //지갑이 없는경우
                    Common.alert("지갑이 없어요!\n오류가 계속되면 관리자에게 문의해주세요");
                }
                break;
            case 4: //거래 조회
                Actions.main({
                    goTo: 'tradeRecord',
                    list: StateStore.currentMyWalletList(),
                    i: StateStore.currentWallet()
                });
                break;
            case 5: //친구 관리 
                Actions.main({ goTo: 'friendWalletMng' });
                break;
        }
    }

    async goTo(part) {
        switch (part) {
            case 'callCreateWallet':
                await MyWalletCreate.createWallet();
                break;
            case 'callAddWallet':
                await MyWalletAdd.addWallet();
                break;
            case 'callEditWallet':
                await Common.editWallet();
                break;
            case 'postWrite':
                await PostAddEdit.writePost();
                break;
            case 'postEdit':
                await PostAddEdit.editPost();
                break;
            default:
                Actions.main({ goTo: part });
                break;
        }
    }

    render() {
        return (
            <ImageBackground
                imageStyle={styles.backgroundImg}
                source={require('../common/img/bg-03.png')}
                style={styles.container}
            >
                <MenuContext style={{ flex: 1 }}>
                    <View style={styles.wrapper}>
                        <View style={styles.summaryTitleWrapper}>
                            <View style={styles.navBtnWrapper}>
                                {this.state.enableBackBtn &&
                                    <TouchableOpacity
                                        style={styles.navBackBtn}
                                        underlayColor={'#AAAAAA'}
                                        onPress={() => Actions.pop()
                                            //this.goTo(this.state.backBtnGoTo)
                                        }
                                    >
                                        <Image source={require('../common/img/navArrow.png')}
                                            style={styles.navBackArrow} />
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
                                {this.state.enableRightHambug &&
                                    <Menu renderer={SlideInMenu}
                                        onSelect={value => this.selectMenu(value)}>
                                        <MenuTrigger customStyles={MenuTriggerStyles}>
                                            <Image source={require('../common/img/hambug3.png')} style={styles.hambugBtn} />
                                        </MenuTrigger>
                                        {this.props.goTo === 'myWallet' &&
                                            <MenuOptions customStyles={optionsStyles}>
                                                <MenuOption value={1} text='지갑 생성' />
                                                <View style={styles.menuHr} />
                                                <MenuOption value={2} text='지갑 추가' />
                                                <View style={styles.menuHr} />
                                                <MenuOption value={3} text='지갑 관리' />
                                                <View style={styles.menuHr} />
                                                <MenuOption value={4} text='거래 조회' />
                                                <View style={styles.menuHr} />
                                                <MenuOption value={0} text='취소' customStyles={optionStyles} />
                                            </MenuOptions>
                                        }
                                        {this.props.goTo === 'friendWallet' &&
                                            <MenuOptions customStyles={optionsStyles}>
                                                <MenuOption value={5} text='친구 관리' />
                                                <View style={styles.menuHr} />
                                                <MenuOption value={4} text='거래 조회' />
                                                <View style={styles.menuHr} />
                                                <MenuOption value={0} text='취소' customStyles={optionStyles} />
                                            </MenuOptions>
                                        }
                                    </Menu>
                                }
                            </View>
                        </View>
                        <View style={styles.hr} />
                        {this.props.goTo === 'price' && <Coinmarketcap />}
                        {this.props.goTo === 'coinmarketcap' && <Cryptocompare />}

                        {this.props.goTo === 'myWallet' && <MyWallet />}
                        {this.props.goTo === 'myWalletEdit' &&
                            <MyWalletEdit id={this.props.id} />
                        }
                        {this.props.goTo === 'myWalletCreate' && <MyWalletCreate />}
                        {this.props.goTo === 'myWalletAdd' && <MyWalletAdd />}
                        {this.props.goTo === 'tradeRecord' && <TradeRecord />}

                        {this.props.goTo === 'friendWallet' && <FriendWallet />}
                        {this.props.goTo === 'friendWalletMng' && <FriendWalletMng />}


                        {this.props.goTo === 'more' && <More />}

                        {this.props.goTo === 'exchangeLink' && <ExchangeLink />}
                        {this.props.goTo === 'exchangeSite' && <ExchangeSite link={this.props.link} />}

                        {this.props.goTo === 'exchange' && <Exchange />}
                        {this.props.goTo === 'convert' && <Convert />}
                        {/*{this.props.goTo === 'option' && <Option/>}*/}
                        {/*{this.props.goTo === 'optionDetail' && <OptionDetail/>}*/}
                        {this.props.goTo === 'post' && <Post />}
                        {this.props.goTo === 'postRead' && <PostRead post_id={this.props.post_id} />}
                        {this.props.goTo === 'postAdd' && <PostAdd />}
                        {this.props.goTo === 'postEdit' && <PostAdd post_id={this.props.post_id} />}

                        {this.props.goTo === 'notice' && <Notice />}
                        {this.props.goTo === 'noticeDetail' &&
                            <NoticeDetail id={this.props.id}
                                content={this.props.content}
                                date={this.props.date}
                            />
                        }
                        {this.props.goTo === 'inquire' && <Inquire />}
                        {this.props.goTo === 'privatePolicy' && <PrivatePolicy />}
                        {this.props.goTo === 'license' && <License />}
                    </View>
                    <TabButton />
                </MenuContext>
            </ImageBackground>
        );
    }
}

const wid = Common.winWidth();
const hei = Common.winHeight();
const navArrowSize = 40;
const navArrowWrapperSize = navArrowSize + 10;
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
    summaryTitleWrapper: { //top (nav)
        height: 0.13 * hei,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
    },
    navBtnWrapper: {
        minWidth: 0.22 * wid,
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
        fontSize: 20,
        textAlign: 'center',
        alignSelf: 'center'
    },
    rightBtn: {
        borderWidth: 1,
        borderRadius: 20,
        borderColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.6,
        paddingVertical: 5,
    },
    rightBtnText: {
        color: '#FFFFFF',
        fontSize: 14
    },
    hambugBtn: {
        width: 0.09 * wid,
        height: 0.09 * wid,
        alignSelf: 'flex-end'
    },
    hr: {
        borderBottomWidth: 1,
        borderColor: '#FFFFFF',
        opacity: 0.8,
    },
    menuHr: {
        borderBottomWidth: 1,
        borderColor: '#A2A2A2',
        opacity: 0.8,
    },
});

const MenuTriggerStyles = {
    TriggerTouchableComponent: TouchableOpacity,
};

const optionsStyles = {
    optionsContainer: {
        width: 0.95 * wid,
        marginHorizontal: 0.025 * wid,
        marginTop: - (0.025 * wid),
        borderRadius: 15,
        borderColor: 'transparent',
        opacity: 0.95,
    },
    optionsWrapper: {

    },
    optionWrapper: {
        marginVertical: 12,
    },
    optionTouchable: {
        underlayColor: '#FFFFFF',
        activeOpacity: 50,
    },
    optionText: {
        color: '#858EFF',
        fontSize: 20,
        textAlign: 'center'
    },
};

const optionStyles = {
    optionWrapper: {
        marginVertical: 12,
    },
    optionText: {
        color: '#FF7B8C',
        fontSize: 20,
        textAlign: 'center'
    },
};

const cancelOptionsStyles = {
    optionsContainer: {
        width: 0.95 * wid,
        marginHorizontal: 0.025 * wid,
        marginTop: 10,
        borderRadius: 15,
        borderColor: 'transparent',
        opacity: 0.95,
    },
    optionsWrapper: {

    },
    optionWrapper: {
        marginVertical: 12,
    },
    optionTouchable: {
        underlayColor: '#FFFFFF',
        activeOpacity: 50,
    },
    optionText: {
        color: '#FF7B8C',
        fontSize: 20,
        textAlign: 'center'
    },
};