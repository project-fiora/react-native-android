/**
 * Created by kusob on 2017. 7. 7..
 */

import React, { Component } from 'react';
import {
    StyleSheet, Alert, AsyncStorage, ScrollView,
    Text, TextInput, TouchableHighlight, View, TouchableOpacity, Image, Clipboard
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import PrivateAddr from "../common/private/address";
import Common from "../common/common";
import LoadingIcon from 'react-native-loading-spinner-overlay';
import StateStore from "../common/stateStore";
import SelectBox from '../common/selectBox';


/**
 * POST
보내는 주소 : sendAddress
보내는 금액 : amount
수수료 : fee
개인키 : privateKey
받는 주소 : incomingAddress
 */

export default class SendCoin extends Component {
    constructor(props) {
        super(props);

        this.state = {
            load: false,
            friendLoad: false,
            token: {},
            sendAddress: '',
            amount: '',
            fee: '',
            incomingAddress: '',
            wallet: [],
            friendList: [],
            friendWalletList: [],
            currentWallet: 0,
            currentFriend: 0,
            currentFriendWallet: 0,
        };

    }
    // walletName + walletPassword + "_privateKey"
    componentDidMount() {
        this.getMyWallet();
        this.getFriendList();
    }

    async getMyWallet() {
        await AsyncStorage.getItem('Token', (err, result) => {
            try {
                if (err != null) {
                    alert(err);
                    return false;
                }
                const token = JSON.parse(result).token;
                this.setState({ token: token });
                fetch(PrivateAddr.getAddr() + "wallet/list", {
                    method: 'GET', headers: {
                        "Authorization": token,
                        "Accept": "*/*",
                    }
                })
                    .then((response) => response.json())
                    .then((responseJson) => {
                        if (responseJson.message == "SUCCESS") {
                            this.setState({
                                wallet: responseJson.list.filter((item) => {
                                    return item.wallet_type == "BSC";
                                })
                            }, () => {
                                this.setState({ load: true });
                            });
                        } else {
                            Common.alert("지갑정보를 가져올 수 없습니다");
                            return false;
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                    })
                    .done();
            } catch (err) {
                alert(err);
                Actions.main({ goTo: 'home' });
            }
        });
    }

    setMyWallet(i) {
        this.setState({ currentWallet: i });
    }

    async getFriendList() {
        await AsyncStorage.getItem('Token', (err, result) => {
            try {
                if (err != null) {
                    alert(err);
                    return false;
                }
                const token = JSON.parse(result).token;
                fetch(PrivateAddr.getAddr() + "friend/myfriend", {
                    method: 'GET', headers: {
                        "Authorization": token,
                        "Accept": "*/*",
                    }
                }).then((response) => response.json()).then((responseJson) => {
                    if (responseJson.message == "SUCCESS") {
                        this.setState({ friendList: responseJson.list, friendLoad: true });
                        if (responseJson.list.length != 0) {
                            this.getFriendWallet(responseJson.list[this.state.currentFriend].id);
                        } else {
                            this.setState({ secondLoad: true });
                        }
                    } else {
                        Common.alert("친구정보를 가져올 수 없습니다");
                        return false;
                    }
                }).catch((error) => {
                    console.error(error);
                }).done();
            } catch (err) {
                console.error(err);
                return false;
            }
        });
    }

    setFriend(i, friendId) {
        this.setState({
            currentWallet: i,
            secondLoad: false,
            friendId: friendId,
        }, () => {
            this.getFriendWallet(friendId);
        });
    }

    async getFriendWallet(friendId) {
        // GET /api/friend/lookfriedwallet
        await AsyncStorage.getItem('Token', (err, result) => {
            if (err != null) {
                alert(err);
                return false;
            }
            const token = JSON.parse(result).token;
            fetch(PrivateAddr.getAddr() + "friend/lookfriendwallet?friendId=" + friendId, {
                method: 'GET', headers: {
                    "Authorization": token,
                    'Accept': 'application/json',
                }
            }).then((response) => response.json()).then((responseJson) => {
                if (responseJson.message == "SUCCESS") {
                    var list = responseJson.list;
                    this.setState({ friendWalletList: list, secondLoad: true });
                } else {
                    Common.alert("친구지갑정보를 가져올 수 없습니다");
                    return false;
                }
            }).catch((error) => {
                console.error(error);
            }).done();
        });
    }

    setFriendWallet(i) {
        this.setState({
            currentFriendWallet: i,
            incomingAddress: this.state.friendWalletList[i].wallet_add,
        });
    }

    async sendCoin() {
        try {
            const value = await AsyncStorage.getItem(this.state.wallet[this.state.currentWallet].wallet_name + this.state.password + "_privateKey");
            if (value !== null) {
                // console.log(value);
                // console.log(this.state.wallet[this.state.currentWallet].wallet_name + this.state.password + "_privateKey");
                fetch(PrivateAddr.getAwsAddr() + "payment", {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        sendAddress: this.state.sendAddress,
                        amount: this.state.amount,
                        fee: this.state.fee,
                        privateKey: value,
                        incomingAddress: this.state.incomingAddress,
                    })
                }).then((response) => {
                    return response.json()
                }).then((responseJson) => {
                    if (responseJson.message == "SUCCESS") {
                        Common.alert("송금에 성공하였습니다!");
                        Actions.main({ goTo: 'myWallet' });
                    } else if(responseJson.message == "ERROR"){
                        this.setState({ load: true });
                        Common.alert("송금에 실패하였습니다!");
                        return false;
                    } else {
                        Common.alert("알수없는 에러입니다.\n관리자에게 문의하세요");
                        return false;
                    }
                }).catch((error) => {
                    Common.alert('Network Connection Failed');
                    console.error(error);
                    return false;
                }).done();
            }
        } catch (error) {
            // Error retrieving data
            console.error(error);
        }
    }

    render() {
        return (
            <ScrollView contentContainerStyle={styles.frame}>
                {(!this.state.secondLoad || !this.state.load || !this.state.friendLoad) &&
                    <LoadingIcon visible={true} />
                }
                <View>
                    <Text style={styles.explain}>
                        지갑을 선택하고, 송금해보세요!{'\n'}
                        현재 BSC만 지원합니다.
                    </Text>
                    <View style={styles.hr} />
                    <Text style={styles.explain}>
                        내 지갑
                    </Text>
                    {this.state.load &&
                        <SelectBox
                            list={this.state.wallet}
                            currentItem={this.state.currentWallet}
                            selectBoxText="wallet_name"
                            onClickBoxFunction={(i) => {
                                this.setMyWallet(i);
                            }} />
                    }
                    <Text style={styles.explain}>
                        주소를 터치하면 클립보드에 복사됩니다.
                    </Text>
                    {this.state.load &&
                        <Text
                            style={styles.explain}
                            //numberOfLines={1}
                            //ellipsizeMode='tail'
                            onPress={() => {
                                Clipboard.setString(this.state.wallet[this.state.currentWallet].wallet_add);
                                alert("클립보드에 복사되었습니다.");
                            }}
                        >
                            {this.state.wallet[this.state.currentWallet].wallet_add}
                        </Text>
                    }
                    <View style={styles.hr} />
                    <Text style={styles.explain}>
                        받을 친구 선택
                    </Text>
                    {this.state.friendLoad && this.state.friendList.length != 0 &&
                        <SelectBox
                            list={this.state.friendList}
                            currentItem={this.state.currentFriend}
                            selectBoxText="nickname"
                            onClickBoxFunction={(i) => {
                                this.setFriend(i, this.state.friendList[i].id);
                            }} />
                    }
                    {this.state.friendLoad && this.state.friendList.length == 0 &&
                        <Text style={styles.explain}>친구가 없습니다.</Text>
                    }

                    {this.state.secondLoad && this.state.friendList.length != 0 &&
                        this.state.friendWalletList.length != 0 &&
                        <View>
                            <Text style={styles.explain}>
                                친구 지갑 선택
                        </Text>
                            <SelectBox
                                list={this.state.friendWalletList}
                                currentItem={this.state.currentFriendWallet}
                                selectBoxText="wallet_name"
                                onClickBoxFunction={(i) => {
                                    this.setFriendWallet(i);
                                }} />
                        </View>
                    }
                    {this.state.secondLoad && this.state.friendList.length != 0 && this.state.friendWalletList.length == 0 &&
                        <Text style={styles.explain}>선택한 친구의 지갑이 없습니다.</Text>
                    }
                    <View style={styles.hr} />

                    <TextInput
                        value={this.state.incomingAddress}
                        onChangeText={(addr) => this.setState({ incomingAddress: addr })}
                        placeholder={'친구의 지갑을 선택하거나, 받는 주소를 입력하세요'}
                        placeholderTextColor="#FFFFFF"
                        autoCapitalize='none'
                        multiline={false}
                        autoCorrect={false}
                    />

                    <TextInput
                        value={this.state.password}
                        onChangeText={(pw) => this.setState({ password: pw })}
                        keyboardType='numeric'
                        placeholder={'비밀번호'}
                        placeholderTextColor="#FFFFFF"
                        secureTextEntry={true}
                        maxLength={8}
                        multiline={false}
                    />

                    <TextInput
                        value={this.state.amount}
                        onChangeText={(am) => this.setState({ amount: am })}
                        keyboardType='numeric'
                        placeholder={'보낼 금액'}
                        placeholderTextColor="#FFFFFF"
                        autoCapitalize='none'
                        multiline={false}
                        autoCorrect={false}
                    />

                    <TextInput
                        value={this.state.fee}
                        onChangeText={(f) => this.setState({ fee: f })}
                        keyboardType='email-address'
                        placeholder={'수수료(선택)'}
                        placeholderTextColor="#FFFFFF"
                        autoCapitalize='none'
                        multiline={false}
                        autoCorrect={false}
                    />

                    <TouchableOpacity
                        style={styles.sendCoinBtn}
                        onPress={() => {
                            this.setState({ load: false }, () => {
                                this.sendCoin();
                            });
                        }}
                    >
                        <Text style={styles.sendCoinBtnText}>송 금</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    }
}

const wid = Common.winWidth();
const hei = Common.winHeight();
const styles = StyleSheet.create({
    frame: {
        alignItems: 'center',
        padding: 15,
    },
    explain: {
        color: '#FFFFFF',
        opacity: 0.8,
        fontSize: 15,
        margin: 5,
        textAlign: 'center',
    },
    hr: {
        borderColor: '#FFFFFF',
        borderTopWidth: 0.6,
        opacity: 0.8,
        marginVertical: 5,
        // borderStyle:'dashed',  //<= not working
    },
    sendCoinBtn: {
        width: 0.3 * wid,
        borderWidth: 1,
        borderRadius: 20,
        borderColor: '#FFFFFF',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.9,
        paddingVertical: 5,
        marginBottom: 5,
    },
    sendCoinBtnText: {
        color: '#FFFFFF',
        fontSize: 19,
    },
});