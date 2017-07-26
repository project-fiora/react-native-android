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

export default class Option extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }

    render() {
        return (
            <View>
                <View style={styles.box}>
                    <OptionBtn title="기타"/>
                </View>
            </View>
        );
    }
}

class OptionBtn extends Component {
    goTo(title) {
        Actions.main({goTo:'optionDetail', title:title});
    }

    render() {
        return (
            <View style={styles.btn}>
                <TouchableOpacity
                    underlayColor={'#AAAAAA'}
                    onPress={() => this.goTo(this.props.title)}
                >
                    <Text style={styles.menuText}>
                        <Image source={this.props.img} style={styles.menuIcon}/>
                        {this.props.title}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
}

var styles = StyleSheet.create({
    frame: {
        flex: 1,
    },
    box: {
        // borderBottomWidth: 0.5,
        // borderColor: '#A0A0A0',
    },
    btn: {
        borderBottomWidth: 0.5,
        borderColor: '#FFFFFF',
        padding: 20,
    },
    menuIcon: {
        resizeMode:'stretch',
        width: 17,
        height: 17,
        marginTop:4,
        opacity:0.7
    },
    menuText: {
        backgroundColor:'transparent',
        fontSize: 17,
        color:'white',
        opacity:0.9
    }
});
