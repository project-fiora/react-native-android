
import React, {Component} from 'react';
import {
    StyleSheet, Alert, AsyncStorage, ScrollView,
    Text, TextInput, TouchableHighlight, View, TouchableOpacity, Image,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import PrivateAddr from "../common/private/address";
import Common from "../common/common";
import LoadingIcon from "../common/loadingIcon";
import StateStore from "../common/stateStore";

export default class MyWalletMng extends Component{

    static removeWallet() {
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
                        AsyncStorage.getItem('Token', (err, result) => {
                            try {
                                if (err != null) {
                                    alert(err);
                                    return false;
                                }
                                const token = JSON.parse(result).token;
                                console.log(token);
                                console.log(StateStore.currentMyWalletId());
                                fetch(PrivateAddr.getAddr() + "wallet/delete?WalletId=" + StateStore.currentMyWalletId(), {
                                    method: 'DELETE', headers: {
                                        "Authorization": token,
                                        "Accept": "*/*",
                                    }
                                })
                                    .then((response) => response.json())
                                    .then((responseJson) => {
                                        if (responseJson.message == "SUCCESS") {
                                            alert("지갑을 삭제했습니다");
                                            //myWallet.state 에서 id가 StateStore.currentMyWalletId()인것을 삭제

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
                                console.error(err)
                            }
                        });
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
}

// /**
//  * Created by kusob on 2017. 7. 1..
//  */
//
// import React, {Component} from 'react';
// import {
//     Image,
//     ScrollView,
//     StyleSheet,
//     Text, TouchableHighlight,
//     View, AsyncStorage
// } from 'react-native';
// import {Actions} from 'react-native-router-flux';
// import Common from "../common/common";
//
// export default class MyWalletMng extends Component {
//     constructor(props) {
//         super(props);
//
//         this.state = {
//             walletList: [],
//             email: 'boseokjung@gmail.com',
//             load: false,
//         };
//     }
//
//     async componentWillMount(){
//         const wallets = await AsyncStorage.getItem('WalletList');
//         this.setState({walletList:JSON.parse(wallets), load:true});
//     }
//
//     goTo(id) {
//         Actions.main({goTo:'myWalletEdit', id:id});
//     }
//
//     render() {
//         return (
//             <ScrollView contentContainerStyle={styles.frame}>
//                 {this.state.load == false &&
//                 <Image
//                     source={require('../common/img/loading.gif')}
//                     style={styles.loadingIcon}/>
//                 }
//                 {(this.state.load == true && this.state.walletList.length == 0) &&
//                     <View>
//                         <Text style={styles.explain}>
//                             아직 지갑이 하나도 없어요!{'\n'}
//                             오른쪽 상단 지갑추가 버튼을 누르세요!
//                         </Text>
//                     </View>
//                 }
//                 {(this.state.load == true && this.state.walletList.length != 0) &&
//                 <View>
//                     <Text style={styles.explain}>관리 할 지갑을 선택하세요</Text>
//                     {this.state.walletList.map((wallet, i) => {
//                         return (
//                             <TouchableHighlight
//                                 style={styles.list}
//                                 underlayColor={'#000000'}
//                                 onPress={() => this.goTo(wallet.wallet_Id)}
//                                 key={i}
//                             >
//                                 <Text style={styles.listText}>
//                                     {wallet.wallet_name}
//                                 </Text>
//                             </TouchableHighlight>
//                         );
//                     })}
//                 </View>
//                 }
//             </ScrollView>
//         );
//     }
// }
//
// const dpi = Common.getRatio();
// const wid = Common.winWidth();
// const hei = Common.winHeight();
// const styles = StyleSheet.create({
//     frame: {
//         alignItems: 'center',
//     },
//     loadingIcon: {
//         width: 40*dpi,
//         height: 40*dpi,
//         marginTop: 40*dpi,
//     },
//     explain: {
//         color: '#FFFFFF',
//         opacity: 0.8,
//         fontSize: 20*dpi,
//         margin: 15*dpi,
//     },
//     list: {
//         width: 0.55*wid,
//         height: 0.07*hei,
//         borderWidth: 1*dpi,
//         borderColor: '#FFFFFF',
//         borderRadius: 20,
//         alignSelf:'center',
//         alignItems: 'center',
//         justifyContent: 'center',
//         opacity: 0.5,
//         padding: 15*dpi,
//         marginBottom: 5*dpi,
//     },
//     listText: {
//         fontSize: 15*dpi,
//         textAlign: 'center',
//         color: '#FFFFFF',
//     },
// });
