/**
 * Created by kusob on 2017. 7. 1..
 */

import React, {Component} from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text, TouchableHighlight,
    View, AsyncStorage
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import Common from "../common/common";

export default class MyWalletMng extends Component {
    constructor(props) {
        super(props);

        this.state = {
            walletList: [],
            email: 'boseokjung@gmail.com',
            load: false,
        };
    }

    async componentWillMount(){
        const wallets = await AsyncStorage.getItem('WalletList');
        this.setState({walletList:JSON.parse(wallets), load:true});
    }

    goTo(id) {
        Actions.main({goTo:'myWalletEdit', id:id});
    }

    render() {
        return (
            <ScrollView contentContainerStyle={styles.frame}>
                {this.state.load == false &&
                <Image
                    source={require('../common/img/loading.gif')}
                    style={styles.loadingIcon}/>
                }
                {(this.state.load == true && this.state.walletList.length == 0) &&
                    <View>
                        <Text style={styles.explain}>
                            아직 지갑이 하나도 없어요!{'\n'}
                            오른쪽 상단 지갑추가 버튼을 누르세요!
                        </Text>
                    </View>
                }
                {(this.state.load == true && this.state.walletList.length != 0) &&
                <View>
                    <Text style={styles.explain}>관리 할 지갑을 선택하세요</Text>
                    {this.state.walletList.map((wallet, i) => {
                        return (
                            <TouchableHighlight
                                style={styles.list}
                                underlayColor={'#000000'}
                                onPress={() => this.goTo(wallet.wallet_Id)}
                                key={i}
                            >
                                <Text style={styles.listText}>
                                    {wallet.wallet_name}
                                </Text>
                            </TouchableHighlight>
                        );
                    })}
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
    loadingIcon: {
        width: 40*dpi,
        height: 40*dpi,
        marginTop: 40*dpi,
    },
    explain: {
        color: '#FFFFFF',
        opacity: 0.8,
        fontSize: 20*dpi,
        margin: 15*dpi,
    },
    list: {
        width: 0.55*wid,
        height: 0.07*hei,
        borderWidth: 1*dpi,
        borderColor: '#FFFFFF',
        borderRadius: 20,
        alignSelf:'center',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.5,
        padding: 15*dpi,
        marginBottom: 5*dpi,
    },
    listText: {
        fontSize: 15*dpi,
        textAlign: 'center',
        color: '#FFFFFF',
    },
});
