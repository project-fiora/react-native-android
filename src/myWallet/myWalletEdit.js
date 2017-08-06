/**
 * Created by kusob on 2017. 7. 7..
 */

import React, { Component } from 'react';
import {
    StyleSheet, Alert, AsyncStorage, ScrollView,
    Text, TextInput, TouchableHighlight, View, TouchableOpacity, Image,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import PrivateAddr from "../common/private/address";
import Common from "../common/common";
import LoadingIcon from "../common/loadingIcon";
import StateStore from "../common/stateStore";

export default class MyWalletEdit extends Component {
    constructor(props) {
        super(props);

        this.state = {
            load: false,
            name: '',
            addr: '',
            wallet: {},
            onClickBox: false,
            TYPE: ['BTC', 'ETH', 'ETC', 'XRP', 'LTC', 'DASH'],
            currentTYPE: 0,
            token: '',
        };

    }

    async componentDidMount() {
        StateStore.setEdit_walletId(this.props.id);
        await this.getToken();
        await this.getMyWallet();
    }

    async getToken() {
        const tokens = await AsyncStorage.getItem('Token');
        this.setState({ token: JSON.parse(tokens).token });
    }

    async getMyWallet() {
        if (StateStore.currentMyWalletList().length != 0) {
            var list = StateStore.currentMyWalletList()[StateStore.currentWallet()];
            StateStore.setEdit_walletAddr(list.wallet_add);
            StateStore.setEdit_walletName(list.wallet_name);
            StateStore.setEdit_walletType(list.wallet_type);
            for (var i = 0; i < this.state.TYPE.length; i++) {
                if (this.state.TYPE[i] == list.wallet_type) {
                    this.setState({
                        wallet: list,
                        id: list.wallet_Id,
                        name: list.wallet_name,
                        addr: list.wallet_add,
                        currentTYPE: i,
                        load: true
                    });
                }
            }
        }
    }

    async removeWallet() {
        Alert.alert(
            '경고!',
            '지갑이 삭제됩니다.\n정말 지우실건가요!?',
            [
                {
                    text: 'Cancel', onPress: () => {
                        return false
                    }, style: 'cancel'
                },
                {
                    text: 'OK', onPress: () => {
                        try {
                            //지갑 삭제하기
                            fetch(PrivateAddr.getAddr() + "wallet/delete?WalletId=" + this.props.id, {
                                method: 'DELETE', headers: {
                                    "Authorization": this.state.token,
                                    "Accept": "*/*",
                                }
                            })
                                .then((response) => response.json())
                                .then((responseJson) => {
                                    if (responseJson.message == "SUCCESS") {
                                        alert("지갑을 삭제했습니다");
                                    } else {
                                        alert("지갑 삭제 실패");
                                        return false;
                                    }
                                })
                                .catch((error) => {
                                    console.error(error);
                                });
                            Actions.main({ goTo: 'myWallet' });
                        } catch (err) {
                            alert('삭제실패 ' + err);
                            return false;
                        }
                    }
                },
            ],
            { cancelable: false }
        )
    }

    setType(i) {
        this.setState({ currentTYPE: i, onClickBox: !this.state.onClickBox }, () => {
            StateStore.setEdit_walletType(this.state.TYPE[this.state.currentTYPE]);
        });
    }

    render() {
        return (
            <ScrollView contentContainerStyle={styles.frame}>
                {this.state.load == false &&
                    <LoadingIcon />
                }
                {this.state.load == true &&
                    <View>
                        <Text style={styles.explain}>여기에서 지갑 정보를 수정해보세요!</Text>
                        <TextInput
                            style={styles.inputWalletName}
                            value={this.state.name}
                            onChangeText={(name) => {
                                this.setState({ name: name });
                                StateStore.setEdit_walletName(name);
                            }}
                            placeholder={'지갑 이름'}
                            placeholderTextColor="#FFFFFF"
                            autoCapitalize='none'
                            maxLength={10}
                            multiline={false}
                        />
                        {/*-------------SELECT BOX START---------------*/}
                        <Text style={styles.explain2}>아래 버튼을 눌러서 지갑 유형을 선택하세요!</Text>
                        <TouchableOpacity
                            underlayColor={'#AAAAAA'}
                            onPress={() => this.setState({ onClickBox: !this.state.onClickBox })}
                        >
                            <View style={styles.selectBoxWrapper}>
                                <View style={styles.selectBoxRow}>
                                    <Text style={styles.selectBoxText}>
                                        {this.state.TYPE[this.state.currentTYPE]}
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
                                return this.state.TYPE.map((type, i) => {
                                    return (
                                        <TouchableOpacity
                                            underlayColor={'#AAAAAA'}
                                            onPress={() => this.setType(i)}
                                            key={i}
                                        >
                                            <View style={styles.selectBoxWrapper}>
                                                <View style={styles.selectBoxRow}>
                                                    <Text style={styles.selectBoxText}>
                                                        {type}
                                                    </Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })
                            }
                        })()}
                        {/*-------------SELECT BOX END---------------*/}
                        <TextInput
                            style={styles.inputWalletAddr}
                            value={this.state.addr}
                            onChangeText={(addr) => {
                                this.setState({ addr: addr });
                                StateStore.setEdit_walletAddr(addr);
                            }}
                            placeholder={'지갑 주소'}
                            placeholderTextColor="#FFFFFF"
                            autoCapitalize='none'
                            maxLength={200}
                            multiline={false}
                        />

                        <TouchableHighlight
                            style={styles.removeBtn}
                            underlayColor={'#000000'}
                            onPress={() => this.removeWallet()}
                        >
                            <Text style={styles.removeBtnText}>지갑 삭제</Text>
                        </TouchableHighlight>
                    </View>
                }
            </ScrollView>
        );
    }
}

const dpi = Common.getRatio();
const wid = Common.winWidth();
const hei = Common.winHeight();
const styles = StyleSheet.create({
    frame: {
        alignItems: 'center',
    },
    explain: {
        color: '#FFFFFF',
        opacity: 0.8,
        fontSize: 15 * dpi,
        margin: 15 * dpi,
    },
    inputWalletName: {
        width: 0.6 * wid,
        height: 0.075 * hei,
        fontSize: 15 * dpi,
        color: '#FFFFFF',
        borderColor: '#FFFFFF',
        borderWidth: 1 * dpi,
        borderRadius: 15 * dpi,
        alignSelf: 'center',
        backgroundColor: '#000000',
        opacity: 0.3,
        marginBottom: 5 * dpi,
        paddingLeft: 20 * dpi,
    },
    explain2: {
        color: '#FFFFFF',
        opacity: 0.8,
        fontSize: 15 * dpi,
        margin: 15 * dpi,
    },
    selectBoxWrapper: {
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000',
        width: 0.6 * wid,
        height: 0.075 * hei,
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
    inputWalletAddr: {
        width: 0.6 * wid,
        height: 0.075 * hei,
        fontSize: 14 * dpi,
        color: '#FFFFFF',
        borderColor: '#FFFFFF',
        borderWidth: 1 * dpi,
        borderRadius: 15 * dpi,
        alignSelf: 'center',
        backgroundColor: '#000000',
        opacity: 0.3,
        marginTop: 10 * dpi,
        marginBottom: 10 * dpi,
        paddingLeft: 12 * dpi,
    },
    removeBtn: {
        width: 0.3 * wid,
        height: 0.05 * hei,
        borderWidth: 1 * dpi,
        borderRadius: 20 * dpi,
        borderColor: '#FFFFFF',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.6
    },
    removeBtnText: {
        color: '#FFFFFF',
        fontSize: 15 * dpi
    },
});