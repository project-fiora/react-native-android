/**
 * Created by kusob on 2017. 7. 7..
 */

import React, {Component} from 'react';
import {
    StyleSheet, Alert, AsyncStorage, ScrollView,
    Text, TextInput, TouchableHighlight, View, TouchableOpacity, Image,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import PrivateAddr from "../common/private/address";

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
        this.getToken();
    }

    componentDidMount() {
        this.getMyWallet();
    }

    async getToken() {
        const tokens = await AsyncStorage.getItem('Token');
        this.setState({token: JSON.parse(tokens).token});
    }

    async getMyWallet() {
        fetch(PrivateAddr.getAddr() + "wallet/info?WalletId=" + this.props.id, {
            method: 'GET', headers: {
                "Authorization": this.state.token,
                "Accept": "*/*",
            }
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.message == "SUCCESS") {
                    const type = responseJson.wallet.wallet_type;
                    for (var i = 0; i < this.state.TYPE.length; i++) {
                        if (this.state.TYPE[i] == type) {
                            this.setState({
                                wallet: responseJson.wallet,
                                id: responseJson.wallet.wallet_Id,
                                name: responseJson.wallet.wallet_name,
                                addr: responseJson.wallet.wallet_add,
                                currentTYPE: i,
                                load: true
                            });
                        }
                    }


                } else {
                    alert("지갑정보를 가져올 수 없습니다");
                    return false;
                }
            })
            .catch((error) => {
                console.error(error);
            });
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
                        Actions.main({goTo: 'myWallet'});
                    } catch (err) {
                        alert('삭제실패 ' + err);
                        return false;
                    }
                }
                },
            ],
            {cancelable: false}
        )
    }

    editWallet() {
        if (this.state.name == "") {
            alert('지갑 이름을 입력하세요!');
            return false;
        } else if (this.state.addr == "") {
            alert('지갑 주소를 입력하세요!');
            return false;
        } else {
            try {
                fetch(PrivateAddr.getAddr() + 'wallet/edit', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': this.state.token
                    },
                    body: JSON.stringify({
                        walletId: this.props.id,
                        walletName: this.state.name,
                        walletAddr: this.state.addr,
                        walletType: this.state.TYPE[this.state.currentTYPE],
                    })
                }).then((response) => {
                    return response.json()
                })
                    .then((responseJson) => {
                        if (responseJson.message == "SUCCESS") {
                            alert('지갑 수정 성공!');
                            Actions.main({goTo: 'myWallet'});
                        } else {
                            alert('오류가 발생했습니다.\n다시 시도해주세요!');
                        }
                    })
                    .catch((error) => {
                        alert('Network Connection Failed');
                        console.error(error);
                    }).done();

            } catch (err) {
                alert('수정실패 ' + err);
                return false;
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
                    {this.state.load == false &&
                    <Image
                        source={require('../common/img/loading.gif')}
                        style={styles.loadingIcon}/>
                    }
                    {this.state.load == true &&
                    <View>
                        <Text style={styles.explain}>여기에서 지갑 정보를 수정해보세요!</Text>
                        <TextInput
                            style={styles.inputWalletName}
                            value={this.state.name}
                            onChangeText={(name) => this.setState({name: name})}
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
                        {/*-------------SELECT BOX END---------------*/}
                        <TextInput
                            style={styles.inputWalletAddr}
                            value={this.state.addr}
                            onChangeText={(addr) => this.setState({addr: addr})}
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
                            <Text style={styles.rightBtnText}>지갑 삭제</Text>
                        </TouchableHighlight>
                    </View>
                    }
                </ScrollView>
                <TouchableHighlight
                    style={styles.rightBtn}
                    underlayColor={'#000000'}
                    onPress={() => this.editWallet()}
                >
                    <Text style={styles.rightBtnText}>저장</Text>
                </TouchableHighlight>
            </View>
        );
    }
}

// return(
//     <TextInput
//         style={{borderWidth:1, borderColor:'#000000',height:80,marginBottom:20,}}
//         value={this.state.walletList[i].name}
//         onChangeText={(name) => {
//             var stateCopy = Object.assign({}, this.state);
//             stateCopy.walletList = stateCopy.walletList.slice();
//             stateCopy.walletList[i] = Object.assign({}, stateCopy.walletList[i]);
//             stateCopy.walletList[i].name = name;
//             this.setState(stateCopy);
//             }
//         }
//         key={i}
//     />
// );

const styles = StyleSheet.create({
    loadingIcon: {
        width: 40,
        height: 40,
        alignSelf: 'center',
        marginTop: 40,
    },
    frame: {
        alignItems: 'center',
        paddingBottom: 85,
    },
    explain: {
        color: '#FFFFFF',
        opacity: 0.8,
        fontSize: 15,
        margin: 15,
    },
    inputWalletName: {
        width: 220,
        height: 50,
        fontSize: 15,
        color: '#FFFFFF',
        borderColor: '#FFFFFF',
        borderWidth: 1,
        borderRadius: 15,
        alignSelf: 'center',
        backgroundColor: '#000000',
        opacity: 0.3,
        marginBottom: 5,
        paddingLeft: 20,
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
        width: 220,
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
        width: 320,
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
        marginBottom: 5,
        paddingLeft: 12,
    },
    removeBtn: {
        width: 80,
        height: 30,
        borderWidth: 1,
        borderRadius: 20,
        borderColor: '#FFFFFF',
        padding: 5,
        alignSelf:'center',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.6
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