/**
 * Created by kusob on 2017. 6. 28..
 */

import React, {Component} from 'react';
import {
    StyleSheet, ScrollView,
    Text, TextInput, TouchableHighlight,
    View, AsyncStorage, TouchableOpacity, Image
} from 'react-native';
import {Actions} from 'react-native-router-flux';

import PrivateAddr from '../../common/private/address';

export default class PostAdd extends Component {
    constructor(props) {
        super(props);

        this.state = {
            post_id: '',
            title: '',
            contents: '',
            enable: null,
        };
    }

    async componentDidMount() {
        if (this.props.edit == true)
            await this.setState({
                post_id: this.props.post_id,
                title: this.props.title,
                contents: this.props.contents.replace(/\\n/g, "\n"),
                enable: null,
            });
    }

    async addPost() {
        this.setState({enable: 'none'});
        const tokens = await AsyncStorage.getItem('Token');
        const token = JSON.parse(tokens).token;
        if (this.state.title == "") {
            alert('제목을 입력하세요!');
            return false;
        }
        if (this.state.content == "") {
            alert('내용을 입력해주세요!');
            return false;
        }
        if (this.props.edit != true) { //글쓰기
            // POST /api/post/postcreate
            fetch(PrivateAddr.getAddr() + 'post/postcreate', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': token,
                },
                body: JSON.stringify({
                    title: this.state.title,
                    contents: this.state.contents.replace(/\n/g, "\\n"),
                })
            }).then((response) => {
                return response.json()
            }).then((responseJson) => {
                console.log(responseJson);
                if (responseJson.message == "SUCCESS") {
                    alert('글쓰기 성공!');
                    Actions.main({goTo: 'post'});
                } else {
                    alert('오류가 발생했습니다.\n다시 시도해주세요!');
                }
            }).catch((error) => {
                alert('Network Connection Failed');
                console.error(error);
            }).done();
        } else { //글수정
            // PUT /api/post/posteddit
            try {
                console.log(token);
                console.log(this.props.id);
                fetch(PrivateAddr.getAddr() + 'post/posteddit', {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': token
                    },
                    body: JSON.stringify({
                        post_id: this.props.post_id,
                        title: this.state.title,
                        contents: this.state.contents.replace(/\n/g, "\\n"),
                    })
                }).then((response) => {
                    return response.json()
                }).then((responseJson) => {
                    console.log(responseJson);
                    if (responseJson.message == "SUCCESS") {
                        alert('수정 성공!');
                        this.goTo();
                    } else {
                        alert('오류가 발생했습니다.\n다시 시도해주세요!');
                    }
                }).catch((error) => {
                    alert('Network Connection Failed');
                    console.error(error);
                }).done();
            } catch (err) {
                alert('수정실패 ' + err);
                return false;
            } finally {
                this.setState({enable: null});
            }
        }
    }

    removePost(){

    }

    goTo() {
        Actions.main({goTo: 'postRead', post_id: this.props.post_id});
    }

    render() {
        return (
            <View>
                <ScrollView
                    pointerEvents={this.state.enable}
                    contentContainerStyle={styles.frame}>
                    <TextInput
                        style={styles.input}
                        value={this.state.title}
                        onChangeText={(title) => this.setState({title: title})}
                        placeholder={'제목'}
                        placeholderTextColor="#FFFFFF"
                        autoCapitalize='none'
                        autoCorrect={false}
                        multiline={false}
                        autoFocus={true}
                    />
                    <TextInput
                        style={styles.inputContent}
                        multiline={true}
                        numberOfLines={5}
                        value={this.state.contents}
                        onChangeText={(content) => this.setState({contents: content})}
                        placeholder={'1000자 이내로 입력해주세요'}
                        placeholderTextColor="#FFFFFF"
                        autoCapitalize='none'
                        autoCorrect={false}
                        maxLength={1000}
                    />

                    {this.props.edit &&
                    <TouchableHighlight
                        style={styles.attachBtn}
                        underlayColor={'#000000'}
                        onPress={
                            () => {
                                this.removePost();
                            }
                        }
                    >
                        <Text style={styles.btnText}>글 삭제</Text>
                    </TouchableHighlight>
                    }


                </ScrollView>
                <TouchableOpacity
                    style={styles.navBackBtn}
                    underlayColor={'#AAAAAA'}
                    onPress={() => this.goTo()}
                >
                    <Image source={require('../../common/img/navArrow.png')}
                           style={styles.navBackArrow}/>
                </TouchableOpacity>
                <TouchableHighlight
                    style={styles.rightBtn}
                    underlayColor={'#000000'}
                    onPress={() => this.addPost()}
                >
                    <Text style={styles.rightBtnText}>확인</Text>
                </TouchableHighlight>
            </View>
        );
    }
}

const navArrowSize = 40;
const navArrowWrapperSize = navArrowSize + 10;
var styles = StyleSheet.create({
    frame: {
        paddingTop: 10,
    },
    inputContent: {
        width: 275,
        fontSize: 15,
        color: '#FFFFFF',
        padding: 15,
        paddingTop: 15,
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
    attachBtn: {
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
    btnText: {
        textAlign: 'center',
        color: '#FFFFFF',
        opacity: 0.9
    },
    navBackBtn: {
        width: navArrowWrapperSize,
        height: navArrowWrapperSize,
        position: 'absolute',
        top: -51,
        left: 15,
    },
    navBackArrow: {
        width: navArrowSize,
        height: navArrowSize,
        opacity: 0.3,
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
