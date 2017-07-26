/**
 * Created by kusob on 2017. 7. 2..
 */

import React, {Component} from 'react';
import {
    StyleSheet, Text,
    View
} from 'react-native';

export default class NoticeDetail extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.frame}>
                <Text style={styles.dateTime}>
                    {this.props.date}
                </Text>
                {this.props.content.includes('\\n') == true &&
                    this.props.content.split('\\n').map((line, i) => {
                        return (<Text style={styles.txt} key={i}>{line}{'\n'}</Text>)
                    })
                }
                {this.props.content.includes('\\n') == false &&
                    <Text style={styles.txt}>{this.props.content}</Text>
                }
            </View>
        );
    }
}

var styles = StyleSheet.create({
    frame: {
        padding: 30,
    },
    summaryTitle: {
        textAlign: 'center',
        color: '#FFFFFF',
        opacity: 0.8,
        fontSize: 20,
    },
    dateTime: {
        textAlign: 'right',
        color: '#FFFFFF',
        opacity: 0.8,
        fontSize: 15,
        marginBottom: 15,
    },
    txt: {
        color: '#FFFFFF',
        opacity: 0.8,
        fontSize: 17,
    },
});
