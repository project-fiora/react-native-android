/**
 * Created by kusob on 2017. 7. 7..
 */

import React, { Component } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text, TextInput, TouchableOpacity,
    View, AsyncStorage
} from 'react-native';

import { Actions } from 'react-native-router-flux';
import LoadingIcon from 'react-native-loading-spinner-overlay';

import StateStore from '../common/stateStore';
import Common from "../common/common";

import PrivateAddr from "../common/private/address";

class MyWalletCreate extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            addr: '',
            loading: false,
        };
    }

    static async createWallet(callback) {
        //getAwsAddr
        var walletName = StateStore.createWalletName();
        if (walletName == "" || walletName == undefined) {
            alert("지갑 이름을 입력하세요!");
            callback();
            return false;
        } else {
            fetch(PrivateAddr.getAwsAddr() + 'wallet/create', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            }).then((response) => {
                return response.json()
            }).then((responseJson) => {
                try {
                    if (responseJson !== null) {
                        StateStore.setCreateWalletAddr(responseJson.address);
                        AsyncStorage.setItem(walletName + "_privateKey", responseJson.private_key, () => {
                            AsyncStorage.getItem('Token', (err, result) => {
                                if (err != null) {
                                    alert(err);
                                    return false;
                                }
                                const token = JSON.parse(result).token;
                                try {
                                    //post api call
                                    fetch(PrivateAddr.getAddr() + 'wallet/add', {
                                        method: 'POST',
                                        headers: {
                                            'Accept': 'application/json',
                                            'Content-Type': 'application/json',
                                            'Authorization': token
                                        },
                                        body: JSON.stringify({
                                            walletName: walletName,
                                            walletAddr: StateStore.createWalletAddr(),
                                            walletType: "BSC", //보석코인
                                        })
                                    }).then((response) => {
                                        return response.json()
                                    }).then((responseJson) => {
                                        if (responseJson.message == "SUCCESS") {
                                            alert('지갑을 추가했습니다!');
                                            Actions.main({ goTo: 'myWallet' });
                                        } else {
                                            alert('오류가 발생했습니다.\n다시 시도해주세요!');
                                        }
                                    }).catch((error) => {
                                        alert('Network Connection Failed');
                                        console.error(error);
                                    }).done();
                                    StateStore.setCreateWalletName('');
                                } catch (err) {
                                    alert('지갑추가실패 : ' + err);
                                } finally {
                                    callback();
                                }
                            });
                        });

                    }
                } catch (e) {
                    alert("지갑 만들기 실패");
                    console.error(e);
                }
            }).catch((error) => {
                alert('Network Connection Failed');
                console.error(error);
            }).done(() => {
                callback();
            });
        }
    }

    render() {
        return (
            <ScrollView contentContainerStyle={styles.frame}>
                {this.state.loading &&
                    <LoadingIcon visible={true} />
                }
                <ScrollView contentContainerStyle={styles.content}>
                    <Text style={styles.explain}>
                        {'\n'}{'\n'}
                        여기서 지갑을 생성하세요!{'\n'}
                        지갑이름만 입력하면 편하게 지갑이 생성되고,{'\n'}
                        생성한 지갑은 내지갑에 바로 추가됩니다.{'\n'}
                        보석코인 지갑생성만 지원합니다.
                    </Text>
                    <TextInput
                        style={styles.inputName}
                        value={this.state.name}
                        onChangeText={(name) => {
                            this.setState({ name: name });
                            StateStore.setCreateWalletName(name);
                        }}
                        placeholder={'지갑 이름'}
                        placeholderTextColor="#FFFFFF"
                        autoCapitalize='none'
                        autoCorrect={false}
                        maxLength={20}
                        multiline={false}
                    />
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
        alignItems: 'center',
    },
    explain: {
        color: '#FFFFFF',
        opacity: 0.8,
        fontSize: 18,
        margin: 15,
    },
    inputName: {
        width: 0.6 * wid,
        height: 0.065 * hei,
        fontSize: 15,
        color: '#FFFFFF',
        borderColor: '#FFFFFF',
        borderWidth: 1,
        borderRadius: 15,
        alignSelf: 'center',
        backgroundColor: '#000000',
        opacity: 0.3,
        marginBottom: 10,
        paddingLeft: 15,
    },
    explain2: {
        color: '#FFFFFF',
        opacity: 0.8,
        fontSize: 15,
        margin: 15,
    },
    inputWalletAddr: {
        width: 0.6 * wid,
        height: 0.07 * hei,
        fontSize: 13,
        color: '#FFFFFF',
        borderColor: '#FFFFFF',
        borderWidth: 1,
        borderRadius: 15,
        alignSelf: 'center',
        backgroundColor: '#000000',
        opacity: 0.3,
        marginTop: 10,
        marginBottom: 10,
        paddingLeft: 15,
    },
    explainQRcode: {
        textAlign: 'center',
        color: '#FFFFFF',
        opacity: 0.8,
        fontSize: 15,
        margin: 10,
    },
    scannerBtn: {
        width: 0.35 * wid,
        height: 0.06 * hei,
        borderWidth: 1,
        borderRadius: 20,
        borderColor: '#FFFFFF',
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.6,
        marginBottom: 10,
    },
    qrBtnText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
});

export default MyWalletCreate