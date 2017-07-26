/**
 * Created by kusob on 2017. 7. 4..
 */
import React, {Component} from 'react';
import {
    Image,
    Text, TextInput, TouchableHighlight,
    View, AsyncStorage
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import CheckBox from 'react-native-checkbox';
import styles from './index_style';

import PrivateAddr from "../common/private/address";


export default class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentPage: 'title',
            email: '',
            password: '',
            autoLogin: false,
            logining: false,
            enableTouch:null,
        };
    }

    async componentWillMount(){
        let token = await AsyncStorage.getItem('Token');
        if(token!==null){
            let tokens = JSON.parse(token);
            if(tokens.autoLogin){
                this.setState({autoLogin:true},()=>this.login(tokens.email, tokens.password));
            }
        }
    }

    login(email, password) {
        this.setState({logining:true, enableTouch:'none'});
        fetch(PrivateAddr.getAddr() + 'member/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        }).then((response) =>{
            return response.json();
        }).then((responseJson) => {
            if (responseJson.message == "SUCCESS") {
                try {
                    AsyncStorage.setItem('Token', JSON.stringify({
                        email: email,
                        password: password,
                        token:responseJson.jwtToken,
                        autoLogin:this.state.autoLogin
                    }),()=>Actions.main({goTo: 'home'}));
                } catch (e) {
                    alert("storage save fail : " + e);
                }
            } else {
                alert('로그인에 실패했습니다!');
            }
        }).catch((error) => {
            alert('Network Connection Failed');
            console.error(error);
        }).done(()=>this.setState({logining:false, enableTouch:null}));
    }

    render() {
        return (
            <View style={styles.loginContainer} pointerEvents={this.state.enableTouch}>
                {this.state.logining == true &&
                <View style={styles.loadingIconWrapper}>
                    <Image source={require('../common/img/loading.gif')} style={styles.loadingIcon}/>
                </View>

                }
                <Image source={require('../common/img/mainIcon.png')} style={styles.mainIcon}/>
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
                        autoCorrect={false}
                    />
                </View>

                <View style={styles.inputWrapper}>
                    <Image source={require('../common/img/passwd.png')} style={styles.inputTextIcon}/>
                    <TextInput
                        style={styles.input}
                        value={this.state.password}
                        onChangeText={(pw) => this.setState({password: pw})}
                        placeholder={'비밀번호'}
                        placeholderTextColor="#FFFFFF"
                        secureTextEntry={true}
                        maxLength={20}
                        multiline={false}
                    />
                </View>

                <CheckBox
                    containerStyle={{width: 200, marginTop: 5, marginBottom: 40}}
                    label="자동로그인"
                    labelStyle={{opacity: 0.7, color: '#FFFFFF', fontSize: 14,}}
                    checkboxStyle={{opacity: 0.7, width: 14, height: 14}}
                    checkedImage={require('../common/img/check.png')}
                    uncheckedImage={require('../common/img/un.png')}
                    underlayColor="transparent"
                    checked={this.state.autoLogin}
                    onChange={() => this.setState({autoLogin: !this.state.autoLogin})}
                />

                <TouchableHighlight
                    style={styles.button}
                    underlayColor={'#FFFFFF'}
                    onPress={() => this.login(this.state.email, this.state.password)}
                >
                    <Text style={styles.label}>LOGIN</Text>
                </TouchableHighlight>

                <TouchableHighlight
                    style={styles.button}
                    underlayColor={'#FFFFFF'}
                    onPress={this.props.goJoinPage}
                >
                    <Text style={styles.label}>JOIN</Text>
                </TouchableHighlight>
            </View>
        );
    }
}
