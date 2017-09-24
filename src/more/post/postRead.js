/**
 * Created by kusob on 2017. 7. 24..
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text, Alert,
    View, AsyncStorage, TouchableOpacity, ScrollView, TextInput, TouchableHighlight
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import PrivateAddr from "../../common/private/address";
import Common from '../../common/common';
import LoadingIcon from 'react-native-loading-spinner-overlay';
import StateStore from "../../common/stateStore";

export default class Post extends Component {
    constructor(props) {
        super(props);

        this.state = {
            post: {},
            comment: '',
            load: false,
            like: false,
        };
    }

    async componentDidMount() {
        await this.getPost();
    }

    async getPost() {
        // GET /api/post/postinfo
        await AsyncStorage.getItem('Token', (err, result) => {
            if (err != null) {
                alert(err);
                return false;
            }
            const token = JSON.parse(result).token;
            this.setState({ token: token });
            fetch(PrivateAddr.getAddr() + "post/postinfo?post_id=" + this.props.post_id, {
                method: 'GET', headers: {
                    "Authorization": token,
                    "Accept": "*/*",
                }
            }).then((response) => response.json()).then((responseJson) => {
                if (responseJson.message == "SUCCESS") {
                    StateStore.setEdit_postTitle(responseJson.title);
                    StateStore.setEdit_postContents(responseJson.contents);
                    this.setState({
                        post: responseJson,
                        like: responseJson.like,
                        load: true,
                    });
                } else {
                    alert("게시물 정보를 가져올 수 없습니다");
                    return false;
                }
            }).catch((error) => {
                console.error(error);
            }).done();
        });
    }

    onClickLike() { //좋아요 버튼
        if (this.state.like) { //이미 좋아요 상태라면!
            // DELETE /api/post/postlikedelete 좋아요를 취소한다
            try {
                //좋아요 취소
                fetch(PrivateAddr.getAddr() + "post/postlikedelete?post_id=" + this.props.post_id, {
                    method: 'DELETE', headers: {
                        "Authorization": this.state.token,
                        "Accept": "*/*",
                    }
                })
                    .then((response) => response.json())
                    .then((responseJson) => {
                        if (responseJson.message == "SUCCESS") {
                            this.setState({ like: false });
                        } else {
                            alert("좋아요 취소 실패");
                            return false;
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            } catch (err) {
                alert('좋아요 취소 실패 ' + err);
                return false;
            }
        } else { //좋아요가 true가 아닐때
            // POST /api/post/postlike //조아요!
            fetch(PrivateAddr.getAddr() + 'post/postlike?post_id=' + this.props.post_id, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': this.state.token,
                }
            }).then((response) => {
                return response.json()
            }).then((responseJson) => {
                if (responseJson.message == "SUCCESS") {
                    this.setState({ like: true });
                } else {
                    alert('오류가 발생했습니다.\n다시 시도해주세요!');
                }
            }).catch((error) => {
                alert('Network Connection Failed');
                console.error(error);
                return false;
            }).done();
        }
    }

    editPost() {
        Actions.main({
            goTo: 'postEdit',
            post_id: this.props.post_id,
            title: this.state.post.title,
            contents: this.state.post.contents,
            edit: true,
        });
    }

    deletePost() {
        // DELETE /api/post/postdelete
        Alert.alert(
            '경고!',
            '게시물이 삭제됩니다.\n정말 삭제합니까!?',
            [
                {
                    text: 'Cancel', onPress: () => {
                        return false
                    }, style: 'cancel'
                },
                {
                    text: 'OK', onPress: () => {
                        try {
                            //게시물 삭제
                            fetch(PrivateAddr.getAddr() + "post/postdelete?post_id=" + this.props.post_id, {
                                method: 'DELETE', headers: {
                                    "Authorization": this.state.token,
                                    "Accept": "*/*",
                                }
                            })
                                .then((response) => response.json())
                                .then((responseJson) => {
                                    if (responseJson.message == "SUCCESS") {
                                        alert("게시물을 삭제했습니다");
                                    } else {
                                        alert("글 실패");
                                        return false;
                                    }
                                })
                                .catch((error) => {
                                    console.error(error);
                                });
                            Actions.main({ goTo: 'post' });
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

    editCommentBtn(i) { //state에 어떤 댓글의 수정버튼을 눌렀는지 저장-그리고 contents의 개행문자들을 개행으로 바꿔서 보여준다
        var stateCopy = Object.assign({}, this.state);
        stateCopy.post.comment_list = stateCopy['post'].comment_list.slice();
        stateCopy.post.comment_list[i].contents = stateCopy.post.comment_list[i].contents.replace(/\\n/g, "\n");
        stateCopy.post.comment_list[i].editStatus = true;
        this.setState(stateCopy);
    }

    editCommentText(contents, i) { //textInput 의 텍스트가 바뀔때마다 comment_list객체 내부를 수정
        var stateCopy = Object.assign({}, this.state);
        stateCopy.post.comment_list = stateCopy['post'].comment_list.slice();
        stateCopy.post.comment_list[i].contents = contents;
        this.setState(stateCopy);
    }

    editComment(comment_id, contents) {
        // PUT /api/comments/commentedit
        try {
            fetch(PrivateAddr.getAddr() + 'comments/commentedit', {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': this.state.token
                },
                body: JSON.stringify({
                    post_id: this.props.post_id,
                    comment_id: comment_id,
                    contents: contents.replace(/\n/g, "\\n"),
                })
            }).then((response) => {
                return response.json()
            }).then((responseJson) => {
                if (responseJson.message == "SUCCESS") {
                    this.getPost();
                } else {
                    Common.alert('오류가 발생했습니다.\n다시 시도해주세요!');
                }
            }).catch((error) => {
                alert('Network Connection Failed');
                console.error(error);
            }).done();
        } catch (err) {
            alert('수정실패 ' + err);
            return false;
        } finally {
            this.setState({ enable: null });
        }
    }

    deleteComment(comment_id) {
        // DELETE /api/comments/commentdelete
        Alert.alert(
            '경고!',
            '댓글이 삭제됩니다.\n정말 지우실건가요!?',
            [
                {
                    text: 'Cancel', onPress: () => {
                        return false
                    }, style: 'cancel'
                },
                {
                    text: 'OK', onPress: () => {
                        try {
                            //댓글 삭제하기
                            fetch(PrivateAddr.getAddr() + "comments/commentdelete", {
                                method: 'DELETE',
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json',
                                    "Authorization": this.state.token,
                                },
                                body: JSON.stringify({
                                    post_id: this.props.post_id,
                                    comment_id: comment_id,
                                })
                            }).then((response) => response.json()).then((responseJson) => {
                                if (responseJson.message == "SUCCESS") {
                                    var stateCopy = Object.assign({}, this.state);
                                    stateCopy.post.comment_list = stateCopy['post'].comment_list.slice();
                                    stateCopy.post.comment_list.pop();
                                    this.setState(stateCopy);
                                } else {
                                    Common.alert("댓글 삭제 실패");
                                    return false;
                                }
                            }).catch((error) => {
                                console.error(error);
                            });
                        } catch (err) {
                            alert('댓글 삭제 실패\n' + err);
                            return false;
                        }
                    }
                },
            ],
            { cancelable: false }
        )
    }

    addComment() {
        // POST /api/comments/commentcreate
        fetch(PrivateAddr.getAddr() + 'comments/commentcreate', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': this.state.token,
            },
            body: JSON.stringify({
                post_id: this.props.post_id,
                contents: this.state.comment.replace(/\n/g, "\\n"),
            })
        }).then((response) => {
            return response.json()
        }).then((responseJson) => {
            if (responseJson.message == "SUCCESS") {
                try {
                    var recentComment = responseJson.list[responseJson.list.length - 1];
                    var stateCopy = Object.assign({}, this.state);
                    stateCopy.post.comment_list = stateCopy['post'].comment_list.slice();
                    stateCopy.post.comment_list.push(recentComment);
                    stateCopy.comment = '';
                    this.setState(stateCopy);
                } catch (err) {
                    alert("댓글 생성 에러\n" + err);
                }
            } else {
                Common.alert('오류가 발생했습니다.\n다시 시도해주세요!');
            }
        }).catch((error) => {
            alert('Network Connection Failed');
            console.error(error);
        }).done();
    }

    render() {
        if (this.state.load == true) {
            return (
                <View>
                    <ScrollView contentContainerStyle={styles.frame}>
                        <View>
                            <View>
                                <View>
                                    <View style={styles.commentRow}>
                                        <Text style={styles.title}>{this.state.post.title}</Text>
                                        <Text
                                            style={styles.date}>{Common.modifyDate(this.state.post.written_date)}</Text>
                                    </View>
                                    <View style={styles.commentRow}>
                                        {this.state.post.possibleEdditAndDelete &&
                                            <View style={styles.commentRow}>
                                                <TouchableOpacity
                                                    onPress={() => this.editPost()}
                                                >
                                                    <Text style={styles.commentEditBtnText}>글수정</Text>
                                                </TouchableOpacity>
                                                < Text style={styles.commentEditBtnTextBetween}> | </Text>
                                                <TouchableOpacity
                                                    onPress={() => this.deletePost()}
                                                >
                                                    <Text style={styles.commentEditBtnText}>글삭제</Text>
                                                </TouchableOpacity>
                                            </View>
                                        }
                                        {!this.state.post.possibleEdditAndDelete &&
                                            <View />
                                        }
                                        <Text style={styles.name}>{this.state.post.writter_name}</Text>
                                    </View>
                                </View>
                                <View style={styles.contentsWrapper}>
                                    {this.state.post.contents.split("\\n").map((content, i) => {
                                        return (
                                            <Text key={i} style={styles.content}>{content}</Text>
                                        );
                                    })}
                                </View>
                            </View>
                            <View style={styles.commentRow}>
                                <Text style={styles.commentLength}>
                                    댓글 {this.state.post.comment_list.length}개
                                </Text>
                                {!StateStore.guest() &&
                                    <TouchableOpacity
                                        onPress={() => this.onClickLike()}
                                    >
                                        {!this.state.like &&
                                            <Text style={styles.likeBtn}>
                                                추천
                                            </Text>
                                        }
                                        {this.state.like &&
                                            <Text style={styles.likeCancelBtn}>
                                                추천 취소
                                            </Text>
                                        }
                                    </TouchableOpacity>
                                }
                            </View>
                            {/*//////////////////////////////댓글 갯수////////////////////////////////////////*/}
                            {this.state.post.comment_list.map((comment, i) => {
                                if (comment.posibleEdditAndDelete) { //자신이 쓴 댓글은 수정/삭제 버튼이있다
                                    return (
                                        <View key={i} style={styles.commentView}>
                                            <View style={styles.commentRow}>
                                                <Text style={styles.commentWriter}>{comment.writter_name}</Text>
                                                <Text
                                                    style={styles.commentDate}>{Common.modifyDate(comment.written_date)}</Text>
                                            </View>
                                            <View style={styles.commentContentRow}>

                                                {this.state.post.comment_list[i].editStatus &&
                                                    <TextInput
                                                        style={styles.inputEditComment}
                                                        multiline={true}
                                                        numberOfLines={5}
                                                        value={this.state.post.comment_list[i].contents}
                                                        onChangeText={(comment_edit) => {
                                                            this.editCommentText(comment_edit, i)
                                                        }}
                                                        placeholderTextColor="#FFFFFF"
                                                        autoCapitalize='none'
                                                        autoCorrect={false}
                                                        maxLength={1000}
                                                    />
                                                }
                                                {this.state.post.comment_list[i].editStatus != true &&
                                                    <View>
                                                        {comment.contents.split("\\n").map((content, i) => {
                                                            return (
                                                                <Text key={i}
                                                                    style={styles.commentContents}>{content}</Text>
                                                            )
                                                        })}
                                                    </View>
                                                }
                                                <View style={styles.commentRow}>
                                                    {this.state.post.comment_list[i].editStatus &&
                                                        <TouchableOpacity
                                                            onPress={() => this.editComment(comment.comment_id, this.state.post.comment_list[i].contents)}
                                                        >
                                                            <Text style={styles.commentEditBtnText}>저장</Text>
                                                        </TouchableOpacity>
                                                    }
                                                    {this.state.post.comment_list[i].editStatus != true &&
                                                        <TouchableOpacity
                                                            onPress={() => this.editCommentBtn(i)}
                                                        >
                                                            <Text style={styles.commentEditBtnText}>수정</Text>
                                                        </TouchableOpacity>
                                                    }

                                                    <Text style={styles.commentEditBtnTextBetween}> | </Text>
                                                    <TouchableOpacity
                                                        onPress={() => this.deleteComment(comment.comment_id)}
                                                    >
                                                        <Text style={styles.commentEditBtnText}>삭제</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                    )
                                }
                                return (
                                    <View key={i} style={styles.commentView}>
                                        <View style={styles.commentRow}>
                                            <Text style={styles.commentWriter}>{comment.writter_name}</Text>
                                            <Text
                                                style={styles.commentDate}>{Common.modifyDate(comment.written_date)}</Text>
                                        </View>
                                        <View style={styles.commentRow}>
                                            <Text style={styles.commentContents}>{comment.contents}</Text>
                                        </View>
                                    </View>
                                )
                            })}
                            {!StateStore.guest() &&
                                <View style={styles.commentAddRow}>
                                    <TextInput
                                        style={styles.inputComment}
                                        multiline={true}
                                        numberOfLines={3}
                                        value={this.state.comment}
                                        onChangeText={(comment) => this.setState({ comment: comment })}
                                        placeholder={'댓글 내용'}
                                        placeholderTextColor="#FFFFFF"
                                        autoCapitalize='none'
                                        autoCorrect={false}
                                        maxLength={1000}
                                        returnKeyType='next'
                                        numberOfLines={5}
                                        multiline={true}
                                        blurOnSubmit={false}
                                        ref='CommentInput'
                                        onSubmitEditing={() => {
                                            this.setState({ comment: (this.state.comment + '\n') });
                                            this.refs.CommentInput.focus();
                                        }}
                                    />
                                    <TouchableHighlight
                                        style={styles.commentBtn}
                                        underlayColor={'#000000'}
                                        onPress={() => this.addComment()}
                                    >
                                        <Text style={styles.commentBtnText}>등록</Text>
                                    </TouchableHighlight>
                                </View>
                            }
                        </View>
                    </ScrollView>
                    {/*/////////////////자신이 쓴 게시물일 경우///////////////*/}
                    {/*{this.state.post.possibleEdditAndDelete &&*/}
                    {/*<TouchableOpacity*/}
                    {/*style={styles.editBtn}*/}
                    {/*onPress={() => this.editPost(this.props.post_id)}*/}
                    {/*>*/}
                    {/*<Text style={styles.editBtnText}>수정</Text>*/}
                    {/*</TouchableOpacity>*/}
                    {/*}*/}
                </View>
            );
        } else {
            return (
                <LoadingIcon visible={true}/>
            );
        }
    }
}

const wid = Common.winWidth();
const hei = Common.winHeight();
const commentBtnHeight = 0.13 * hei;
var styles = StyleSheet.create({
    frame: {
        paddingTop: 20,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 0.13 * hei,
        opacity: 0.8,
    },
    title: {
        width: 0.5 * wid,
        fontSize: 18,
        color: '#FFFFFF',
        opacity: 0.8,
        marginBottom: 15,
    },
    date: {
        width: 0.4 * wid,
        fontSize: 13,
        color: '#FFFFFF',
        opacity: 0.8,
        textAlign: 'right',
        marginBottom: 5,
    },
    name: {
        fontSize: 14,
        color: '#FFECDA',
        opacity: 0.8,
        textAlign: 'right',
        marginBottom: 15,
    },
    contentsWrapper: {
        borderTopWidth: 0.5,
        borderColor: '#FFFFFF',
        marginBottom: 20,
        paddingTop: 15,
        minHeight: 100,
    },
    content: {
        fontSize: 15,
        color: '#FFFFFF',
        opacity: 0.8,
    },
    commentLength: {
        fontSize: 15,
        color: '#DBCEFF',
        opacity: 0.9,
        paddingLeft: 10,
        marginBottom: 10,
    },
    likeBtn: {
        fontSize: 16,
        color: '#FFFFFF',
        opacity: 0.9,
        paddingRight: 10,
        marginBottom: 10,
    },
    likeCancelBtn: {
        fontSize: 16,
        color: '#DBCEFF',
        opacity: 0.9,
        paddingRight: 10,
        marginBottom: 10,
    },
    commentView: { //댓글 뷰
        borderColor: '#FFFFFF',
        borderWidth: 0.5,
        borderRadius: 12,
        padding: 10,
        marginBottom: 5,
    },
    commentRow: { //글쓴이, 날짜 뷰
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    commentContentRow: { //댓글내용 수정 삭제 버튼 뷰
        marginTop: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    commentWriter: {
        fontSize: 16,
        color: '#FFECDA',
        opacity: 0.9,
    },
    commentDate: {
        fontSize: 13,
        color: '#FFFFFF',
        opacity: 0.7,
    },
    commentContents: {
        maxWidth: 0.5 * wid,
        fontSize: 15,
        color: '#FFFFFF',
        opacity: 0.8,
    },
    inputEditComment: {
        width: 0.5 * wid,
        height: 0.09 * hei,
        color: '#FFFFFF',
        padding: 10,
        paddingTop: 5,
        borderColor: '#FFFFFF',
        borderWidth: 1,
        borderRadius: 7,
        backgroundColor: 'transparent',
        opacity: 0.5,
        fontSize: 13,
    },
    commentEditBtnText: { //수정/삭제
        fontSize: 15,
        fontWeight: '600',
        color: '#FFC9C3',
        opacity: 0.8,
    },
    commentEditBtnTextBetween: { //수정/삭제 사이의 |
        fontSize: 15,
        fontWeight: '700',
        color: '#FFFFFF',
        opacity: 0.8,
        marginTop: -3,
    },
    commentAddRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
    },
    inputComment: {
        width: 0.64 * wid,
        height: commentBtnHeight,
        fontSize: 15,
        color: '#FFFFFF',
        padding: 10,
        borderColor: '#FFFFFF',
        borderWidth: 1,
        borderRadius: 12,
        alignSelf: 'center',
        backgroundColor: 'transparent',
        opacity: 0.65,
    },
    commentBtn: {
        width: 0.24 * wid,
        height: commentBtnHeight,
        borderWidth: 1,
        borderRadius: 12,
        borderColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.65
    },
    commentBtnText: {
        color: '#FFFFFF',
        fontSize: 15
    },
});
