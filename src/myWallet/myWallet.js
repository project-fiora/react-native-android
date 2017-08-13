/**
 * Created by kusob on 2017. 6. 26..
 */
import React, { Component } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text, TouchableOpacity,
    View, AsyncStorage
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import PrivateAddr from "../common/private/address";
import Common from "../common/common";
import WalletInfo from "../common/walletInfo";
import LoadingIcon from "../common/loadingIcon";
import StateStore from "../common/stateStore";
import SelectBox from '../common/selectBox';

export default class MyWallet extends Component {
    constructor(props) {
        super(props);

        this.state = {
            walletList: [{
                wallet_add:"3D2oetdNuZUqQHPJmcMDDHYoqkyNVsFk9r",
                wallet_name:"보석이의 지갑",
                wallet_type:"BTC",
            }],
            load: false,
            currentWallet: 0,
            balance: '조회 중..',
        };
    }

    async componentDidMount() {
        if (!StateStore.guest()) {
            await this.getMyWallet();
            StateStore.setCurrentWallet(this.state.currentWallet);
        } else {
            Promise.resolve()
            .then(() => Common.getBalance(this.state.walletList[0].wallet_type,
                this.state.walletList[0].wallet_add))
            .then(result => {
                var balance;
                if (Number.isInteger(result)) {
                    balance = (parseInt(result) / 100000000) + " " + this.state.walletList[0].wallet_type;
                } else {
                    balance = result;
                }
                this.setState({ balance: balance });
            });
        }
    }

    goTo(part) {
        Actions.main({ goTo: part });
    }

    async getMyWallet() {
        await AsyncStorage.getItem('Token', (err, result) => {
            try {
                if (err != null) {
                    alert(err);
                    return false;
                }
                const token = JSON.parse(result).token;
                fetch(PrivateAddr.getAddr() + "wallet/list", {
                    method: 'GET', headers: {
                        "Authorization": token,
                        "Accept": "*/*",
                    }
                })
                    .then((response) => response.json())
                    .then((responseJson) => {
                        if (responseJson.message == "SUCCESS") {
                            var list = responseJson.list;
                            this.setState({ walletList: list, load: true }, () => {
                                if (this.state.walletList.length != 0)
                                    StateStore.setCurrentMyWalletId(this.state.walletList[0].wallet_Id);
                                StateStore.setCurrentMyWalletList(this.state.walletList);
                                AsyncStorage.setItem('WalletList', JSON.stringify(this.state.walletList))
                            });
                        } else {
                            Common.alert("지갑정보를 가져올 수 없습니다");
                            return false;
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                    })
                    .done(() => {
                        if (this.state.walletList.length != 0) { //내 지갑이 있을때만 잔액 조회를 해야한다
                            Promise.resolve()
                                .then(() => Common.getBalance(this.state.walletList[this.state.currentWallet].wallet_type,
                                    this.state.walletList[this.state.currentWallet].wallet_add))
                                .then(result => {
                                    var balance;
                                    if (Number.isInteger(result)) {
                                        balance = (parseInt(result) / 100000000) + " " + this.state.walletList[this.state.currentWallet].wallet_type;
                                    } else {
                                        balance = result;
                                    }
                                    this.setState({ balance: balance });
                                });
                        }
                    });
            } catch (err) {
                alert(err);
                Actions.main({ goTo: 'home' });
            }
        });
    }

    showWallet(i, type, addr) {
        this.setState({
            currentWallet: i,
            balance: '조회 중..',
        }, () => {
            StateStore.setCurrentWallet(i);
            StateStore.setCurrentMyWalletId(this.state.walletList[i].wallet_Id);
            Promise.resolve()
                .then(() => Common.getBalance(type, addr))
                .then(result => {
                    var balance;
                    if (Number.isInteger(result)) {
                        balance = (parseInt(result) / 100000000) + " " + type;
                    } else {
                        balance = result;
                    }
                    this.setState({ balance: balance });
                });
        }
        );
    }

    render() {
        return (
            <ScrollView contentContainerStyle={styles.frame}>
                {(!this.state.load && !StateStore.guest()) &&
                    <LoadingIcon />
                }
                <ScrollView contentContainerStyle={styles.content}>
                    {StateStore.guest() &&
                        <View>
                            <Text style={{
                                color: '#FFFFFF',
                                fontSize: 18,
                                textAlign: 'center',
                            }}>
                                ** 지금 보시는 지갑은 예시입니다 **{'\n'}
                                로그인 시, 지갑 이름(마음대로)과
                                지갑 주소를 등록하시면 아래처럼 지갑정보를 볼수있고,
                                거래내역조회도 가능합니다.
                            </Text>
                            <WalletInfo
                                wallet_name={this.state.walletList[0].wallet_name}
                                wallet_type={this.state.walletList[0].wallet_type}
                                balance={this.state.balance}
                                wallet_add={this.state.walletList[0].wallet_add}
                            />
                        </View>
                    }
                    {(this.state.load == true && this.state.walletList.length == 0) &&
                        <View>
                            <Text style={styles.titleText}>
                                아직 지갑이 한개도 없어요!{'\n'}
                                오른쪽 상단의 버튼을 통해서{'\n'}
                                지갑을 추가하세요!
                        </Text>
                        </View>
                    }
                    {(this.state.load == true && this.state.walletList.length != 0) &&
                        <View>
                            <Text style={styles.titleText}>아래 버튼을 눌러서 지갑을 선택하세요!</Text>

                            <SelectBox
                                list={this.state.walletList}
                                currentItem={0}
                                selectBoxText="wallet_name"
                                onClickBoxFunction={(i) => {
                                    this.showWallet(i, this.state.walletList[i].wallet_type, this.state.walletList[i].wallet_add)
                                }} />

                            <WalletInfo
                                wallet_name={this.state.walletList[this.state.currentWallet].wallet_name}
                                wallet_type={this.state.walletList[this.state.currentWallet].wallet_type}
                                balance={this.state.balance}
                                wallet_add={this.state.walletList[this.state.currentWallet].wallet_add}
                            />
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
        padding: 20 * dpi,
        marginTop: 5 * dpi,
        opacity: 0.8,
    },
    contentText: {
        color: '#FFFFFF',
        fontSize: 17 * dpi,
        marginTop: 10 * dpi,
        opacity: 0.8,
        marginBottom: 5 * dpi,
        alignSelf: 'flex-start',
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
        width: 0.55 * wid,
        height: 0.055 * hei,
        opacity: 0.4 * dpi,
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
    qrCode: {
        marginTop: 5 * dpi,
        width: 100 * dpi,
        height: 100 * dpi,
    },
});
