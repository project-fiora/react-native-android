/**
 * Created by kusob on 2017. 7. 4..
 */

import React, { Component } from 'react';
import {
    Image, Alert,
    Text, TextInput, TouchableHighlight,
    View, ScrollView, TouchableOpacity, WebView
} from 'react-native';

import styles from './index_style';
import PrivateAddr from '../common/private/address';
import Encrypt2 from '../common/private/encrypt2';
import Common from "../common/common";
import LoadingIcon from "../common/loadingIcon";

export default class Join extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            email: '',
            disableConfirmEmail: false,
            confirmEmail: false,
            toggleAuth: false,
            userInputAuthCode: '',
            serverAuthCode: '',
            authTimer: 600,
            confirmAuth: false,
            passwd: '',
            passwd2: '',
            nickname: '',
            policy: false,
            showPolicy: false,
            agree: false,
            enable: null,
            enableNickname: false,
        };
    }

    componentWillUnmount() {
        clearTimeout();
    }

    join() {//회원가입 POST api call
        fetch(PrivateAddr.getAddr() + 'member/join', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: this.state.email,
                password: Encrypt2.encryptPasswd(this.state.passwd),
                nickname: this.state.nickname
            })
        }).then((response) => {
            return response.json()
        }).then((responseJson) => {
            if (responseJson.message == "SUCCESS") {
                this.goTitle();
                alert('회원가입에 성공했습니다!');
            } else {
                alert('오류가 발생했습니다.\n다시 시도해주세요!');
                this.setState({ loading: false });
            }
        }).catch((error) => {
            alert('Network Connection Failed');
            this.setState({ loading: false });
            console.error(error);
        }).done();
    }

    goTitle() {
        return this.props.goTitlePage();
    }

    confirmEmail(email) {
        this.setState({ disableConfirmEmail: true, enable: 'none' });
        fetch(PrivateAddr.getAddr() + "member?email=" + email)
            .then((response) => {
                return response.json()
            })
            .then((responseJson) => {
                var re = /^[a-z][a-zA-Z0-9_.]*(\.[a-zA-Z][a-zA-Z0-9_.]*)?@[a-z][a-zA-Z-0-9]*\.[a-z]+(\.[a-z]+)?$/;
                if (this.state.email == '') {
                    alert('이메일을 입력해주세요');
                    this.setState({ disableConfirmEmail: false });
                } else if (!re.test(this.state.email)) {
                    alert('이메일 형식을 맞춰주세요');
                    this.setState({ disableConfirmEmail: false });
                } else {
                    if (responseJson.email == this.state.email) {
                        alert("이메일 중복입니다!");
                        this.setState({ disableConfirmEmail: false });
                    } else {
                        alert('사용 가능한 이메일 주소입니다!');
                        this.setState({ confirmEmail: true });
                    }
                }
            })
            .catch((error) => {
                alert('Network Connection Failed');
                console.error(error);
            }).done(() => this.setState({ enable: null }));
    }

    timer() {
        setTimeout(
            () => {
                if (this.state.authTimer > 0) {
                    this.setState({ authTimer: this.state.authTimer - 1 })
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
        this.setState({ toggleAuth: true });
        fetch(PrivateAddr.getAddr() + "member/auth?email=" + email)
            .then((response) => {
                return response.json()
            })
            .then((responseJson) => {
                this.setState({ serverAuthCode: responseJson.code });
            })
            .catch((error) => {
                alert('Network Connection Failed');
                console.error(error);
            });
    }

    authCodeMatching(userInputAuthCode) {
        if (userInputAuthCode == this.state.serverAuthCode) {
            alert('이메일 인증 완료!');
            this.setState({ confirmAuth: true });
        } else {
            alert('인증번호를 확인해주세요!');
        }
    }

    checkNickname() {
        // GET /api/member/checknickname
        this.setState({ enable: 'none' });
        fetch(PrivateAddr.getAddr() + "member/checknickname?nickname=" + this.state.nickname)
            .then((response) => {
                return response.json()
            })
            .then((responseJson) => {
                if (responseJson.message == "SUCCESS" && (this.state.nickname != "")) {
                    alert("사용 가능한 닉네임 입니다!");
                    this.setState({ enableNickname: true });
                } else {
                    alert("사용할 수 없는 닉네임 입니다!");
                    return false;
                }
            })
            .catch((error) => {
                alert('Network Connection Failed');
                console.error(error);
            }).done(() => this.setState({ enable: null }));
    }

    render() {
        const dpi = Common.getRatio();
        return (
            <View>
                <ScrollView contentContainerStyle={styles.loginContainer}>
                    {(this.state.enable == 'none' || this.state.loading) &&
                        <LoadingIcon />
                    }
                    <View style={styles.inputWrapper}>
                        <Image source={require('../common/img/user.png')} style={styles.inputTextIcon} />
                        <TextInput
                            style={styles.input}
                            value={this.state.email}
                            onChangeText={(email) => this.setState({ email: email })}
                            keyboardType='email-address'
                            placeholder={'이메일 주소'}
                            placeholderTextColor="#FFFFFF"
                            autoCapitalize='none'
                            maxLength={40}
                            multiline={false}
                            autoFocus={true}
                            autoCorrect={false}
                            editable={!this.state.toggleAuth}
                        />
                    </View>

                    {this.state.confirmEmail == false &&
                        <TouchableOpacity
                            style={styles.authBtn}
                            onPress={() => this.confirmEmail(this.state.email)}
                            disabled={this.state.disableConfirmEmail}
                        >
                            <Text style={styles.label}>이메일 중복확인</Text>
                        </TouchableOpacity>
                    }
                    {(this.state.toggleAuth == false && this.state.confirmAuth == false
                        && this.state.confirmEmail == true) &&
                        <TouchableOpacity
                            style={styles.authBtn}
                            onPress={() => this.getAuthCode(this.state.email)}

                        >
                            <Text style={styles.label}>인증번호 발송</Text>
                        </TouchableOpacity>
                    }

                    {(this.state.toggleAuth == true && this.state.confirmAuth == false) &&
                        <View style={styles.loginContainer}>
                            <View style={styles.inputWrapper}>
                                <Image source={require('../common/img/passwd.png')} style={styles.inputTextIcon} />
                                <TextInput
                                    style={styles.input}
                                    value={this.state.authKey}
                                    onChangeText={(key) => this.setState({ userInputAuthCode: key })}
                                    placeholder={'인증번호 (' + this.timer() + ')'}
                                    placeholderTextColor="#FFFFFF"
                                    maxLength={6}
                                    multiline={false}
                                    autoCapitalize='none'
                                    keyboardType='numeric'
                                />
                            </View>
                            <TouchableOpacity
                                style={styles.authBtn}
                                onPress={() => this.authCodeMatching(this.state.userInputAuthCode)}
                            >
                                <Text style={styles.authLabel}>인증</Text>
                            </TouchableOpacity>
                        </View>
                    }

                    <View style={styles.inputWrapper}>
                        <Image source={require('../common/img/passwd.png')} style={styles.inputTextIcon} />
                        <TextInput
                            style={styles.input}
                            value={this.state.passwd}
                            onChangeText={(pw) => this.setState({ passwd: pw })}
                            placeholder={'비밀번호'}
                            placeholderTextColor="#FFFFFF"
                            secureTextEntry={true}
                            maxLength={20}
                            multiline={false}
                        />
                    </View>

                    <View style={styles.inputWrapper}>
                        <Image source={require('../common/img/passwd.png')} style={styles.inputTextIcon} />
                        <TextInput
                            style={styles.input}
                            value={this.state.passwd2}
                            onChangeText={(pw) => this.setState({ passwd2: pw })}
                            placeholder={'비밀번호 재입력'}
                            placeholderTextColor="#FFFFFF"
                            secureTextEntry={true}
                            maxLength={20}
                            multiline={false}
                        />
                    </View>
                    {!this.state.enableNickname &&
                        <View>
                            <View style={styles.inputWrapper}>
                                <Image source={require('../common/img/user.png')} style={styles.inputTextIcon} />
                                <TextInput
                                    style={styles.input}
                                    value={this.state.nickname}
                                    onChangeText={(name) => this.setState({ nickname: name })}
                                    placeholder={'이름 혹은 닉네임'}
                                    placeholderTextColor="#FFFFFF"
                                    maxLength={10}
                                    autoCapitalize='none'
                                    multiline={false}
                                    autoCorrect={false}
                                />
                            </View>
                            <TouchableOpacity
                                style={styles.authBtn}
                                onPress={() => this.checkNickname()}
                            >
                                <Text style={styles.authLabel}>닉네임 중복검사</Text>
                            </TouchableOpacity>
                        </View>
                    }
                    {this.state.enableNickname &&
                        <View style={styles.inputWrapper}>
                            <Image source={require('../common/img/user.png')} style={styles.inputTextIcon} />
                            <TextInput
                                style={styles.input}
                                value={this.state.nickname}
                                onChangeText={(name) => this.setState({ nickname: name })}
                                placeholder={'이름 혹은 닉네임'}
                                placeholderTextColor="#FFFFFF"
                                maxLength={10}
                                autoCapitalize='none'
                                multiline={false}
                                autoCorrect={false}
                                editable={false}
                            />
                        </View>
                    }

                    {!this.state.agree &&
                        <View>
                            <Text style={styles.agreeText}>
                                ** 이 앱을 사용하는 도중에 발생하는{'\n'}모든 책임은 사용자 본인에게 있습니다 **{'\n'}
                                또한, 개인정보처리방침에 동의합니다
                            </Text>
                            <TouchableOpacity
                                onPress={() => {
                                    Alert.alert(
                                        '경고!',
                                        "개인정보처리방침\n\
                                \n\
 1. 이용자의 개인정보를 매우 중요하게 생각하며 각별히 주의를 기울여 처리하고 있습니다.\n\
 특히 최신 암호화 기술(예: HTTPS 연결 사용)을 사용하여 전송하는 등 사용자 데이터를 안전하게 처리합니다\n\
다음과 같은 목적외에는 사용하지 않습니다.\n\
- 사용자의 이메일 : 사용자 1명당 아이디 1개를 위한 인증용도,\n\
- 사용자의 비밀번호 : 단순 로그인을 위한 암호. AES-128을 사용하여 암호화. 로그인외에는 사용하지 않습니다\n\
- 사용자 디바이스의 카메라 : QR코드 스캐너를 이용하기위한 카메라 사용 외에는 사용하지 않습니다. (android.permission.CAMERA)\n\
(android.permission.VIBRATE는 QR코드를 인식했을경우, 진동이 울립니다.)\n\
android.permission.INTERNET - 거래소 바로가기, 개인정보처리방침 페이지에서 이용됩니다\n\
android.permission.SYSTEM_ALERT_WINDOW - 지금보시는 alert창을 띄울때 이용합니다\n\
\n\
** 2년 이상 비로그인시, 서비스 종료시 모든 회원정보를 삭제합니다. **\n\
\n\
2. 이용자는 다음과 같은 권리를 행사할 수 있습니다.\n\
- 회원탈퇴 : boseokjung@gmail.com으로 연락주시면 회원탈퇴처리를 해드리겠습니다(추후 메뉴에 회원탈퇴를 구현할 예정)\n\
- 회원탈퇴시 이용자의 아이디, 패스워드, 지갑 정보등 모든 정보를 삭제합니다\n\
\n\
3. 개인정보 담당자\n\
- 성명 : 정보석\n\
- 직책 : 대표\n\
- 연락처 : boseokjung@gmail.com\n\
\n\
4. 개인정보 처리방침 변경\n\
\n\
- 이 개인정보 처리 방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는\n\
 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.\n\
이 개인정보 처리방침은 2017년 8월 12일 부터 적용됩니다.\n\
",
                                        [
                                            {
                                                text: '동의안함', onPress: () => {
                                                    this.setState({ agree: false })
                                                    alert("동의안하시면 가입이 불가능합니다");
                                                    return false
                                                }, style: 'cancel'
                                            },
                                            {
                                                text: '동의', onPress: () => {
                                                    this.setState({ agree: true })
                                                }
                                            },
                                        ],
                                        { cancelable: false }
                                    )
                                }}>
                                <Text style={styles.viewPolicyBtnText}>**개인정보처리방침 보기**</Text>
                            </TouchableOpacity>
                        </View>
                    }

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                            this.setState({ loading: true }, () => {
                                if (this.state.confirmAuth) {
                                    if (this.state.passwd != "" && this.state.passwd2 != "") {
                                        if (this.state.passwd == this.state.passwd2) {
                                            if (this.state.nickname != "") {
                                                if (this.state.enableNickname) {
                                                    if (this.state.agree) {
                                                        this.join();
                                                    } else {
                                                        alert('동의하셔야 가입이 가능합니다!');
                                                        this.setState({ loading: false });
                                                    }
                                                } else {
                                                    alert('닉네임 중복검사를 하세요!');
                                                    this.setState({ loading: false });
                                                }
                                            } else {
                                                alert('닉네임을 입력해주세요');
                                                this.setState({ loading: false });
                                            }
                                        } else {
                                            alert('비밀번호가 일치하지 않습니다!');
                                            this.setState({ loading: false });
                                        }
                                    } else {
                                        alert('비밀번호를 입력해주세요');
                                        this.setState({ loading: false });
                                    }
                                } else {
                                    alert('이메일 인증을 해주세요!');
                                    this.setState({ loading: false });
                                }
                            });
                        }}
                        disabled={this.state.loading}
                    >
                        <Text style={styles.label}>JOIN</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => this.goTitle()}
                    >
                        <Text style={styles.label}>CANCEL</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View >
        );
    }
}
