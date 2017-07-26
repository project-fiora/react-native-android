/**
 * Created by kusob on 2017. 6. 26..
 */
import React, {Component} from 'react';
import {
    ScrollView,
    StyleSheet,
    Text, TouchableOpacity,
    View, Image, AsyncStorage
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import PrivateAddr from "../common/private/address";
import Common from "../common/common";
import WalletInfo from "../common/walletInfo";

export default class MyWallet extends Component {
    constructor(props) {
        super(props);

        this.state = {
            walletList: [],
            email: 'boseokjung@gmail.com',
            qrcode: '',
            load: false,
            onClickBox: false,
            currentWallet: 0,
            balance: '조회 중..',
        };
    }

    componentDidMount() {
        this.getMyWallet();
    }

    goTo(part) {
        Actions.main({goTo: part});
    }

    async getMyWallet() {
        await AsyncStorage.getItem('Token', (err,result) => {
            if(err!=null){
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
                        if (list.length == 0) {
                            this.setState({walletList: [], load: true});
                        } else {
                            Promise.resolve()
                                .then(() => Common.getBalance(list[this.state.currentWallet].wallet_type,
                                    list[this.state.currentWallet].wallet_add))
                                .then(result => {
                                    var balance;
                                    if (Number.isInteger(result)) {
                                        balance = (parseInt(result) / 100000000) + " " + list[this.state.currentWallet].wallet_type;
                                    } else {
                                        balance = result;
                                    }
                                    this.setState({walletList: list, balance: balance, load: true},
                                        () => AsyncStorage.setItem('WalletList', JSON.stringify(this.state.walletList)));
                                });
                        }
                    } else {
                        alert("지갑정보를 가져올 수 없습니다");
                        return false;
                    }
                })
                .catch((error) => {
                    console.error(error);
                })
                .done();
        });
    }

    showWallet(i, type, addr) {
        this.setState({load: false}, () =>
            Promise.resolve()
                .then(() => Common.getBalance(type, addr))
                .then(result => {
                    console.log('show wallet ok');
                    console.log(result);
                    var balance;
                    if (Number.isInteger(result)) {
                        balance = (parseInt(result) / 100000000) + " " + type;
                    } else {
                        balance = result;
                    }
                    this.setState({balance: balance, currentWallet: i, onClickBox: !this.state.onClickBox, load: true});
                })
        );
    }

    render() {
        return (
            <ScrollView contentContainerStyle={styles.frame}>
                <View style={styles.content}>
                    {this.state.load == false &&
                    <View>
                        <Image
                            source={require('../common/img/loading.gif')}
                            style={styles.loadingIcon}/>
                    </View>
                    }
                    {(this.state.load == true && this.state.walletList.length == 0) &&
                    <View>
                        <Text style={styles.titleText}>
                            아직 지갑이 한개도 없어요!{'\n'}
                            오른쪽 상단의 지갑 관리 버튼을 통해서{'\n'}
                            지갑을 추가하세요!
                        </Text>
                    </View>
                    }
                    {(this.state.load == true && this.state.walletList.length != 0) &&
                    <View>
                        <Text style={styles.titleText}>아래 버튼을 눌러서 지갑을 선택하세요!</Text>
                        <TouchableOpacity
                            underlayColor={'#AAAAAA'}
                            onPress={() => this.setState({onClickBox: !this.state.onClickBox})}
                        >
                            <View style={styles.selectBoxWrapper}>
                                <View style={styles.selectBoxRow}>
                                    <Text style={styles.selectBoxText}>
                                        {this.state.walletList[this.state.currentWallet].wallet_name}
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
                                return this.state.walletList.map((wallet, i) => {
                                    if (this.state.currentWallet != i)
                                        return (
                                            <TouchableOpacity
                                                underlayColor={'#AAAAAA'}
                                                onPress={() => this.showWallet(i, wallet.wallet_type, wallet.wallet_add)}
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
                        {this.state.walletList.length != 0 &&
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
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    frame: {
        paddingBottom: 85,
        paddingTop: 15,
        paddingLeft: 20,
        paddingRight: 20,
    },
    content: {
        marginTop: 5,
        opacity: 0.8,
    },
    contentText: {
        color: '#FFFFFF',
        fontSize: 17,
        marginTop: 10,
        opacity: 0.8,
        marginBottom: 5,
        alignSelf: 'flex-start',
    },
    loadingIcon: {
        width: 30,
        height: 30,
        marginTop: 30,
        alignSelf: 'center',
    },
    titleText: {
        alignSelf: 'center',
        color: '#FFFFFF',
        fontSize: 17,
        marginBottom: 10,
        opacity: 0.8,
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
    qrCode: {
        marginTop: 5,
        width: 100,
        height: 100,
    },
});
