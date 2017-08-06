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
import {observer} from 'mobx-react/native';
import Common from "../common/common";
import StateStorage from '../common/stateStore';

const MyWalletAdd = observer(class MyWalletAdd extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            addr: '',
            onClickBox: false,
            TYPE: ['BTC', 'ETH', 'ETC', 'XRP', 'LTC', 'DASH'],
            currentTYPE: 0,
        };
    }

    async componentDidMount(){
        await this.getWalletInfo();
    }

    async getWalletInfo() {
        try {
            const code = StateStorage.walletAddr();
            if (code !== null) {
                await this.setState({addr: code});
            }
            const type = StateStorage.walletType();
            if (type != undefined) {
                await this.setState({currentTYPE: type});
            } else {
                StateStorage.setType(this.state.currentTYPE);
            }
            const name = StateStorage.walletName();
            if (name !== null) {
                await this.setState({name: name});
            }
        } catch (error) {
            alert('지갑 정보 가져오기 실패! : ' + error);
        }
    }

    qrScanner() {
        try {
            StateStorage.setName(this.state.name);
            StateStorage.setType(this.state.currentTYPE);
            Actions.scanner();
        } catch (error) {
            alert("지갑 이름 저장 오류 : " + error);
        }

    }

    setType(i) {
        this.setState({currentTYPE: i, onClickBox: !this.state.onClickBox},()=>{
            StateStorage.setType(this.state.currentTYPE);
        });
    }

    render() {
        return (
            <ScrollView contentContainerStyle={styles.frame}>
                <ScrollView contentContainerStyle={styles.content}>
                    <Text style={styles.explain}>
                        여기서 지갑을 추가해보세요!
                    </Text>
                    <TextInput
                        style={styles.inputName}
                        value={this.state.name}
                        onChangeText={(name) => {
                            this.setState({name: name});
                            StateStorage.setName(name);
                        }}
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
                        onChangeText={(addr) => {
                            this.setState({addr: addr});
                            StateStorage.setAddr(addr);
                        }}
                        placeholder={'지갑 주소'}
                        placeholderTextColor="#FFFFFF"
                        autoCapitalize='none'
                        autoCorrect={false}
                        maxLength={200}
                        multiline={false}
                    />

                    <Text style={styles.explainQRcode}>
                        QR코드 스캐너{'\n'}
                        스캐너 사용시 자잘한 버그는..{'\n'}
                        다음 업데이트에서 ㅎ_ㅎ
                    </Text>
                    <TouchableOpacity
                        style={styles.scannerBtn}
                        underlayColor={'#000000'}
                        onPress={() => this.qrScanner()}
                    >
                        <Text style={styles.qrBtnText}>
                            QR코드 스캐너
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </ScrollView>
        );
    }
});

const dpi = Common.getRatio();
const wid = Common.winWidth();
const hei= Common.winHeight();
const styles = StyleSheet.create({
    frame:{
        flex:1,
    },
    content: {
        alignItems: 'center',
    },
    explain: {
        color: '#FFFFFF',
        opacity: 0.8,
        fontSize: 20*dpi,
        margin: 15*dpi,
    },
    inputName: {
        width: 0.6*wid,
        height: 0.075*hei,
        fontSize: 15*dpi,
        color: '#FFFFFF',
        borderColor: '#FFFFFF',
        borderWidth: 1*dpi,
        borderRadius: 15*dpi,
        alignSelf: 'center',
        backgroundColor: '#000000',
        opacity: 0.3,
        marginBottom: 10*dpi,
        paddingLeft: 15*dpi,
    },
    explain2: {
        color: '#FFFFFF',
        opacity: 0.8,
        fontSize: 15*dpi,
        margin: 15*dpi,
    },
    selectBoxWrapper: {
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000',
        width: 0.6*wid,
        height: 0.065*hei,
        opacity: 0.4,
        borderColor: '#FFFFFF',
        borderWidth: 1*dpi,
        borderRadius: 10*dpi,
        paddingLeft: 17*dpi,
        paddingRight: 15*dpi,
    },
    selectBoxRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    selectBoxText: {
        alignSelf: 'flex-start',
        color: '#FFFFFF',
        fontSize: 17*dpi,
    },
    selectBoxIconWrapper: {
        alignItems: 'flex-end',
    },
    selectIcon: {
        color: '#FFFFFF',
        fontSize: 17*dpi,
        opacity: 0.9,
    },
    inputWalletAddr: {
        width: 0.6*wid,
        height: 0.07*hei,
        fontSize: 13*dpi,
        color: '#FFFFFF',
        borderColor: '#FFFFFF',
        borderWidth: 1*dpi,
        borderRadius: 15*dpi,
        alignSelf: 'center',
        backgroundColor: '#000000',
        opacity: 0.3,
        marginTop: 10*dpi,
        marginBottom: 10*dpi,
        paddingLeft: 15*dpi,
    },
    explainQRcode: {
        textAlign:'center',
        color: '#FFFFFF',
        opacity: 0.8,
        fontSize: 15*dpi,
        margin: 10*dpi,
    },
    scannerBtn: {
        width: 0.4*wid,
        height: 0.06*hei,
        borderWidth: 1*dpi,
        borderRadius: 20*dpi,
        borderColor: '#FFFFFF',
        padding: 5*dpi,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.6,
        marginBottom: 10*dpi,
    },
    qrBtnText:{
        color:'#FFFFFF',
        fontSize:17*dpi,
    },
});

export default MyWalletAdd