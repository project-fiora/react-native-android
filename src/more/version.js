/**
 * Created by kusob on 2017. 6. 28..
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text, TouchableHighlight,
    View
} from 'react-native';

export default class Version extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentVer:'1.0',
            lastestVer:'1.1',
        };
    }

    render() {
        return (
                <View style={styles.frame}>
                    <Text style={styles.centerTxt}>
                        현재버전 v{this.state.currentVer}{'\n'}
                        최신버전 v{this.state.lastestVer}
                    </Text>
                    {(() => {
                        if(this.state.currentVer!=this.state.lastestVer){
                            return(
                                <View style={styles.btnWrapper}>
                                    <TouchableHighlight
                                        style={styles.updateBtn}
                                        underlayColor={'#000000'}
                                        onPress={
                                            () => {
                                                alert('준비중입니다!');
                                            }
                                        }
                                    >
                                        <Text style={styles.btnText}>업데이트</Text>
                                    </TouchableHighlight>
                                </View>
                            );
                        } else{
                            return(
                                <Text style={styles.centerTxt}>
                                    {'\n'}최신버전입니다
                                </Text>
                            );
                        }
                    })()}
                    {/*<TouchableOpacity*/}
                        {/*underlayColor={'#AAAAAA'}*/}
                        {/*onPress={() => alert('준비중입니다.')}*/}
                    {/*>*/}
                        {/*<Text style={c_style.txt}>*/}
                            {/*/!*<Image source={this.props.img} style={styles.menuIcon}/>*!/*/}
                            {/*업데이트*/}
                        {/*</Text>*/}
                    {/*</TouchableOpacity>*/}
                </View>
        );
    }
}

var styles = StyleSheet.create({
    frame:{
          paddingTop:20,
    },
    btnWrapper: {
        marginTop:20,
        alignItems: "center",
    },
    updateBtn: {
        width: 80,
        height: 30,
        borderWidth: 1,
        borderRadius: 20,
        borderColor: '#FFFFFF',
        padding: 5,
        alignItems: 'center',
        opacity:0.6
    },
    btnText: {
        color: '#FFFFFF',
        fontSize: 15
    },
    centerTxt:{
        color:'#FFFFFF',
        opacity:0.8,
        padding:1,
        fontSize:17,
        textAlign:'center',
        // borderWidth:1,
    },
});
