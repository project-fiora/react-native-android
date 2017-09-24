/**
 * Created by kusob on 2017. 7. 24..
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View, AsyncStorage, TouchableOpacity, ScrollView
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import PrivateAddr from "../../common/private/address";
import LoadingIcon from 'react-native-loading-spinner-overlay';
import Common from "../../common/common";
import StateStore from "../../common/stateStore";

export default class Post extends Component {
    constructor(props) {
        super(props);

        this.state = {
            topList: [],
            postList: [],
            currentPage: 0,
            load: false,
        };
    }

    componentDidMount() {
        if (!StateStore.guest()) {
            this.getPostList(this.state.currentPage);
        }
    }

    async getPostList(size) {
        // GET /api/post/postlist
        await AsyncStorage.getItem('Token', (err, result) => {
            if (err != null) {
                alert(err);
                return false;
            }
            const token = JSON.parse(result).token;
            fetch(PrivateAddr.getAddr() + "post/postlist?size=" + size, {
                method: 'GET', headers: {
                    "Authorization": token,
                    "Accept": "*/*",
                }
            }).then((response) => response.json()).then((responseJson) => {
                if (responseJson.message == "SUCCESS") {
                    this.setState({
                        topList: responseJson.top,
                        postList: responseJson.list,
                        load: true,
                        currentPage: this.state.currentPage + 1
                    });
                } else {
                    Common.alert("게시판 정보를 가져올 수 없습니다");
                    return false;
                }
            }).catch((error) => {
                console.error(error);
            }).done();
        });
    }

    readPost(post_id) {
        Actions.main({ goTo: 'postRead', post_id: post_id });
    }

    render() {
        if (StateStore.guest()) {
            return (
                <Text style={{
                    color:'#FFFFFF',
                    fontSize:18,
                    textAlign:'center',
                    padding:30,
                }}>
                    손님은 '아직' 게시판을 이용할수없어요
                </Text>
            );
        } else if (this.state.load == true) {
            return (
                <ScrollView contentContainerStyle={styles.frame}>
                    <View style={styles.thead}>
                        <View style={styles.th1}>
                            <Text style={styles.headText}>
                                추천
                            </Text>
                        </View>
                        <View style={styles.th2}>
                            <Text style={styles.headText}>
                                제목
                            </Text>
                        </View>
                        <View style={styles.th3}>
                            <Text style={styles.headText}>
                                작성자
                            </Text>
                        </View>
                    </View>

                    {this.state.topList.map((top, i) => {
                        let c_count = "";
                        if (top.c_count > 0) {
                            c_count = "[" + top.c_count + "]";
                        }

                        if (i == this.state.topList.length - 1) {
                            return (
                                <View key={i}>
                                    <TouchableOpacity
                                        onPress={() => this.readPost(top.post_id)}
                                        style={styles.topTr}>
                                        <View style={styles.td1}>
                                            <Text style={styles.bodyText}>
                                                {top.likes_count}
                                            </Text>
                                        </View>
                                        <View style={styles.td2}>
                                            <Text numberOfLines={1} ellipsizeMode='middle' style={styles.bodyText}>
                                                {top.title} <Text style={styles.c_count}>{c_count}</Text>
                                            </Text>
                                        </View>
                                        <View style={styles.td3}>
                                            <Text style={styles.bodyText}>
                                                {top.nickname}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                    <View style={styles.heavyHr} />
                                </View>
                            );
                        } else {
                            return (
                                <View key={i}>
                                    <TouchableOpacity
                                        onPress={() => this.readPost(top.post_id)}
                                        style={styles.topTr}>
                                        <View style={styles.td1}>
                                            <Text style={styles.bodyText}>
                                                {top.likes_count}
                                            </Text>
                                        </View>
                                        <View style={styles.td2}>
                                            <Text numberOfLines={1} ellipsizeMode='middle' style={styles.bodyText}>
                                                {top.title} <Text style={styles.c_count}>{c_count}</Text>
                                            </Text>
                                        </View>
                                        <View style={styles.td3}>
                                            <Text style={styles.bodyText}>
                                                {top.nickname}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                    <View style={styles.hr} />
                                </View>
                            )
                        }
                    })}

                    {this.state.postList.map((post, i) => {
                        let c_count = "";
                        if (post.c_count > 0) {
                            c_count = "[" + post.c_count + "]";
                        }
                        return (
                            <View key={i}>
                                <TouchableOpacity
                                    onPress={() => this.readPost(post.post_id)}
                                    style={styles.postTr}>
                                    <View style={styles.td1}>
                                        <Text style={styles.bodyText}>
                                            {post.likes_count}
                                        </Text>
                                    </View>
                                    <View style={styles.td2}>
                                        <Text numberOfLines={1} ellipsizeMode='middle' style={styles.bodyText}>
                                            {post.title} <Text style={styles.c_count}>{c_count}</Text>
                                        </Text>
                                    </View>
                                    <View style={styles.td3}>
                                        <Text style={styles.bodyText}>
                                            {post.nickname}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                                <View style={styles.hr} />
                            </View>
                        )
                    })}
                    <TouchableOpacity
                        style={styles.moreBtn}
                        onPress={() => this.getPostList(this.state.currentPage)}
                    >
                        <Text style={styles.moreBtnText}>더보기</Text>
                    </TouchableOpacity>
                </ScrollView>
            );
        } else {
            return (
                <LoadingIcon visible={true} />
            );
        }
    }
}

const wid = Common.winWidth();
const hei = Common.winHeight();
const t1 = 0.09 * wid;
const t2 = 0.51 * wid;
const t3 = 0.3 * wid;
const thei = 0.06 * hei;
var styles = StyleSheet.create({
    frame: {
        padding: 10,
        opacity: 0.8,
    },
    thead: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 2,
        borderColor: '#FFFFFF',
        paddingVertical: thei / 6,
        height: thei,
    },
    headText: {
        fontSize: 15,
        color: '#FFFFFF',
    },
    th1: {
        alignItems: 'center',
        width: t1,
    },
    th2: {
        alignItems: 'flex-start',
        width: t2,
    },
    th3: {
        alignItems: 'center',
        width: t3,
    },
    topTr: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: thei,
        opacity: 0.8,
    },
    postTr: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: thei,
        opacity: 0.8,
    },
    hr: {
        borderBottomWidth: 0.8,
        borderColor: '#FFFFFF',
    },
    heavyHr: {
        borderBottomWidth: 1.5,
        borderColor: '#FFFFFF',
    },
    bodyText: {
        fontSize: 14,
        color: '#FFFFFF',
    },
    c_count: {
        fontSize: 14,
        color: '#DBCEFF',
    },
    td1: {
        justifyContent: 'center',
        alignItems: 'center',
        width: t1,
    },
    td2: {
        justifyContent: 'center',
        width: t2,
    },
    td3: {
        justifyContent: 'center',
        alignItems: 'center',
        width: t3,
    },
    moreBtn: {
        width: 0.2 * wid,
        height: 0.05 * hei,
        borderWidth: 1,
        borderRadius: 20,
        borderColor: '#FFFFFF',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        opacity: 0.6,
        marginTop: 5,
    },
    moreBtnText: {
        color: '#FFFFFF',
        fontSize: 14
    },
});
