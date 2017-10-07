/**
 * Created by kusob on 2017. 7. 7..
 */

import React, { Component } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text, TouchableOpacity,
    View
} from 'react-native';

import Common from "../common/common.js";
import StateStore from '../common/stateStore';
import LoadingIcon from 'react-native-loading-spinner-overlay';
import SelectBox from '../common/selectBox.js';
import PrivateAddr from '../common/private/address.js';

class TradeRecord extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loaded: false,
            success: false,
            list: StateStore.currentMyWalletList(),
            currentWallet: StateStore.currentWallet(),
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
            message: '',
            currentWallet: i,
        }, () => this.getData());
    }

    getData() {
        if (this.state.list.length != 0) { //지갑이 있는경우
            var type = this.state.list[this.state.currentWallet].wallet_type;
            switch (type) {
                case 'BTC':
                    fetch("https://blockchain.info/ko/rawaddr/" + this.state.list[this.state.currentWallet].wallet_add)
                        .then((response) => {
                            if (response.ok) {
                                return response.json();
                            } else {
                                this.setState({ message: '조회 할 수 없습니다' });
                                return false;
                            }
                        }).then((responseJson) => {
                            if (responseJson instanceof Object) {
                                this.setState({
                                    data: responseJson,
                                    success: true
                                });
                            } else { //오류메시지를 받았을때
                                this.setState({ message: '지갑 주소를 확인하세요' });
                            }
                        }).catch((error) => {
                            console.error(error);
                        }).done(() => this.setState({ loaded: true }));
                    break;

                case 'ETH':
                    fetch("http://api.etherscan.io/api?module=account&action=txlist&address=" + this.state.list[this.state.currentWallet].wallet_add + "&startblock=0&endblock=99999999&sort=asc&apikey=YourApiKeyToken")
                        .then((response) => {
                            if (response.ok) {
                                return response.json();
                            } else {
                                this.setState({ message: '조회 할 수 없습니다' });
                                return false;
                            }
                        }).then((responseJson) => {
                            if (responseJson.message == "OK") {
                                this.setState({ data: responseJson.result, success: true });
                            } else { //오류메시지를 받았을때
                                this.setState({ message: '지갑 주소를 확인하세요' });
                            }
                        }).catch((error) => {
                            console.error(error);
                        }).done(() => this.setState({ loaded: true }));
                    break;

                case 'ETC':
                    fetch("https://etcchain.com/api/v1/getTransactionsByAddress?address=" + this.state.list[this.state.currentWallet].wallet_add + "&sort=desc")
                        .then((response) => {
                            if (response.ok) {
                                return response.json();
                            } else {
                                this.setState({ message: '조회 할 수 없습니다' });
                                return false;
                            }
                        }).then((responseJson) => {
                            if (responseJson.error == undefined) {
                                this.setState({ data: responseJson, success: true });
                            } else { //오류메시지를 받았을때
                                this.setState({ message: '지갑 주소를 확인하세요' });
                            }
                        }).catch((error) => {
                            console.error(error);
                        }).done(() => this.setState({ loaded: true }));
                    break;

                case 'XRP':
                    fetch("https://data.ripple.com/v2/accounts/" + this.state.list[this.state.currentWallet].wallet_add + "/transactions?descending=true")
                        .then((response) => {
                            if (response.ok) {
                                return response.json();
                            } else {
                                this.setState({ message: '조회 할 수 없습니다' });
                                return false;
                            }
                        }).then((responseJson) => {
                            if (responseJson.result == "success") {
                                this.setState({ data: responseJson, success: true });
                            } else { //오류메시지를 받았을때
                                this.setState({ message: '지갑 주소를 확인하세요' });
                            }
                        }).catch((error) => {
                            console.error(error);
                        }).done(() => this.setState({ loaded: true }));
                    break;
                case 'BSC':
                    var addr = this.state.list[this.state.currentWallet].wallet_add;
                    fetch(PrivateAddr.getAwsAddr() + "wallet/transactions", {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            address: addr,
                        })
                    }).then((response) => {
                        if (response.ok) {
                            return response.json();
                        } else {
                            this.setState({ message: '조회 할 수 없습니다' });
                            return false;
                        }
                    }).then((responseJson) => {
                        this.setState({ data: responseJson.data, success: true });
                    }).catch((error) => {
                        alert('Network Connection Failed');
                        console.error(error);
                    }).done(() => this.setState({ loaded: true }));
                    break;
                default:
                    this.setState({ message: '현재 ' + type + '은 거래조회를 지원하지 않습니다', loaded: true });
                    break;
            }
        } else { //지갑이 없는경우
            this.setState({ loaded: true });
            return false;
        }
    }

    render() {
        var ioArr = [];
        return (
            <ScrollView contentContainerStyle={styles.frame}>
                {!this.state.loaded &&
                    <LoadingIcon visible={true} />
                }
                <ScrollView contentContainerStyle={styles.content}>
                    {(this.state.list.length == 0) &&
                        <Text style={styles.titleText}>
                            지갑이 한개도 없어요!
                    </Text>
                    }
                    {(this.state.list.length != 0) &&
                        <View>
                            <SelectBox
                                list={this.state.list}
                                currentItem={StateStore.currentWallet()}
                                selectBoxText="wallet_name"
                                onClickBoxFunction={(i) => {
                                    this.showWallet(i)
                                }} />

                            <View style={styles.blank} />
                            <Text style={styles.addr}>
                                {this.state.list[this.state.currentWallet].wallet_add}
                            </Text>
                            <Text style={styles.titleText}>
                                {this.state.message}
                            </Text>
                            {this.state.success &&
                                <View>
                                    {this.state.list[this.state.currentWallet].wallet_type == 'BTC' && //BTC
                                        <View>
                                            <DataInfo
                                                type={this.state.list[this.state.currentWallet].wallet_type}
                                                inputPrice={parseInt(this.state.data.total_received) / 100000000}
                                                outputPrice={parseInt(this.state.data.total_sent) / 100000000}
                                                balance={parseInt(this.state.data.final_balance) / 100000000}
                                                transCount={this.state.data.n_tx}
                                            />
                                            {this.state.data.txs.map((tx, i) => {
                                                var inputsFilteredArr = tx.inputs.filter((input) => {
                                                    return input.prev_out.addr == this.state.list[this.state.currentWallet].wallet_add;
                                                });
                                                if (inputsFilteredArr.length != 0) {
                                                    ioArr.push(parseInt(inputsFilteredArr[0].prev_out.value) / 100000000 + " BTC - 입금");
                                                    {/* ioArr.push("(" + inputsFilteredArr[0].prev_out.addr + ")"); */ }
                                                }
                                                var outFilteredArr = tx.out.filter((o) => {
                                                    return o.addr == this.state.list[this.state.currentWallet].wallet_add;
                                                });
                                                if (outFilteredArr.length != 0) {
                                                    ioArr.push(parseInt(outFilteredArr[0].value) / 100000000 + " BTC - 출금");
                                                    {/* ioArr.push("(" + outFilteredArr[0].addr + ")"); */ }
                                                }
                                            })}
                                            {ioArr.map((io, i) => {
                                                return (
                                                    <View key={i}>
                                                        <Text style={styles.titleText}>
                                                            {io}
                                                        </Text>
                                                    </View>
                                                );
                                            })}
                                        </View>
                                    }
                                    {this.state.list[this.state.currentWallet].wallet_type == 'ETH' && //ETH
                                        <View>
                                            <View style={styles.hr} />
                                            {this.state.data.map((res, i) => {
                                                return (
                                                    <View key={i}>
                                                        <Text style={styles.titleText}>
                                                            {(() => {
                                                                if (this.state.list[this.state.currentWallet].wallet_add == res.from) {
                                                                    return (
                                                                        <Text style={styles.titleText}>
                                                                            {(parseInt(res.value) / 1000000000000000000).toFixed(15)} ETH - 출금
                                                                        </Text>
                                                                    );
                                                                } else {
                                                                    return (
                                                                        <Text style={styles.titleText}>
                                                                            {(parseInt(res.value) / 1000000000000000000).toFixed(15)} ETH - 입금
                                                                        </Text>
                                                                    );
                                                                }
                                                            }
                                                            )()}
                                                        </Text>
                                                    </View>
                                                );
                                            })}
                                        </View>
                                    }
                                    {this.state.list[this.state.currentWallet].wallet_type == 'ETC' && //ETC
                                        <View>
                                            <View style={styles.hr} />
                                            <Text style={styles.titleText}>클릭하시면 상대방 주소를 볼수있습니다!</Text>
                                            {this.state.data.map((etc, i) => {
                                                if (etc.to == this.state.list[this.state.currentWallet].wallet_add) {
                                                    return (
                                                        <TouchableOpacity
                                                            onPress={() => { Common.alert(etc.from) }}
                                                            key={i}
                                                        >
                                                            <Text style={styles.titleText}>
                                                                {etc.valueEther} ETC - 입금
                                                            </Text>
                                                        </TouchableOpacity>
                                                    );
                                                } else {
                                                    return (
                                                        <TouchableOpacity
                                                            onPress={() => { Common.alert(etc.to) }}
                                                            key={i}
                                                        >
                                                            <Text style={styles.titleText}>
                                                                {etc.valueEther} ETC - 출금
                                                            </Text>
                                                        </TouchableOpacity>
                                                    );
                                                }
                                            })}
                                        </View>
                                    }
                                    {this.state.list[this.state.currentWallet].wallet_type == 'XRP' && //XRP
                                        <View>
                                            <View style={styles.hr} />
                                            <Text style={styles.titleText}>클릭하시면 상대방 주소를 볼수있습니다!</Text>
                                            {(() => {
                                                var xrpPaymentArr = this.state.data.transactions.filter((xrp) => {
                                                    return xrp.tx.TransactionType == "Payment";
                                                });
                                                return xrpPaymentArr.map((xrp, i) => {
                                                    if (this.state.list[this.state.currentWallet].wallet_add == xrp.tx.Destination) { //입금내역인경우
                                                        if (Number.isInteger(parseInt(xrp.tx.Amount))) {
                                                            return (
                                                                <TouchableOpacity
                                                                    onPress={() => {
                                                                        Common.alert(xrp.tx.Account);
                                                                    }}
                                                                    key={i}
                                                                >
                                                                    <Text style={styles.titleText}>
                                                                        {parseInt(xrp.tx.Amount) / 10000000} XRP - 입금
                                                                </Text>
                                                                </TouchableOpacity>
                                                            );
                                                        } else {
                                                            return (
                                                                <TouchableOpacity
                                                                    onPress={() => {
                                                                        Common.alert(xrp.tx.Account);
                                                                    }}
                                                                    key={i}
                                                                >
                                                                    <Text style={styles.titleText}>
                                                                        {xrp.tx.Amount.value} {xrp.tx.Amount.currency} - 입금
                                                                    </Text>
                                                                </TouchableOpacity>
                                                            );
                                                        }
                                                    } else { //출금내역인경우
                                                        if (Number.isInteger(parseInt(xrp.tx.Amount))) {
                                                            return (
                                                                <TouchableOpacity
                                                                    onPress={() => {
                                                                        Common.alert(xrp.tx.Destination);
                                                                    }}
                                                                    key={i}
                                                                >
                                                                    <Text style={styles.titleText}>
                                                                        {parseInt(xrp.tx.Amount) / 10000000} XRP - 출금
                                                                    </Text>
                                                                </TouchableOpacity>
                                                            );
                                                        } else {
                                                            return (
                                                                <TouchableOpacity
                                                                    onPress={() => {
                                                                        Common.alert(xrp.tx.Destination);
                                                                    }}
                                                                    key={i}
                                                                >
                                                                    <Text style={styles.titleText}>
                                                                        {xrp.tx.Amount.value} {xrp.tx.Amount.currency} - 출금
                                                                    </Text>
                                                                </TouchableOpacity>
                                                            );
                                                        }
                                                    }
                                                });
                                            }
                                            )()}
                                        </View>
                                    }
                                    {this.state.list[this.state.currentWallet].wallet_type == 'BSC' && //XRP
                                        <View>
                                            <View style={styles.hr} />
                                            {this.state.data.Items.map((item, i) => {
                                                return (
                                                    <View key={i}>
                                                        <Text style={styles.text}>
                                                            날짜 : {item.date}{'\n'}{'\n'}
                                                            수수료 : {item.fee}{'\n'}{'\n'}
                                                            금액 : {item.amount}{'\n'}{'\n'}
                                                            받는주소 : {item.incommingAddress}{'\n'}{'\n'}
                                                            보내는주소 : {item.address}{'\n'}
                                                        </Text>
                                                        <View style={styles.hr} />
                                                    </View>
                                                );
                                            })}
                                        </View>
                                    }
                                </View>
                            }
                        </View>
                    }
                </ScrollView>
            </ScrollView>
        );
    }
}

class DataInfo extends Component {
    render() {
        return (
            <View>
                <Text style={styles.titleText}>
                    총 입금 금액 : {this.props.inputPrice} {this.props.type}{'\n'}
                    총 출금 금액 : {this.props.outputPrice} {this.props.type}{'\n'}
                    잔액 : {this.props.balance} {this.props.type}{'\n'}
                </Text>
                <View style={styles.hr} />
                <Text style={styles.titleText}>
                    거래 횟수 : {this.props.transCount}
                </Text>
            </View>
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
        alignItems: 'center',
    },
    titleText: {
        alignSelf: 'center',
        color: '#FFFFFF',
        fontSize: 17,
        marginBottom: 5,
        opacity: 0.8,
    },
    text: {
        color: '#FFFFFF',
        fontSize: 16,
        opacity: 0.8,
    },
    blank: {
        margin: 5,
    },
    addr: {
        alignSelf: 'center',
        color: '#FFFFFF',
        fontSize: 15,
        opacity: 0.8,
    },
    hr: {
        borderBottomWidth: 1,
        borderColor: '#FFFFFF',
        marginBottom: 7,
        opacity: 0.8,
    },
});

export default TradeRecord