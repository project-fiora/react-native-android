/**
 * Created by kusob on 2017. 7. 16..
 */

import React, {Component} from 'react';
import {
    ScrollView,
    StyleSheet,
    Text, TouchableOpacity,
    View, Image, AsyncStorage
} from 'react-native';
import PrivateAddr from "../common/private/address";
import Common from "../common/common";
import WalletInfo from "../common/walletInfo";
import LoadingIcon from "../common/loadingIcon";

export default class FriendWallet extends Component {
    constructor(props) {
        super(props);

        this.state = {
            friendList: [],
            walletList: [],
            load: false,
            secondLoad: false,
            onClickFriendBox: false,
            onClickBox: false,
            enable: 'none',
            currentFriend: 0,
            currentWallet: 0,
            token: '',
        };
    }

    async componentDidMount() {
        await this.getFriendList();
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
                        this.setState({friendList: responseJson.list, load: true}, () => {
                            if (this.state.friendList.length != 0) {
                                this.getFriendWallet(this.state.friendList[this.state.currentFriend].id);
                            }
                        });
                    } else {
                        alert("친구정보를 가져올 수 없습니다");
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
                    if (list.length == 0) {
                        this.setState({walletList: [], load: true, secondLoad: true, enable: null});
                    } else { //친구지갑이 하나라도 있으면, 잔액조회를 한다.
                        this.setState({walletList: list, load: true, enable: null}, () => {
                            Promise.resolve().then(() =>
                                Common.getBalance(list[0].wallet_type, list[0].wallet_add)
                            ).then(result => {
                                var balance;
                                if (Number.isInteger(result)) {
                                    balance = (parseInt(result) / 100000000) + " " + type;
                                } else {
                                    balance = result;
                                }
                                this.setState({
                                    balance: balance,
                                    secondLoad: true
                                });
                            })
                        });
                    }
                } else {
                    alert("친구지갑정보를 가져올 수 없습니다");
                    return false;
                }
            }).catch((error) => {
                console.error(error);
            }).done();
        });
    }

    showFriend(i, friendId) {
        this.setState({
            currentFriend: i,
            friendId: friendId,
            secondLoad: false,
            enable: 'none',
            onClickFriendBox: !this.state.onClickFriendBox,
            onClickBox: false,
        }, () => this.getFriendWallet(friendId));
    }

    showWallet(i, type, addr) {
        this.setState({secondLoad: false}, () =>
            Promise.resolve().then(() => Common.getBalance(type, addr)).then(result => {
                var balance;
                if (Number.isInteger(result)) {
                    balance = (parseInt(result) / 100000000) + " " + type;
                } else {
                    balance = result;
                }
                this.setState({
                    balance: balance,
                    currentWallet: i,
                    onClickBox: !this.state.onClickBox,
                    secondLoad: true
                });
            })
        );
    }

    render() {
        return (
            <ScrollView contentContainerStyle={styles.frame}>
                {(!this.state.secondLoad || !this.state.load) &&
                <LoadingIcon/>
                }
                <ScrollView contentContainerStyle={styles.content}>
                    {(this.state.load && this.state.friendList.length == 0) &&
                    <View>
                        <Text style={styles.titleText}>
                            아직 친구가 한명도 없어요!{'\n'}
                            오른쪽 상단의 친구 관리에서{'\n'}
                            친구를 추가해보세요!
                        </Text>
                    </View>
                    }
                    {/*////////////////친구 리스트 select Box////////////////////*/}
                    {(this.state.load && this.state.friendList.length != 0) &&
                    <View pointerEvents={this.state.enable}>
                        <Text style={styles.titleText}>아래 버튼을 눌러서 친구와 친구지갑을 선택하세요!</Text>
                        <TouchableOpacity
                            underlayColor={'#AAAAAA'}
                            onPress={() => this.setState({onClickFriendBox: !this.state.onClickFriendBox})}
                        >
                            <View style={styles.selectBoxWrapper}>
                                <View style={styles.selectBoxRow}>
                                    <View style={styles.selectBoxTextWrapper}>
                                        <Text style={styles.selectBox}>
                                            {this.state.friendList[this.state.currentFriend].nickname}
                                        </Text>
                                    </View>
                                    <View style={styles.selectBoxIconWrapper}>
                                        <Text style={styles.selectIcon}>
                                            ▼
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                        {(() => {
                            if (this.state.onClickFriendBox == true) {
                                return this.state.friendList.map((friend, i) => {
                                    if (this.state.currentFriend != i)
                                        return (
                                            <TouchableOpacity
                                                underlayColor={'#AAAAAA'}
                                                onPress={() => this.showFriend(i, friend.id)}
                                                key={i}
                                            >
                                                <View style={styles.selectBoxWrapper}>
                                                    <Text style={styles.selectBox}>
                                                        {friend.nickname}
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                        );
                                })
                            }
                        })()}
                        <View style={styles.blank}/>
                        {/*////////////////친구 리스트 select Box////////////////////*/}
                        {(this.state.secondLoad && this.state.walletList.length == 0) &&
                        <View>
                            <Text style={styles.titleText}>친구 지갑이 없어요!</Text>
                        </View>
                        }
                        {(this.state.secondLoad && this.state.walletList.length != 0) &&
                        <View>
                            <TouchableOpacity
                                underlayColor={'#AAAAAA'}
                                onPress={() => this.setState({onClickBox: !this.state.onClickBox})}
                            >
                                <View style={styles.selectBoxWrapper}>
                                    <View style={styles.selectBoxRow}>
                                        <View style={styles.selectBoxTextWrapper}>
                                            <Text style={styles.selectBox}>
                                                {this.state.walletList[this.state.currentWallet].wallet_name}
                                            </Text>
                                        </View>
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
                                    return this.state.walletList.map((wallet, i) => {
                                        if (this.state.currentWallet != i)
                                            return (
                                                <TouchableOpacity
                                                    underlayColor={'#AAAAAA'}
                                                    onPress={() => this.showWallet(i, wallet.wallet_type, wallet.wallet_add)}
                                                    key={i}
                                                >
                                                    <View style={styles.selectBoxWrapper}>
                                                        <Text style={styles.selectBox}>
                                                            {wallet.wallet_name}
                                                        </Text>
                                                    </View>
                                                </TouchableOpacity>
                                            );
                                    })
                                }
                            })()}
                        </View>
                        }
                        {(this.state.load && this.state.secondLoad && this.state.walletList.length != 0) &&
                        <WalletInfo
                            wallet_name={this.state.walletList[this.state.currentWallet].wallet_name}
                            wallet_type={this.state.walletList[this.state.currentWallet].wallet_type}
                            balance={this.state.balance}
                            wallet_add={this.state.walletList[this.state.currentWallet].wallet_add}
                            qrcode={this.state.qrcode}
                        />
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
        padding: 15 * dpi,
        marginTop: 5 * dpi,
        alignItems: 'center',
        opacity: 0.8,
    },
    contentText: {
        color: '#FFFFFF',
        fontSize: 17 * dpi,
        marginTop: 10 * dpi,
        opacity: 0.8,
        marginBottom: 20 * dpi,
    },
    titleText: {
        textAlign: 'center',
        color: '#FFFFFF',
        fontSize: 17 * dpi,
        marginBottom: 10 * dpi,
        opacity: 0.8,
    },
    blank: {
        margin: 5 * dpi,
    },
    selectBoxWrapper: {
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000',
        width: 0.55 * wid,
        height: 0.055 * hei,
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
    selectBoxTextWrapper: {
        alignSelf: 'flex-start',
    },
    selectBox: {
        color: '#FFFFFF',
        fontSize: 17 * dpi,
    },
    selectBoxIconWrapper: {
        alignSelf: 'flex-end',
        alignItems: 'flex-end',
    },
    selectIcon: {
        color: '#FFFFFF',
        fontSize: 17 * dpi,
        opacity: 0.9,
    },
});
