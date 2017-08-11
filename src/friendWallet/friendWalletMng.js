/**
 * Created by kusob on 2017. 7. 16..
 */

import React, { Component } from 'react';
import {
    ScrollView,
    StyleSheet, Alert,
    Text, TextInput,
    View, AsyncStorage, TouchableOpacity, Image
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import PrivateAddr from "../common/private/address";
import LoadingIcon from "../common/loadingIcon";
import Common from "../common/common";

export default class FriendWalletMng extends Component {
    constructor(props) {
        super(props);

        this.state = {
            load: false,
            nickname: '',
            searching: false,
            searched: false,
            searchList: [],
            myFriendList: [],
        };
    }

    async componentDidMount() {
        await this.getMyFriendList();
    }

    async getMyFriendList() {
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
                    this.setState({ myFriendList: responseJson.list, token: token, load: true });
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
        this.setState({ searching: true, searched: false }, () => {
            if (this.state.nickname.length == 0) {
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
                        this.setState({ searchList: responseJson.list, searching: false, searched: true });
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
        fetch(PrivateAddr.getAddr() + 'friend/meet?Friendid=' + friendId, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': this.state.token
            },
        }).then((response) => {
            return response.json()
        }).then((responseJson) => {
            if (responseJson.message == "SUCCESS") {
                alert('친구 신청 완료!');
                Actions.main({ goTo: 'friendWallet' });
            } else if (responseJson.message == "EXIST") {
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
                                        Actions.main({ goTo: 'friendWallet' });
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
            { cancelable: false }
        )
    }

    render() {
        return (
            <View>
                {!this.state.load &&
                    <LoadingIcon />
                }
                {this.state.searching &&
                    <LoadingIcon />
                }
                <ScrollView contentContainerStyle={styles.frame}>
                    {this.state.load &&
                        <View>
                            <Text style={styles.explain}>
                                여기서 친구를 검색하고, 추가해보세요!{'\n'}
                                친구가 요청을 수락하면, 친구의 지갑을 볼 수 있습니다!{'\n'}
                                이미 추가된 친구라면, 삭제할수도 있습니다!
                        </Text>
                            <View style={styles.searchListRow}>
                                <TextInput
                                    style={styles.input}
                                    value={this.state.nickname}
                                    onChangeText={(nick) => this.setState({ nickname: nick })}
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

                            {this.state.searched &&
                                <View style={styles.searchedFriendListWrapper}>
                                    {this.state.searchList.filter((item) => {
                                        for (var i = 0; i < this.state.myFriendList.length; i++) {
                                            if (item.id == this.state.myFriendList[i].id) {  //친구면 리스트에 포함 x
                                                return false;
                                            } else { //for문의 if에 필터링되지않은것은 리스트에 추가
                                                return true;
                                            }
                                        }
                                        return true;
                                    }).map((user, i) => { //필터링 된것들의 리스트를 보여준다
                                        return (
                                            <View style={styles.searchListRow} key={i}>
                                                <Text style={styles.nicknameText}>{user.nickname}</Text>
                                                <TouchableOpacity
                                                    style={styles.requestBtn}
                                                    underlayColor={'#000000'}
                                                    onPress={() => this.requestFriend(user.id)}
                                                >
                                                    <Text style={styles.btnText}>친구 신청</Text>
                                                </TouchableOpacity>
                                            </View>
                                        );
                                    })}
                                </View>
                            }

                            {this.state.myFriendList.length != 0 &&
                                <View style={styles.myFriendListWrapper}>
                                    <View style={styles.hr} />
                                    <Text style={styles.myFriendListText}>친구목록</Text>
                                    {this.state.myFriendList.map((friend, i) => {
                                        return (
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
                                    })}
                                </View>
                            }
                        </View>
                    }
                </ScrollView>
            </View>
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
    explain: {
        color: '#FFFFFF',
        opacity: 0.8,
        fontSize: 16 * dpi,
        margin: 15 * dpi,
    },
    input: {
        width: 0.45 * wid,
        height: 0.06 * hei,
        fontSize: 15 * dpi,
        color: '#FFFFFF',
        borderColor: '#FFFFFF',
        borderWidth: 1 * dpi,
        borderRadius: 15 * dpi,
        alignSelf: 'center',
        backgroundColor: '#000000',
        opacity: 0.3,
        paddingLeft: 15 * dpi,
    },
    searchBtn: {
        width: 0.2 * wid,
        height: 0.04 * hei,
        borderWidth: 1 * dpi,
        borderRadius: 20 * dpi,
        borderColor: '#FFFFFF',
        padding: 5 * dpi,
        marginVertical: 0.01 * hei,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.6
    },
    searchedFriendListWrapper: {
        width: 0.7 * wid,
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 0.015*hei,
    },
    searchListRow: {
        width: 0.7 * wid,
        flexDirection: 'row',
        alignSelf: 'center',
        justifyContent: 'space-between',
        margin: 1.5 * dpi,
    },
    nicknameText: {
        color: '#FFFFFF',
        opacity: 0.8,
        fontSize: 16 * dpi,
        alignSelf: 'center',
        justifyContent: 'center',
    },
    requestBtn: {
        width: 0.2 * wid,
        height: 0.04 * hei,
        borderWidth: 1 * dpi,
        borderRadius: 20 * dpi,
        borderColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.6
    },
    btnText: {
        color: '#FFFFFF',
        fontSize: 15 * dpi
    },
    myFriendListWrapper: {
        width: 0.7 * wid,
        alignSelf: 'center',
    },
    hr: {
        borderBottomWidth: 1,
        borderColor: '#FFFFFF',
        opacity: 0.8,
        marginVertical: 10,
    },
    myFriendListText: {
        color: '#FFFFFF',
        opacity: 0.8,
        fontSize: 18 * dpi,
        alignSelf: 'center',
        justifyContent: 'center',
        marginBottom: 5,
    },
});
