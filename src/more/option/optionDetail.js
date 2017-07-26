/**
 * Created by kusob on 2017. 7. 2..
 */

import React, {Component} from 'react';
import {
    Image,
    StyleSheet, Text,
    View
} from 'react-native';

import TabButton from '../../common/tapButton';

export default class OptionDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title:this.props.title,
        };
    }

    render() {
        return (
                <View style={styles.frame}>
                    {/*<Text style={styles.summaryTitle}>*/}
                        {/*{this.state.title}*/}
                    {/*</Text>*/}
                    {/*<Text style={c_style.txt}>*/}
                        {/*{ this.state.content.split('\\n').map( (line, i) => {*/}
                            {/*return (<Text key={i}>{line}{'\n'}</Text>)*/}
                        {/*})*/}
                        {/*}*/}
                    {/*</Text>*/}
                </View>
        );
    }
}

var styles = StyleSheet.create({
    frame: {
        flex:1,
        paddingTop:70,
        paddingRight:30,
        paddingLeft:30,
        paddingBottom:30,
    },
    title:{
        backgroundColor:'transparent',
        fontSize: 20,
        fontWeight:'500',
        color:'white',
        opacity:0.8,
        marginBottom:15,
    },
    content:{
        backgroundColor:'transparent',
        fontSize: 17,
        color:'white',
        opacity:0.8,
    },
});
