/**
 * Created by kusob on 2017. 6. 27..
 */

import React, {Component} from 'react';
import {
    Image, ImageBackground,
    StyleSheet, Text, TouchableHighlight, TouchableOpacity,
    View
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

import Exchange from '../exchange/exchange';

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

export default class Main extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title:'',
            enableBackBtn:false,
            backBtnGoTo:'',
            enableRightBtn:false,
            rightBtnGoTo:'',
            rightBtnText:'',
            refreshGoTo:'price',
        };
    }

    componentWillMount() { //title, backBtn handler
        var p = this.props.goTo;

        if (p == 'home') {
            this.setState({title: '요약'});
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
        } else if(p=='myWalletEdit'){
            this.setState({
                title: '지갑 수정',
                enableBackBtn: true, backBtnGoTo: 'myWalletMng',
            });
        } else if(p=='myWalletAdd'){
            this.setState({
                title: '지갑 추가',
                enableBackBtn: true, backBtnGoTo: 'myWalletMng',
            });
        } else if(p=='friendWallet'){
            this.setState({
                title: '친구 지갑',
                enableRightBtn: true, rightBtnText: '친구 관리', rightBtnGoTo: 'friendWalletMng'
            });
        } else if(p=='friendWalletMng'){
            this.setState({
                title: '친구 관리', enableBackBtn:true, backBtnGoTo:'friendWallet',
            });
        } else if(p=='exchange'){
            this.setState({title:'자동 거래'});
        } else if(p=='price'){
            this.setState({
                title:'시세 정보',
                enableRightBtn: true, rightBtnText: '다른 정보', rightBtnGoTo: 'cryptocompare'
            });
        } else if(p=='cryptocompare'){
            this.setState({
                title:'시세 정보',
                enableBackBtn: true, backBtnGoTo:'price'
            });
        } else if(p=='more'){
            this.setState({
                title:'더보기'
            });
        } else if(p=='exchangeLink'){
            this.setState({
                title:'거래소 바로가기',
                enableBackBtn:true, backBtnGoTo:'more'});
        } else if(p=='exchangeSite'){
            this.setState({
                title:this.props.siteName,
                enableBackBtn:true, backBtnGoTo:'exchangeLink'});
        } else if(p=='convert'){
            this.setState({
                title:'모의환전',
                enableBackBtn:true, backBtnGoTo:'more'});
        } else if(p=='optionDetail'){
            this.setState({
                title:this.props.title,
                enableBackBtn:true, backBtnGoTo:'option'});
        } else if(p=='post'){
            this.setState({
                title:'커뮤니티',
                enableBackBtn:true, backBtnGoTo:'more',
                enableRightBtn: true, rightBtnText: '글쓰기', rightBtnGoTo: 'postAdd'
            });
        } else if(p=='postRead'){
            this.setState({
                title:'게시물 읽기',
                enableBackBtn:true, backBtnGoTo:'post',
            });
        } else if(p=='postAdd'){
            this.setState({
                title:'게시물 작성',
                enableBackBtn:true, backBtnGoTo:'post',
            });
        } else if(p=='postEdit'){
            this.setState({
                title:'게시물 수정',
                enableBackBtn:false,
            });
        } else if(p=='notice'){
            this.setState({
                title:'공지사항',
                enableBackBtn:true, backBtnGoTo:'more'
            });
        } else if(p=='noticeDetail'){
            this.setState({
                title:this.props.title,
                enableBackBtn:true, backBtnGoTo:'notice'
            });
        } else if(p=='version'){
            this.setState({
                title:'버전정보',
                enableBackBtn:true, backBtnGoTo:'more'
            });
        } else if(p=='inquire'){
            this.setState({
                title:'문의하기',
                enableBackBtn:true, backBtnGoTo:'more'
            });
        }
    }

    goTo(part) {
        Actions.main({goTo:part});
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
                        <Text style={styles.summaryTitle}>
                            {this.state.title}
                        </Text>
                    </View>
                    <View style={styles.hr}/>
                    {this.props.goTo === 'home' && <Home/>}
                    {this.props.goTo === 'price' && <Coinmarketcap/>}
                        {this.props.goTo === 'cryptocompare' && <Cryptocompare/>}

                    {this.props.goTo === 'myWallet' && <MyWallet/>}
                        {this.props.goTo === 'myWalletMng' && <MyWalletMng/>}
                        {this.props.goTo === 'myWalletEdit' &&
                            <MyWalletEdit id={this.props.id}/>
                        }
                        {this.props.goTo === 'myWalletAdd' && <MyWalletAdd/>}

                    {this.props.goTo === 'friendWallet' && <FriendWallet/>}
                        {this.props.goTo === 'friendWalletMng' && <FriendWalletMng/>}
                    {this.props.goTo === 'exchange' && <Exchange/>}

                    {this.props.goTo === 'more' && <More/>}
                        {this.props.goTo === 'exchangeLink' && <ExchangeLink/>}
                            {this.props.goTo === 'exchangeSite' && <ExchangeSite link={this.props.link}/>}
                        {this.props.goTo === 'convert' && <Convert/>}
                        {/*{this.props.goTo === 'option' && <Option/>}*/}
                            {/*{this.props.goTo === 'optionDetail' && <OptionDetail/>}*/}
                        {this.props.goTo === 'post' && <Post/>}
                            {this.props.goTo === 'postRead' && <PostRead post_id={this.props.post_id}/>}
                            {this.props.goTo === 'postAdd' && <PostAdd/>}
                            {this.props.goTo === 'postEdit' && <PostAdd
                                                                    post_id={this.props.post_id}
                                                                    title={this.props.title}
                                                                    contents={this.props.contents}
                                                                    edit={this.props.edit}
                                                               />
                            }
                        {this.props.goTo === 'notice' && <Notice/>}
                            {this.props.goTo === 'noticeDetail' &&
                                <NoticeDetail id={this.props.id}
                                              content={this.props.content}
                                              date={this.props.date}
                                />
                            }
                        {this.props.goTo === 'version' && <Version/>}
                        {this.props.goTo === 'inquire' && <Inquire/>}
                </View>
                {this.state.enableRightBtn == true &&
                    <TouchableHighlight
                        style={styles.rightBtn}
                        underlayColor={'#000000'}
                        onPress={() => this.goTo(this.state.rightBtnGoTo)}
                    >
                        <Text style={styles.rightBtnText}>{this.state.rightBtnText}</Text>
                    </TouchableHighlight>
                }
                {this.state.enableBackBtn == true &&
                    <TouchableOpacity
                        style={styles.navBackBtn}
                        underlayColor={'#AAAAAA'}
                        onPress={() => this.goTo(this.state.backBtnGoTo)}
                    >
                        <Image source={require('../common/img/navArrow.png')}
                               style={styles.navBackArrow}/>
                    </TouchableOpacity>
                }
                <TabButton/>
            </ImageBackground>
        );
    }
}

const dpi = Common.getRatio();
const navArrowSize = 40*dpi;
const navArrowWrapperSize=navArrowSize+10*dpi;
var styles = StyleSheet.create({
    container: {
        flex:1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch',
    },
    backgroundImg:{
        width:'100%',
        height:'100%',
        resizeMode:'cover',
    },
    wrapper: {
        flex:1,
        backgroundColor:'transparent',
        marginTop:30,
    },
    summaryTitleWrapper:{
        height:53,
        padding:10,
        alignItems:'center',
        alignSelf:"center",
    },
    summaryTitle:{
        color:'#FFFFFF',
        opacity:0.9,
        fontSize:22,
        textAlign:'center',
        alignSelf:'center'
        // paddingLeft:
        // backgroundColor:'#000000',
    },
    hr:{
        borderBottomWidth:1*dpi,
        borderColor:'#FFFFFF',
        opacity:0.8,
    },
    rightBtn: {
        position:'absolute',
        top:38,
        right:15,
        width: 80,
        height: 30,
        borderWidth: 1,
        borderRadius: 20,
        borderColor: '#FFFFFF',
        padding: 5,
        alignItems: 'center',
        justifyContent:'center',
        opacity:0.6
    },
    rightBtnText: {
        color: '#FFFFFF',
        fontSize: 15
    },
    navBackBtn:{
        width:navArrowWrapperSize,
        height:navArrowWrapperSize,
        position: 'absolute',
        top:32,
        left:15,
    },
    navBackArrow:{
        width:navArrowSize,
        height:navArrowSize,
        opacity:0.3,
    },
});
