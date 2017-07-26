/**
 * Created by kusob on 2017. 7. 24..
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View, AsyncStorage, TouchableOpacity, ScrollView, Image
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import PrivateAddr from "../../common/private/address";

export default class Post extends Component {
    constructor(props) {
        super(props);

        this.state = {
            topList: [],
            postList:[],
            currentPage: 0,
            load: false,
        };
    }

    componentDidMount() {
        this.getPostList(this.state.currentPage);
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
                console.log(responseJson);
                if (responseJson.message == "SUCCESS") {
                    this.setState({
                        topList: responseJson.top,
                        postList: responseJson.list,
                        load: true,
                        currentPage:this.state.currentPage+1
                    });
                } else {
                    alert("게시판 정보를 가져올 수 없습니다");
                    return false;
                }
            }).catch((error) => {
                console.error(error);
            }).done();
        });
    }

    readPost(post_id) {
        Actions.main({goTo:'postRead', post_id:post_id});
    }

    render() {
        if(this.state.load==true){
            return (
                <ScrollView contentContainerStyle={styles.frame}>
                    {/*<Text style={styles.explain}>*/}
                        {/*상단의 게시물 3개는 추천이 많은 게시물입니다*/}
                    {/*</Text>*/}
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
                        if (top.title.length > 13) {
                            top.title = top.title.substr(0, 12) + "...";
                        }
                        if (top.nickname.length > 6) {
                            top.nickname = top.nickname.substr(0, 6) + "...";
                        }
                        return (
                            <View key={i} style={styles.topTr}>
                                <View style={styles.td1}>
                                    <Text style={styles.bodyText}>
                                        {top.likes_count}
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => this.readPost(top.post_id)}
                                    style={styles.td2}>
                                    <Text style={styles.bodyText}>
                                        {top.title}
                                    </Text>
                                </TouchableOpacity>
                                <View style={styles.td3}>
                                    <Text style={styles.bodyText}>
                                        {top.nickname}
                                    </Text>
                                </View>
                            </View>
                        )
                    })}

                    {this.state.postList.map((post, i) => {
                        if (post.title.length > 13) {
                            post.title = post.title.substr(0, 12) + "...";
                        }
                        if (post.nickname.length > 6) {
                            post.nickname = post.nickname.substr(0, 6) + "...";
                        }
                        return (
                            <View key={i} style={styles.postTr}>
                                <View style={styles.td1}>
                                    <Text style={styles.bodyText}>
                                        {post.likes_count}
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => this.readPost(post.post_id)}
                                    style={styles.td2}>
                                    <Text style={styles.bodyText}>
                                        {post.title}
                                    </Text>
                                </TouchableOpacity>
                                <View style={styles.td3}>
                                    <Text style={styles.bodyText}>
                                        {post.nickname}
                                    </Text>
                                </View>
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
                <View style={styles.loadingIconWrapper}>
                    <Image source={require('../../common/img/loading.gif')} style={styles.loadingIcon}/>
                </View>
            );
        }
    }
}

var styles = StyleSheet.create({
    frame: {
        padding: 10,
        opacity: 0.8,
    },
    loadingIconWrapper: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    loadingIcon: {
        width: 30,
        height: 30,
    },
    explain: {
        fontSize: 15,
        color: '#FFFFFF',
        opacity: 0.7,
        textAlign: 'center',
        marginBottom: 10,
    },
    thead: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1.2,
        borderColor: '#FFFFFF',
        height: 28,
    },
    headText: {
        fontSize: 18,
        color: '#FFFFFF',
    },
    th1: {
        alignItems: 'center',
        width: 40,
    },
    th2: {
        alignItems: 'flex-start',
        width: 180,
        paddingLeft: 5,
    },
    th3: {
        alignItems: 'center',
        width: 100,
    },
    topTr: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 0.6,
        borderColor: '#FFFFFF',
        height: 40,
        backgroundColor: '#000000',
        opacity: 0.3,
    },
    postTr: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 0.6,
        borderColor: '#FFFFFF',
        height: 40,
    },
    bodyText: {
        fontSize: 16,
        color: '#FFFFFF',
    },
    td1: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 40,
    },
    td2: {
        justifyContent: 'center',
        width: 180,
        paddingLeft: 5,
    },
    td3: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,
    },
    moreBtn: {
        width: 80,
        height: 30,
        borderWidth: 1,
        borderRadius: 20,
        borderColor: '#FFFFFF',
        padding: 5,
        alignItems: 'center',
        alignSelf:'center',
        justifyContent: 'center',
        opacity: 0.6,
        marginTop: 3,
    },
    moreBtnText: {
        color: '#FFFFFF',
        fontSize: 15
    },
});
