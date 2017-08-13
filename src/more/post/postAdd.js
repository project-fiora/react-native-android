/**
 * Created by kusob on 2017. 6. 28..
 */

import React, { Component } from 'react';
import {
    StyleSheet, ScrollView,
    TextInput, View,
} from 'react-native';

import Common from "../../common/common";
import StateStore from "../../common/stateStore";
import LoadingIcon from "../../common/loadingIcon";

export default class PostAdd extends Component {
    constructor(props) {
        super(props);

        this.state = {
            post_id: '',
            title: '',
            contents: '',
        };
    }

    componentDidMount() {
        if (this.props.post_id != undefined) { //글수정인경우
            StateStore.setPostId(this.props.post_id);
            StateStore.setPostTitle(StateStore.edit_postTitle());
            StateStore.setPostContents(StateStore.edit_postContents());
            this.setState({
                title: StateStore.edit_postTitle(),
                contents: StateStore.edit_postContents(),
            });
        }
    }

    render() {
        return (
            <ScrollView>
                <ScrollView
                    pointerEvents={StateStore.loaded()}
                    contentContainerStyle={styles.frame}>
                    {StateStore.loaded() == 'none' &&
                        <LoadingIcon />
                    }
                    <TextInput
                        style={styles.input}
                        value={this.state.title}
                        onChangeText={(title) => {
                            this.setState({ title: title });
                            StateStore.setPostTitle(title);
                        }}
                        placeholder={'제목'}
                        placeholderTextColor="#FFFFFF"
                        autoCapitalize='none'
                        autoCorrect={false}
                        multiline={false}
                        autoFocus={true}
                    />
                    <TextInput
                        style={styles.inputContent}
                        value={this.state.contents}
                        onChangeText={(contents) => {
                            this.setState({ contents: contents });
                            StateStore.setPostContents(contents);
                        }}
                        placeholder={'1000자 이내로 입력해주세요'}
                        placeholderTextColor="#FFFFFF"
                        autoCapitalize='none'
                        autoCorrect={false}
                        maxLength={1000}
                        returnKeyType='next'
                        numberOfLines={5}
                        multiline={true}
                        blurOnSubmit={false}
                        ref='ContentInput'
                        onSubmitEditing={() => {
                            this.setState({ contents:(this.state.contents+'\n') });
                            this.refs.ContentInput.focus();
                        }}
                    />

                    {/*<TouchableHighlight*/}
                    {/*style={styles.attachBtn}*/}
                    {/*underlayColor={'#000000'}*/}
                    {/*onPress={*/}
                    {/*() => {*/}
                    {/*this.removePost();*/}
                    {/*}*/}
                    {/*}*/}
                    {/*>*/}
                    {/*<Text style={styles.btnText}>첨부파일</Text>*/}
                    {/*</TouchableHighlight>*/}
                </ScrollView>
            </ScrollView>
        );
    }
}

const dpi = Common.getRatio();
const wid = Common.winWidth();
const hei = Common.winHeight();
const navArrowSize = 40;
const navArrowWrapperSize = navArrowSize + 10;
var styles = StyleSheet.create({
    frame: {
        paddingTop: 10 * dpi,
    },
    inputContent: {
        width: 0.75 * wid,
        // height: 350 * dpi,
        fontSize: 15 * dpi,
        color: '#FFFFFF',
        padding: 15 * dpi,
        paddingTop: 15 * dpi,
        borderColor: '#FFFFFF',
        borderWidth: 1 * dpi,
        borderRadius: 15 * dpi,
        alignSelf: 'center',
        backgroundColor: 'transparent',
        marginBottom: 5 * dpi,
        opacity: 0.7
    },
    input: { //입력칸
        width: 0.75 * wid,
        height: 0.075 * hei,
        fontSize: 15 * dpi,
        color: '#FFFFFF',
        padding: 15 * dpi,
        borderColor: '#FFFFFF',
        borderWidth: 1 * dpi,
        borderRadius: 15 * dpi,
        alignSelf: 'center',
        backgroundColor: 'transparent',
        marginBottom: 5 * dpi,
        opacity: 0.7
    },
    attachBtn: {
        width: 0.2 * wid,
        padding: 15 * dpi,
        height: 0.04 * hei,
        borderColor: '#FFFFFF',
        borderWidth: 1 * dpi,
        borderRadius: 15 * dpi,
        alignSelf: 'center',
        backgroundColor: 'transparent',
        opacity: 0.7
    },
    btnText: {
        textAlign: 'center',
        color: '#FFFFFF',
        fontSize: 16 * dpi,
        opacity: 0.9
    },
});
