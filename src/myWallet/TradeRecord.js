/**
 * Created by kusob on 2017. 7. 7..
 */

import React, {Component} from 'react';
import {
    ScrollView,
    StyleSheet,
    Text, TextInput, TouchableOpacity,
    View, AsyncStorage
} from 'react-native';

import {Actions} from 'react-native-router-flux';
import Common from "../common/common";
import StateStore from '../common/stateStore';
import LoadingIcon from "../common/loadingIcon";
import PrivateAddr from "../common/private/address";

class TradeRecord extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loaded: false,
            success: false,
            onClickBox: false,
            list: StateStore.currentMyWalletList(),
            currentWallet: 0,
            message: '',
            data: {},
        };
    }

    async componentDidMount() {
        await this.getData();
    }

    showWallet(i) {
        this.setState({
            loaded: false,
            success: false,
            message:'',
            currentWallet: i,
            onClickBox: !this.state.onClickBox,
        }, () => this.getData());
    }

    getData() {
        var type = this.state.list[this.state.currentWallet].wallet_type;
        if (type == 'BTC') { //BTC 조회
            fetch("https://blockchain.info/ko/rawaddr/" + this.state.list[this.state.currentWallet].wallet_add)
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        this.setState({message: '조회할수없습니다'});
                        return false;
                    }
                }).then((responseJson) => {
                if (responseJson instanceof Object) {
                    console.log(responseJson);
                    this.setState({data: responseJson, success: true});
                } else {
                    this.setState({message: '조회할수없습니다'});
                }
            }).catch((error) => {
                console.error(error);
            }).done(() => this.setState({loaded: true}));
        } else {
            this.setState({message: '현재 ' + type + '은 거래조회를 지원하지 않습니다', loaded:true});
        }
    }

    render() {
        return (
            <ScrollView contentContainerStyle={styles.frame}>
                {!this.state.loaded &&
                <LoadingIcon/>
                }
                <ScrollView contentContainerStyle={styles.content}>
                    {(this.state.list.length == 0) &&
                    <Text style={styles.titleText}>
                        지갑이 한개도 없어요!
                    </Text>
                    }
                    {(this.state.list.length != 0) &&
                    <View>
                        <TouchableOpacity
                            underlayColor={'#AAAAAA'}
                            onPress={() => this.setState({onClickBox: !this.state.onClickBox})}
                        >
                            <View style={styles.selectBoxWrapper}>
                                <View style={styles.selectBoxRow}>
                                    <Text style={styles.selectBoxText}>
                                        {this.state.list[this.state.currentWallet].wallet_name}
                                    </Text>
                                    <View style={styles.selectBoxIconWrapper}>
                                        <Text style={styles.selectIcon}>
                                            ▼
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                        {(() => {
                            if (this.state.onClickBox == true) {
                                return this.state.list.map((wallet, i) => {
                                    if (this.state.currentWallet != i)
                                        return (
                                            <TouchableOpacity
                                                underlayColor={'#AAAAAA'}
                                                onPress={() => this.showWallet(i)}
                                                key={i}
                                            >
                                                <View style={styles.selectBoxWrapper}>
                                                    <View style={styles.selectBoxRow}>
                                                        <Text style={styles.selectBoxText}>
                                                            {wallet.wallet_name}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        );
                                })
                            }
                        })()}
                        <View style={styles.blank}/>
                        <Text style={styles.titleText}>
                            선택한 지갑주소
                        </Text>
                        <Text style={styles.titleText}>
                            {this.state.list[this.state.currentWallet].wallet_add}
                        </Text>
                        <Text style={styles.titleText}>
                            {this.state.message}
                        </Text>
                        {this.state.success &&
                        <Text style={styles.titleText}>
                            총 입금 금액 : {parseInt(this.state.data.total_received)/100000000} {this.state.list[this.state.currentWallet].wallet_type}{'\n'}
                            총 출금 금액 : {parseInt(this.state.data.total_sent)/100000000} {this.state.list[this.state.currentWallet].wallet_type}{'\n'}
                            잔액 : {parseInt(this.state.data.final_balance)/100000000} {this.state.list[this.state.currentWallet].wallet_type}{'\n'}
                        </Text>
                        }
                    </View>
                    }
                </ScrollView>
            </ScrollView>
        );
    }
}

const dpi = Common.getRatio();
const wid = Common.winWidth();
const hei = Common.winHeight();
const styles = StyleSheet.create({
    frame: {
        flex: 1,
    },
    content: {
        padding:15*dpi,
        alignItems: 'center',
    },
    titleText: {
        alignSelf: 'center',
        color: '#FFFFFF',
        fontSize: 17 * dpi,
        marginBottom: 10 * dpi,
        opacity: 0.8,
    },
    selectBoxWrapper: {
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000',
        width: 0.6 * wid,
        height: 0.065 * hei,
        opacity: 0.4,
        borderColor: '#FFFFFF',
        borderWidth: 1 * dpi,
        borderRadius: 10 * dpi,
        paddingLeft: 17 * dpi,
        paddingRight: 15 * dpi,
    },
    selectBoxRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    selectBoxText: {
        alignSelf: 'flex-start',
        color: '#FFFFFF',
        fontSize: 17 * dpi,
    },
    selectBoxIconWrapper: {
        alignItems: 'flex-end',
    },
    selectIcon: {
        color: '#FFFFFF',
        fontSize: 17 * dpi,
        opacity: 0.9,
    },
    blank:{
        margin:5*dpi,
    },
});

export default TradeRecord