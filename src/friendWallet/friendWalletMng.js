/**
 * Created by kusob on 2017. 7. 16..
 */

import React, {Component} from 'react';
import {
    ScrollView,
    StyleSheet, Alert,
    Text, TextInput,
    View, AsyncStorage, TouchableOpacity, Image
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import PrivateAddr from "../common/private/address";

export default class FriendWalletMng extends Component {
    constructor(props) {
        super(props);

        this.state = {
            load:false,
            nickname: '',
            searching: false,
            searched: false,
            searchList: [],
            myFriendList:[],
        };
    }

    async componentDidMount(){
        await this.getMyFriendList();
    }

    async getMyFriendList(){
        const tokens = await AsyncStorage.getItem('Token');
        const token = JSON.parse(tokens).token;
        fetch(PrivateAddr.getAddr() + "friend/myfriend", {
            method: 'GET', headers: {
                "Authorization": token,
                "Accept": "*/*",
            }
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.message == "SUCCESS") {
                    this.setState({myFriendList: responseJson.list, token:token, load:true });
                } else {
                    alert("친구정보를 가져올 수 없습니다");
                    return false;
                }
            })
            .catch((error) => {
                console.error(error);
            })
            .done();
    }

    searchNickname() {
        this.setState({searching:true, searched:false},()=>{
            if(this.state.nickname.length==0){
                alert("닉네임을 입력해주세요!");
                return false;
            }
            fetch(PrivateAddr.getAddr() + "friend/search?FriendNickName=" + this.state.nickname, {
                method: 'GET', headers: {
                    "Authorization": this.state.token,
                    "Accept": "*/*",
                }
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    if (responseJson.message == "SUCCESS") {
                        console.log(responseJson.list);
                        this.setState({searchList: responseJson.list, searching: false, searched:true});
                    } else {
                        alert("정보를 가져올 수 없습니다");
                        return false;
                    }
                })
                .catch((error) => {
                    console.error(error);
                })
                .done();
        });
    }

    requestFriend(friendId) {
        fetch(PrivateAddr.getAddr() + 'friend/meet?Friendid='+friendId, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': this.state.token
            },
        }).then((response) => {
            return response.json()
        }).then((responseJson) => {
            console.log(responseJson);
            if (responseJson.message == "SUCCESS") {
                alert('친구 신청 완료!');
                Actions.main({goTo: 'friendWallet'});
            } else if(responseJson.message == "EXIST"){
                alert('이미 요청된 친구입니다!');
                return false;
            } else {
                alert('친구 요청에 실패했습니다.\n이미 친구 요청을 하신것이 아니라면\n서버관리자에게 문의해주세요.');
                return false;
            }
        })
            .catch((error) => {
                alert('Network Connection Failed');
                console.error(error);
            }).done();
    }

    deleteFriend(friendId) {
        Alert.alert(
            '경고!',
            '친구가 삭제됩니다.\n정말 삭제합니까?',
            [
                {
                    text: 'Cancel', onPress: () => {
                    return false
                }, style: 'cancel'
                },
                {
                    text: 'OK', onPress: () => {
                    try {
                        fetch(PrivateAddr.getAddr() + "friend/deletefriend?friendId=" + friendId, {
                            method: 'DELETE', headers: {
                                "Authorization": this.state.token,
                                "Accept": "*/*",
                            }
                        })
                            .then((response) => response.json())
                            .then((responseJson) => {
                                if (responseJson.message == "SUCCESS") {
                                    alert("친구를 삭제했습니다");
                                    Actions.main({goTo: 'friendWallet'});
                                } else {
                                    alert("친구 삭제 실패\n서버관리자에게 문의하세요");
                                    return false;
                                }
                            })
                            .catch((error) => {
                                console.error(error);
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

    render() {
        return (
            <View>
                {this.state.load==false&&
                <View style={styles.loadingIconWrapper}>
                    <Image source={require('../common/img/loading.gif')} style={styles.loadingIcon}/>
                </View>
                }
                {this.state.load==true&&
                <ScrollView contentContainerStyle={styles.frame}>
                    <Text style={styles.explain}>
                        여기서 친구를 검색하고, 추가해보세요!{'\n'}
                        친구가 요청을 수락하면, 친구의 지갑을 볼 수 있습니다!{'\n'}
                        이미 추가된 친구라면, 삭제할수도 있습니다!
                    </Text>
                    <View style={styles.row}>
                        <TextInput
                            style={styles.input}
                            value={this.state.nickname}
                            onChangeText={(nick) => this.setState({nickname: nick})}
                            placeholder={'친구 닉네임'}
                            placeholderTextColor="#FFFFFF"
                            autoCapitalize='none'
                            maxLength={50}
                            multiline={false}
                        />
                        <TouchableOpacity
                            style={styles.searchBtn}
                            underlayColor={'#000000'}
                            onPress={() => this.searchNickname()}
                        >
                            <Text style={styles.btnText}>검색</Text>
                        </TouchableOpacity>
                    </View>
                    {this.state.searching==true&&
                    <View style={styles.loadingIconWrapper}>
                        <Image source={require('../common/img/loading.gif')} style={styles.loadingIcon}/>
                    </View>
                    }
                    {this.state.searched == true &&
                    this.state.searchList.map((friend, i) => {
                        for(var j=0; j<this.state.myFriendList.length; j++){
                            if(this.state.myFriendList[j].id==friend.id){
                                return(
                                    <View style={styles.searchListRow} key={i}>
                                        <Text style={styles.nicknameText}>{friend.nickname}</Text>
                                        <TouchableOpacity
                                            style={styles.requestBtn}
                                            underlayColor={'#000000'}
                                            onPress={() => this.deleteFriend(friend.id)}
                                        >
                                            <Text style={styles.btnText}>친구 삭제</Text>
                                        </TouchableOpacity>
                                    </View>
                                );
                            }
                        }
                        return(
                            <View style={styles.searchListRow} key={i}>
                                <Text style={styles.nicknameText}>{friend.nickname}</Text>
                                <TouchableOpacity
                                    style={styles.requestBtn}
                                    underlayColor={'#000000'}
                                    onPress={() => this.requestFriend(friend.id)}
                                >
                                    <Text style={styles.btnText}>친구 신청</Text>
                                </TouchableOpacity>
                            </View>
                        );
                    })
                    }
                </ScrollView>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    loadingIconWrapper: {
        position: 'absolute',
        top: 50,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf:'center',
    },
    loadingIcon: {
        width: 40,
        height: 40,
    },
    frame: {
        alignItems: 'center',
        paddingBottom: 85,
    },
    explain: {
        color: '#FFFFFF',
        opacity: 0.8,
        fontSize: 16,
        margin: 15,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom:8.5,
    },
    input: {
        width: 200,
        height: 45,
        fontSize: 15,
        color: '#FFFFFF',
        borderColor: '#FFFFFF',
        borderWidth: 1,
        borderRadius: 15,
        alignSelf: 'center',
        backgroundColor: '#000000',
        opacity: 0.3,
        marginBottom: 5,
        marginRight: 5,
        marginLeft: 7.5,
        paddingLeft: 15,
    },
    searchBtn: {
        width: 80,
        height: 30,
        borderWidth: 1,
        borderRadius: 20,
        borderColor: '#FFFFFF',
        padding: 5,
        margin: 7.5,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.6
    },
    searchListRow:{
        width:200,
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin:1.5,
    },
    nicknameText:{
        color: '#FFFFFF',
        opacity: 0.8,
        fontSize: 16,
        alignSelf:'center',
        justifyContent:'center',
    },
    requestBtn:{
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
    btnText: {
        color: '#FFFFFF',
        fontSize: 15
    },
});
