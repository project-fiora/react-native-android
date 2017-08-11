import React, {Component} from 'react';
import {Dimensions, AsyncStorage} from 'react-native';
import {Actions} from 'react-native-router-flux';
import PrivateAddr from "../../common/private/address";
import StateStore from '../../common/stateStore';


class Common extends Component {
    static async writePost() {
        if(StateStore.postTitle()==""||StateStore.postTitle()==undefined){
            alert("제목을 입력하세요!");
            return false;
        }
        if(StateStore.postContents()==""||StateStore.postContents()==undefined){
            alert("내용을 입력하세요!");
            return false;
        }
        try {
            StateStore.setLoaded('none');
            await AsyncStorage.getItem('Token', (err, result) => {
                if (err != null) {
                    alert(err);
                    return false;
                }
                const token = JSON.parse(result).token;
                // POST /api/post/postcreate
                fetch(PrivateAddr.getAddr() + 'post/postcreate', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': token,
                    },
                    body: JSON.stringify({
                        title: StateStore.postTitle(),
                        contents: StateStore.postContents().replace(/\n/g, "\\n"),
                    })
                }).then((response) => {
                    return response.json()
                }).then((responseJson) => {
                    if (responseJson.message == "SUCCESS") {
                        alert('글쓰기 성공!');
                        Actions.main({goTo: 'post'});
                    } else {
                        alert('오류가 발생했습니다.\n다시 시도해주세요!');
                    }
                }).catch((error) => {
                    alert('Network Connection Failed');
                    console.error(error);
                    return false;
                }).done(()=>StateStore.setLoaded(null));
            });
        } catch (err) {
            alert(err);
            return false;
        } finally {

        }
    }

    static async editPost(){
        try {
            StateStore.setLoaded('none');
            await AsyncStorage.getItem('Token', (err, result) => {
                if (err != null) {
                    alert(err);
                    return false;
                }
                const token = JSON.parse(result).token;
                fetch(PrivateAddr.getAddr() + 'post/posteddit', {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': token
                    },
                    body: JSON.stringify({
                        post_id: StateStore.postId(),
                        title: StateStore.postTitle(),
                        contents: StateStore.postContents().replace(/\n/g, "\\n"),
                    })
                }).then((response) => {
                    return response.json()
                }).then((responseJson) => {
                    if (responseJson.message == "SUCCESS") {
                        alert('수정 성공!');
                        Actions.main({goTo:'postRead', post_id:StateStore.postId()});
                    } else {
                        alert('오류가 발생했습니다.\n다시 시도해주세요!');
                    }
                }).catch((error) => {
                    alert('Network Connection Failed');
                    console.error(error);
                }).done();
            });
        } catch (err) {
            alert('수정실패 ' + err);
            return false;
        } finally {
            StateStore.setLoaded(null);
        }
    }
}

export default Common