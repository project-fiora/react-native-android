/**
 * Created by kusob on 2017. 6. 26..
 */
import React, {Component} from 'react';
import {
    Image,
    StyleSheet,
    Text, TouchableOpacity,
    View
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import PrivateAddr from '../../common/private/address';
import Common from "../../common/common";
import LoadingIcon from "../../common/loadingIcon";

export default class Notice extends Component {
    constructor(props) {
        super(props);

        this.state = {
            load: false,
            noticeList: [],
        };
    }

    componentDidMount() {
        this.getList();
    }

    getList() {
        fetch(PrivateAddr.getAddr() + "notice/noticelist")
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.message == "SUCCESS") {
                    this.setState({noticeList: responseJson.list, load: true});
                } else {
                    Common.alert('공지사항을 불러오지 못했습니다.');
                }
            })
            .catch((error) => {
                alert('Network Connection Fail : '+error);
                console.error(error);
            });
    }

    render() {
        return (
            <View style={styles.box}>
                {this.state.load==false &&
                <LoadingIcon/>
                }
                {this.state.load==true &&
                    this.state.noticeList.reverse().map((notice, i) => {
                    return (<NoticeBtn title={notice.title}
                                       content={notice.contents}
                                       date={notice.create_date}
                                       key={i}/>);
                })
                }
            </View>
        );
    }
}

class NoticeBtn extends Component {
    goTo(id, title, content, date) {
        Actions.main({goTo: 'noticeDetail', id: id, title: title, content: content, date: date});
    }

    render() {
        return (
            <View style={styles.btn}>
                <TouchableOpacity
                    underlayColor={'#AAAAAA'}
                    onPress={() =>
                        this.goTo(this.props.id, this.props.title, this.props.content, this.props.date)
                    }
                >
                    <Text style={styles.menuText}>
                        {this.props.title}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const dpi = Common.getRatio();
var styles = StyleSheet.create({
    btn: {
        flexDirection:'row',
        borderBottomWidth: 0.5,
        borderColor: '#FFFFFF',
        padding: 20*dpi,
    },
    menuText: {
        backgroundColor: 'transparent',
        fontSize: 17*dpi,
        color: 'white',
        opacity: 0.9
    }
});
