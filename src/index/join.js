/**
 * Created by kusob on 2017. 7. 4..
 */

import React, {Component} from 'react';
import {
    Image,
    Text, TextInput, TouchableHighlight,
    View
} from 'react-native';
import CheckBox from 'react-native-checkbox';

import styles from './index_style';
import PrivateAddr from '../common/private/address';

export default class Join extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            disableConfirmEmail: false,
            confirmEmail: false,
            toggleAuth: false,
            userInputAuthCode: '',
            serverAuthCode: '',
            authTimer: 300,
            confirmAuth: false,
            passwd: '',
            passwd2: '',
            name: '',
            agree: false,
            enable: null,
            enableNickname:false,
        };
    }

    componentWillUnmount(){
        clearTimeout();
    }

    join() {//회원가입 POST api call
        this.setState({enable: 'none'});
        if (this.state.confirmAuth) {
            if (this.state.passwd != "" && this.state.passwd2 != "") {
                if (this.state.passwd == this.state.passwd2) {
                    if (this.state.nickname != "") {
                        if (this.state.agree) {
                            fetch(PrivateAddr.getAddr() + 'member/join', {
                                method: 'POST',
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    email: this.state.email,
                                    password: this.state.passwd,
                                    nickname: this.state.name
                                })
                            }).then((response) => {
                                return response.json()
                            })
                                .then((responseJson) => {
                                    if (responseJson.message == "SUCCESS") {
                                        this.goTitle();
                                        alert('회원가입에 성공했습니다!');
                                    } else {
                                        alert('오류가 발생했습니다.\n다시 시도해주세요!');
                                    }
                                })
                                .catch((error) => {
                                    alert('Network Connection Failed');
                                    console.error(error);
                                }).done(()=>this.setState({enable: null}));
                        } else {
                            alert('동의하셔야 가입이 가능합니다!');
                        }
                    } else {
                        alert('닉네임을 입력해주세요');
                    }
                } else {
                    alert('비밀번호가 일치하지 않습니다!');
                }
            } else {
                alert('비밀번호를 입력해주세요');
            }
        } else {
            alert('이메일 인증을 해주세요!');
        }
        this.setState({enable: null});
    }

    goTitle() {
        return this.props.goTitlePage();
    }

    confirmEmail(email) {
        this.setState({disableConfirmEmail: true, enable: 'none'});
        fetch(PrivateAddr.getAddr() + "member?email=" + email)
            .then((response) => {
                return response.json()
            })
            .then((responseJson) => {
                var re = /^[a-z][a-zA-Z0-9_.]*(\.[a-zA-Z][a-zA-Z0-9_.]*)?@[a-z][a-zA-Z-0-9]*\.[a-z]+(\.[a-z]+)?$/;
                if (this.state.email == '') {
                    alert('이메일을 입력해주세요');
                    this.setState({disableConfirmEmail: false});
                } else if (!re.test(this.state.email)) {
                    alert('이메일 형식을 맞춰주세요');
                    this.setState({disableConfirmEmail: false});
                } else {
                    if (responseJson.email == this.state.email) {
                        alert("이메일 중복입니다!");
                        this.setState({disableConfirmEmail: false});
                    } else {
                        alert('사용 가능한 이메일 주소입니다!');
                        this.setState({confirmEmail: true});
                    }
                }
            })
            .catch((error) => {
                alert('Network Connection Failed');
                console.error(error);
            }).done(() => this.setState({enable: null}));
    }

    timer() {
        setTimeout(
            () => {
                if (this.state.authTimer > 0) {
                    this.setState({authTimer: this.state.authTimer - 1})
                } else {
                    //타임아웃
                    alert('시간 초과입니다\n다시 시도해주세요!\n메인으로 이동합니다');
                    this.goTitle();
                }
            }, 1000
        );
        return this.toMinSec(this.state.authTimer);
    }

    toMinSec(t) {
        var min;
        var sec;
        // 정수로부터 남은 시, 분, 초 단위 계산

        min = Math.floor(t / 60);
        sec = t - (min * 60);

        // hh:mm:ss 형태를 유지하기 위해 한자리 수일 때 0 추가
        if (min < 10) min = "0" + min;
        if (sec < 10) sec = "0" + sec;
        return (min + ":" + sec);
    }

    getAuthCode(email) { //인증번호 발송, 인증번호 서버에서 받아서 state에 저장
        alert('이메일로 인증코드를 발송했습니다.');
        this.setState({toggleAuth: true});
        fetch(PrivateAddr.getAddr() + "member/auth?email=" + email)
            .then((response) => {
                return response.json()
            })
            .then((responseJson) => {
                this.setState({serverAuthCode: responseJson.code});
            })
            .catch((error) => {
                alert('Network Connection Failed');
                console.error(error);
            });
    }

    authCodeMatching(userInputAuthCode) {
        if (userInputAuthCode == this.state.serverAuthCode) {
            alert('이메일 인증 완료!');
            this.setState({confirmAuth: true});
        } else {
            alert('인증번호를 확인해주세요!');
        }
    }

    checkNickname(){
        // GET /api/member/checknickname
        this.setState({enable: 'none'});
        fetch(PrivateAddr.getAddr() + "member/checknickname?nickname=" + this.state.nickname)
            .then((response) => {
                return response.json()
            })
            .then((responseJson) => {
                if(responseJson.message=="SUCCESS" && (this.state.nickname!="")){
                    alert("사용 가능한 닉네임 입니다!");
                    this.setState({enableNickname:true});
                } else {
                    alert("사용할 수 없는 닉네임 입니다!");
                    return false;
                }
            })
            .catch((error) => {
                alert('Network Connection Failed');
                console.error(error);
            }).done(() => this.setState({enable: null}));
    }

    render() {
        return (
            <View pointerEvents={this.state.enable} style={styles.loginContainer}>
                {this.state.enable == 'none' &&
                <Image
                    source={require('../common/img/loading.gif')}
                    style={styles.loadingIcon}/>
                }
                <View style={styles.inputWrapper}>
                    <Image source={require('../common/img/user.png')} style={styles.inputTextIcon}/>
                    <TextInput
                        style={styles.input}
                        value={this.state.email}
                        onChangeText={(email) => this.setState({email: email})}
                        keyboardType='email-address'
                        placeholder={'이메일 주소'}
                        placeholderTextColor="#FFFFFF"
                        autoCapitalize='none'
                        maxLength={40}
                        multiline={false}
                        autoFocus={true}
                        autoCorrect={false}
                        editable={!this.state.confirmEmail}
                    />
                </View>

                {this.state.confirmEmail == false &&
                <TouchableHighlight
                    style={styles.authBtn}
                    underlayColor={'#000000'}
                    onPress={() => this.confirmEmail(this.state.email)}
                    disabled={this.state.disableConfirmEmail}
                >
                    <Text style={styles.label}>이메일 중복확인</Text>
                </TouchableHighlight>
                }
                {(this.state.toggleAuth == false && this.state.confirmAuth == false
                    && this.state.confirmEmail == true) &&
                <TouchableHighlight
                    style={styles.authBtn}
                    underlayColor={'#000000'}
                    onPress={() => this.getAuthCode(this.state.email)}

                >
                    <Text style={styles.label}>인증번호 발송</Text>
                </TouchableHighlight>
                }

                {(this.state.toggleAuth == true && this.state.confirmAuth == false) &&
                <View style={styles.loginContainer}>
                    <View style={styles.inputWrapper}>
                        <Image source={require('../common/img/passwd.png')} style={styles.inputTextIcon}/>
                        <TextInput
                            style={styles.input}
                            value={this.state.authKey}
                            onChangeText={(key) => this.setState({userInputAuthCode: key})}
                            placeholder={'인증번호 (' + this.timer() + ')'}
                            placeholderTextColor="#FFFFFF"
                            maxLength={6}
                            multiline={false}
                            autoCapitalize='none'
                            keyboardType='numeric'
                        />
                    </View>
                    <TouchableHighlight
                        style={styles.authBtn}
                        underlayColor={'#000000'}
                        onPress={() => this.authCodeMatching(this.state.userInputAuthCode)}
                    >
                        <Text style={styles.authLabel}>인증</Text>
                    </TouchableHighlight>
                </View>
                }

                <View style={styles.inputWrapper}>
                    <Image source={require('../common/img/passwd.png')} style={styles.inputTextIcon}/>
                    <TextInput
                        style={styles.input}
                        value={this.state.passwd}
                        onChangeText={(pw) => this.setState({passwd: pw})}
                        placeholder={'비밀번호'}
                        placeholderTextColor="#FFFFFF"
                        secureTextEntry={true}
                        maxLength={20}
                        multiline={false}
                    />
                </View>

                <View style={styles.inputWrapper}>
                    <Image source={require('../common/img/passwd.png')} style={styles.inputTextIcon}/>
                    <TextInput
                        style={styles.input}
                        value={this.state.passwd2}
                        onChangeText={(pw) => this.setState({passwd2: pw})}
                        placeholder={'비밀번호 재입력'}
                        placeholderTextColor="#FFFFFF"
                        secureTextEntry={true}
                        maxLength={20}
                        multiline={false}
                    />
                </View>

                <View style={styles.inputWrapper}>
                    <Image source={require('../common/img/user.png')} style={styles.inputTextIcon}/>
                    <TextInput
                        style={styles.input}
                        value={this.state.name}
                        onChangeText={(name) => this.setState({name: name})}
                        placeholder={'이름 혹은 닉네임'}
                        placeholderTextColor="#FFFFFF"
                        maxLength={10}
                        autoCapitalize='none'
                        multiline={false}
                        autoCorrect={false}
                    />
                </View>
                <TouchableHighlight
                    style={styles.authBtn}
                    underlayColor={'#000000'}
                    onPress={() => this.checkNickname()}
                >
                    <Text style={styles.authLabel}>닉네임 중복검사</Text>
                </TouchableHighlight>
                <Text style={styles.agreeText}>
                    ** 이 앱을 사용하는 도중에 발생하는{'\n'}모든 책임은 사용자 본인에게 있습니다 **
                </Text>
                <CheckBox
                    containerStyle={{width: 90, marginTop: 10, marginBottom: 10}}
                    label="동의합니다"
                    labelStyle={{opacity: 0.7, color: '#FFFFFF', fontSize: 15,}}
                    checkboxStyle={{opacity: 0.7, width: 15, height: 15}}
                    checkedImage={require('../common/img/check.png')}
                    uncheckedImage={require('../common/img/un.png')}
                    underlayColor="transparent"
                    onChange={() => this.setState({agree: !this.state.agree})}
                />

                <TouchableHighlight
                    style={styles.button}
                    underlayColor={'#FFFFFF'}
                    onPress={() => this.join()}
                >
                    <Text style={styles.label}>JOIN</Text>
                </TouchableHighlight>

                <TouchableHighlight
                    style={styles.button}
                    underlayColor={'#FFFFFF'}
                    onPress={() => this.goTitle()}

                >
                    <Text style={styles.label}>CANCEL</Text>
                </TouchableHighlight>
            </View>
        );
    }
}
