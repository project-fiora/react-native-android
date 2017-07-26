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
import PrivateAddr from "../common/private/address";

export default class MyWalletAdd extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            addr: '',
            onClickBox: false,
            TYPE: ['BTC', 'ETH', 'ETC', 'XRP', 'LTC', 'DASH'],
            currentTYPE: 0,
        };
        this.setToken();
        this.getWalletInfo();
    }

    async setToken() {
        try {
            const token = await AsyncStorage.getItem('Token');
            if (token !== null) {
                this.setState({token: token});
            }
        } catch (err) {
            alert('토큰 정보 가져오기 실패! : ' + err);
        }
    }

    async getWalletInfo() {
        try {
            const code = await AsyncStorage.getItem('walletAddQrcodeTmp');
            if (code !== null) {
                this.setState({addr: code});
            }
            const name = await AsyncStorage.getItem('walletAddNameTmp');
            if (name !== null) {
                this.setState({name: name});
            }
        } catch (error) {
            alert('지갑 정보 가져오기 실패! : ' + error);
        }
    }

    async qrScanner() {
        try {
            await AsyncStorage.setItem('walletAddNameTmp', this.state.name);
            Actions.scanner();
        } catch (error) {
            alert("지갑 이름 저장 오류 : " + error);
        }

    }

    async addWallet() {
        const token = JSON.parse(this.state.token).token;
        if (this.state.name == "") {
            alert("지갑 이름을 입력하세요!");
            return false;
        } else if (this.state.addr == "") {
            alert("지갑 주소를 입력하세요!");
            return false;
        } else {
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
                        walletName: this.state.name,
                        walletAddr: this.state.addr,
                        walletType: this.state.TYPE[this.state.currentTYPE],
                    })
                }).then((response) => {
                    return response.json()
                }).then((responseJson) => {
                    if (responseJson.message == "SUCCESS") {
                        alert('지갑을 추가했습니다!');
                        Actions.main({goTo: 'myWallet'});
                    } else {
                        alert('오류가 발생했습니다.\n다시 시도해주세요!');
                    }
                })
                    .catch((error) => {
                        alert('Network Connection Failed');
                        console.error(error);
                    }).done();
                await AsyncStorage.multiRemove(['walletAddNameTmp', 'walletAddQrcodeTmp']);
                Actions.main({goTo: 'myWallet'});
            } catch (err) {
                alert('지갑추가실패 : ' + err);
            }
        }
    }

    setType(i) {
        this.setState({currentTYPE: i, onClickBox: !this.state.onClickBox});
    }

    render() {
        return (
            <View>
                <ScrollView contentContainerStyle={styles.frame}>
                    <Text style={styles.explain}>여기서 지갑을 추가해보세요!</Text>
                    <TextInput
                        style={styles.inputId}
                        value={this.state.name}
                        onChangeText={(name) => this.setState({name: name})}
                        placeholder={'지갑 이름'}
                        placeholderTextColor="#FFFFFF"
                        autoCapitalize='none'
                        autoCorrect={false}
                        maxLength={20}
                        multiline={false}
                    />
                    {/*////////////////////////////////////////////////////////////////////////////////*/}
                    <Text style={styles.explain2}>아래 버튼을 눌러서 지갑 유형을 선택하세요!</Text>
                    <TouchableOpacity
                        underlayColor={'#AAAAAA'}
                        onPress={() => this.setState({onClickBox: !this.state.onClickBox})}
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
                    {/*////////////////////////////////////////////////////////////////////////////////*/}
                    <Text style={styles.explain2}>
                        순수한 지갑 주소만 입력해주세요{'\n'}
                        예)0x6b83f808fce08f51adb2e9e
                    </Text>
                    <TextInput
                        style={styles.inputWalletAddr}
                        value={this.state.addr}
                        onChangeText={(addr) => this.setState({addr: addr})}
                        placeholder={'지갑 주소'}
                        placeholderTextColor="#FFFFFF"
                        autoCapitalize='none'
                        autoCorrect={false}
                        maxLength={200}
                        multiline={false}
                    />

                    <Text style={styles.explainQRcode}>QR코드를 스캔해서 편하게 지갑주소를 입력하세요!</Text>
                    <TouchableOpacity
                        style={styles.scannerBtn}
                        underlayColor={'#000000'}
                        onPress={() => this.qrScanner()}
                    >
                        <Text style={styles.rightBtnText}>
                            QR코드 스캐너
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
                <TouchableOpacity
                    style={styles.rightBtn}
                    underlayColor={'#000000'}
                    onPress={() => this.addWallet()}
                >
                    <Text style={styles.rightBtnText}>저장</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    frame: {
        alignItems: 'center',
        paddingBottom: 85,
    },
    explain: {
        color: '#FFFFFF',
        opacity: 0.8,
        fontSize: 20,
        margin: 15,
    },
    inputId: {
        width: 230,
        height: 50,
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
    selectBoxWrapper: {
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000',
        width: 230,
        height: 35,
        opacity: 0.4,
        borderColor: '#FFFFFF',
        borderWidth: 1,
        borderRadius: 10,
        paddingLeft: 17,
        paddingRight: 15,
    },
    selectBoxRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    selectBoxText: {
        alignSelf: 'flex-start',
        color: '#FFFFFF',
        fontSize: 17,
    },
    selectBoxIconWrapper: {
        alignItems: 'flex-end',
    },
    selectIcon: {
        color: '#FFFFFF',
        fontSize: 17,
        opacity: 0.9,
    },
    inputWalletAddr: {
        width: 230,
        height: 45,
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
        color: '#FFFFFF',
        opacity: 0.8,
        fontSize: 15,
        margin: 10,
    },
    scannerBtn: {
        width: 150,
        height: 40,
        borderWidth: 1,
        borderRadius: 20,
        borderColor: '#FFFFFF',
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.6,
        marginBottom: 10,
    },
    rightBtn: {
        position: 'absolute',
        top: -45,
        right: 15,
        width: 80,
        height: 30,
        borderWidth: 1,
        borderRadius: 20,
        borderColor: '#FFFFFF',
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.6
    },
    rightBtnText: {
        color: '#FFFFFF',
        fontSize: 15
    },
});
