/**
 * Created by kusob on 2017. 6. 28..
 */


import React, {Component} from 'react';
import {
    StyleSheet,
    Text, TextInput, TouchableHighlight,
    View
} from 'react-native';
import {Actions} from 'react-native-router-flux';

import PrivateAddr from '../common/private/address';

export default class Inquire extends Component {
    constructor(props) {
        super(props);

        this.state = {
            content:'',
            senderEmail: '',
        };
    }

    sendMail(){
        if(this.state.content==""){
            alert('내용을 입력해주세요!');
            return false;
        }
        if(this.state.senderEmail==""){
            alert('답변 받을 이메일 주소를 입력해주세요!');
            return false;
        }
        alert('전송이 완료 될때까지\n잠시만 기다려주세요');
        fetch(PrivateAddr.getAddr()+'inquire', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: this.state.content,
                senderEmail: this.state.senderEmail
            })
        }).then((response) => {return response.json()})
            .then((responseJson) => {
                if(responseJson.message=="SUCCESS"){
                    alert('성공적으로 메시지를 전송했습니다!');
                    Actions.main({goTo:'more'});
                } else {
                    alert('오류가 발생했습니다.\n다시 시도해주세요!');
                }
            })
            .catch((error) => {
                alert('Network Connection Failed');
                console.error(error);
            }).done();
    }

    render() {
        return (
                <View style={styles.frame}>
                    <TextInput
                        style={styles.inputContent}
                        multiline={true}
                        numberOfLines={4}
                        value={this.state.content}
                        onChangeText={(content) => this.setState({content: content})}
                        placeholder={'1000자 이내로 입력해주세요'}
                        placeholderTextColor="#FFFFFF"
                        autoCapitalize = 'none'
                        maxLength={2000}
                        autoFocus={true}
                    />
                    <TextInput
                        style={styles.input}
                        value={this.state.senderEmail}
                        onChangeText={(email) => this.setState({senderEmail: email})}
                        keyboardType='email-address'
                        placeholder={'답변 받을 이메일 주소'}
                        placeholderTextColor="#FFFFFF"
                        autoCapitalize = 'none'
                        multiline={false}
                        autoFocus={true}
                    />
                    <TouchableHighlight
                        style={styles.attachBtn}
                        underlayColor={'#000000'}
                        onPress={
                            () => {
                                alert('wallet');
                            }
                        }
                    >
                        <Text style={styles.btnText}>스크린샷, 이미지 첨부</Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={styles.rightBtn}
                        underlayColor={'#000000'}
                        onPress={() => this.sendMail()}
                    >
                        <Text style={styles.rightBtnText}>전송</Text>
                    </TouchableHighlight>
                </View>
        );
    }
}

var styles = StyleSheet.create({
    frame:{
        paddingTop:10,
    },
    inputContent:{
        width: 275,
        fontSize: 15,
        color: '#FFFFFF',
        padding: 15,
        paddingTop:15,
        height: 350,
        borderColor: '#FFFFFF',
        borderWidth: 1,
        borderRadius: 15,
        alignSelf: 'center',
        backgroundColor: 'transparent',
        marginBottom: 5,
        opacity: 0.7
    },
    input: { //입력칸
        width: 275,
        fontSize: 15,
        color: '#FFFFFF',
        padding: 15,
        height: 50,
        borderColor: '#FFFFFF',
        borderWidth: 1,
        borderRadius: 15,
        alignSelf: 'center',
        backgroundColor: 'transparent',
        marginBottom: 5,
        opacity: 0.7
    },
    attachBtn:{
        width: 275,
        padding: 15,
        height: 50,
        borderColor: '#FFFFFF',
        borderWidth: 1,
        borderRadius: 15,
        alignSelf: 'center',
        backgroundColor: 'transparent',
        opacity: 0.7
    },
    btnText:{
        textAlign:'center',
        color:'#FFFFFF',
        opacity:0.9
    },
    rightBtn: {
        position:'absolute',
        top:-45,
        right:15,
        width: 80,
        height: 30,
        borderWidth: 1,
        borderRadius: 20,
        borderColor: '#FFFFFF',
        padding: 5,
        alignItems: 'center',
        justifyContent:'center',
        opacity:0.6
    },
    rightBtnText: {
        color: '#FFFFFF',
        fontSize: 15
    },
});
