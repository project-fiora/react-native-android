/**
 * Created by kusob on 2017. 7. 16..
 */

import React, { Component } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text, TouchableOpacity,
    View, Image, AsyncStorage
} from 'react-native';
import PrivateAddr from "../common/private/address";
import Common from "../common/common";
import WalletInfo from "../common/walletInfo";
import LoadingIcon from 'react-native-loading-spinner-overlay';
import StateStore from "../common/stateStore";
import SelectBox from '../common/selectBox';

export default class FriendWallet extends Component {
    constructor(props) {
        super(props);

        this.state = {
            friendList: [],
            walletList: [],
            load: false,
            secondLoad: false,
            enable: 'none',
            currentFriend: 0,
            currentWallet: 0,
            token: '',
            balance: '조회 중..',
        };
    }

    async componentDidMount() {
        if (!StateStore.guest()) {
            await this.getFriendList();
            StateStore.setCurrentWallet(this.state.currentWallet);
        }
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
                        this.setState({ friendList: responseJson.list, load: true });
                        if (responseJson.list.length != 0) {
                            this.getFriendWallet(responseJson.list[this.state.currentFriend].id);
                        } else {
                            this.setState({ secondLoad: true, enable: null });
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
                    StateStore.setCurrentMyWalletList(list);
                    this.setState({ walletList: list, load: true, enable: null, secondLoad: true });
                } else {
                    Common.alert("친구지갑정보를 가져올 수 없습니다");
                    return false;
                }
            }).catch((error) => {
                console.error(error);
            }).done(() => {
                if (this.state.walletList.length != 0) {//친구 지갑이 있으면
                    Promise.resolve().then(() => //어차피 친구를 바꾸면 친구지갑의 첫번째것만 보여주면 된다
                        Common.getBalance(this.state.walletList[0].wallet_type, this.state.walletList[0].wallet_add)
                    ).then(result => {
                        var balance;
                        if (Number.isInteger(result)&&this.state.walletList[0].wallet_type!="BSC") {
                            balance = (parseInt(result) / 100000000) + " " + this.state.walletList[0].wallet_type;
                        } else {
                            balance = result;
                        }
                        this.setState({
                            balance: balance
                        });
                    })
                }
            });
        });
    }

    showFriend(i, friendId) {
        this.setState({
            currentFriend: i,
            friendId: friendId,
            secondLoad: false,
            enable: 'none',
        }, () => this.getFriendWallet(friendId));
    }

    showWallet(i, type, addr) {
        this.setState({
            balance: '조회 중..',
            secondLoad: false,
            currentWallet: i,
            secondLoad: true
        }, () => {
            StateStore.setCurrentWallet(i);
            Promise.resolve().then(() => Common.getBalance(type, addr)).then(result => {
                var balance;
                if (Number.isInteger(result)&&this.state.walletList[i].wallet_type!="BSC") {
                    balance = (parseInt(result) / 100000000) + " " + type;
                } else {
                    balance = result;
                }
                this.setState({ balance: balance });
            })
        }
        );
    }

    render() {
        return (
            <ScrollView contentContainerStyle={styles.frame}>
                {((!this.state.secondLoad || !this.state.load) && !StateStore.guest()) &&
                    <LoadingIcon visible={true}/>
                }
                <ScrollView contentContainerStyle={styles.content}>
                    {StateStore.guest() &&
                        <Text style={{
                            color: '#FFFFFF',
                            fontSize: 18,
                            textAlign: 'center',
                            padding: 20,
                        }}>
                            로그인해야 친구 지갑 기능을 이용하실 수 있습니다!
                            서로 친구를 등록하고, 친구의 지갑 정보를 확인하세요!
                        </Text>
                    }
                    {(this.state.load && this.state.friendList.length == 0) &&
                        <View>
                            <Text style={styles.titleText}>
                                아직 친구가 한명도 없어요!{'\n'}
                                오른쪽 상단의 친구 관리에서{'\n'}
                                친구를 추가해보세요!
                            </Text>
                        </View>
                    }

                    {(this.state.load && this.state.friendList.length != 0) &&
                        <View pointerEvents={this.state.enable}>
                            <Text style={styles.titleText}>아래 버튼을 눌러서 친구와 친구지갑을 선택하세요!</Text>

                            <SelectBox
                                list={this.state.friendList}
                                currentItem={0}
                                selectBoxText="nickname"
                                onClickBoxFunction={(i) => {
                                    this.showFriend(i, this.state.friendList[i].id)
                                }} />
                            <View style={styles.blank} />

                            {(this.state.secondLoad && this.state.walletList.length == 0) &&
                                <Text style={styles.titleText}>친구 지갑이 없어요!</Text>
                            }
                            {(this.state.secondLoad && this.state.walletList.length != 0) &&
                                <SelectBox
                                    list={this.state.walletList}
                                    currentItem={0}
                                    selectBoxText="wallet_name"
                                    onClickBoxFunction={(i) => {
                                        this.showWallet(i, this.state.walletList[i].wallet_type, this.state.walletList[i].wallet_add)
                                    }} />
                            }
                            {(this.state.load && this.state.secondLoad && this.state.walletList.length != 0) &&
                                <WalletInfo
                                    wallet_name={this.state.walletList[this.state.currentWallet].wallet_name}
                                    wallet_type={this.state.walletList[this.state.currentWallet].wallet_type}
                                    balance={this.state.balance}
                                    wallet_add={this.state.walletList[this.state.currentWallet].wallet_add}
                                />
                            }
                        </View>
                    }
                </ScrollView>
            </ScrollView>
        );
    }
}

const wid = Common.winWidth();
const hei = Common.winHeight();
const styles = StyleSheet.create({
    frame: {
        flex: 1,
    },
    content: {
        padding: 15,
        marginTop: 5,
        alignItems: 'center',
        opacity: 0.8,
    },
    contentText: {
        color: '#FFFFFF',
        fontSize: 17,
        marginTop: 10,
        opacity: 0.8,
        marginBottom: 20,
    },
    titleText: {
        textAlign: 'center',
        color: '#FFFFFF',
        fontSize: 17,
        marginBottom: 10,
        opacity: 0.8,
    },
    blank: {
        margin: 5,
    },
});
