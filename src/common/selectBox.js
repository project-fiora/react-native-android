
import React, { Component } from 'react';
import {
    StyleSheet, Dimensions,
    Text, TouchableOpacity,
    View, AsyncStorage
} from 'react-native';

/** 
 * created by kusob
 * github.com/kusob
 * boseokjung@gmail.com
 * 
 * how to use
 * import SelectBox from "./selectBox";
 * <SelectBox 
    list={this.state.TYPE} //selectBox list, array or object array
    selectBoxText={null}  
    //if your list is object, selectBoxText's value == something print Variable in the object.
    // ex) obj={id,:1, name:"boseok"} than selectBoxText="name" (variable name)
    
    // ex2) <SelectBox 
                    list={[{id:1, name:"boseok1"},{id:2, name:"boseok2"}]} //Array or [Object]
                    currentItem={1} //selected "boseok2", currentItem={0} will select "boseok1"
                    selectBoxText="name" // <= this will show your list.name on selectBox list
                    selectStyle={{styles}}
                    optionStyle={{styles}}
                    fontSize={15} //default == 17
                    icon="text" //default == ▼
                    />
    onClickBoxFunction={(i)=>{ //i==index
        //some function for onSelect
    }}/>
**/

export default class SelectBox extends Component {
    constructor(props) {
        super(props);

        this.state = {
            onClickBox: false,
            list: this.props.list,
            currentItem: this.props.currentItem,
        };
    }

    showItem(i) {
        this.setState({
            currentItem: i,
            onClickBox: !this.state.onClickBox,
        }, () => {
            if (this.props.onClickBoxFunction != undefined)
                this.props.onClickBoxFunction(i)
        });
    }

    render() {
        return (
            <View>
                <TouchableOpacity
                    onPress={() => this.setState({ onClickBox: !this.state.onClickBox })}
                >
                    <View style={[styles.selectBoxWrapperSingle, this.props.selectStyle]}>
                        <View style={styles.selectBoxRow}>
                            <Text style={[styles.selectBoxText, { fontSize: this.props.fontSize }]}>
                                {this.props.selectBoxText == null ?
                                    <Text>{this.state.list[this.state.currentItem]}</Text>
                                    :
                                    <Text>{this.state.list[this.state.currentItem][this.props.selectBoxText]}</Text>
                                }
                            </Text>
                            <View style={styles.selectBoxIconWrapper}>
                                <Text style={styles.selectIcon}>
                                    {this.props.icon == null ?
                                        <Text>▼</Text>
                                        :
                                        <Text>{this.props.icon}</Text>
                                    }
                                </Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>

                {(() => {
                    if (this.state.onClickBox == true) {
                        return (
                            <View style={[styles.selectBoxWrapper, this.props.optionStyle]}>
                                {this.state.list.map((item, i) => {
                                    var selectedStyle;
                                    if (i == this.state.list.length - 1) { //마지막 아이템은 borderBottomWidth가 없음
                                        selectedStyle = styles.selectBoxWrapperBottom;
                                    } else { //중간은 borderBottomWidth가 있음
                                        selectedStyle = styles.selectBoxWrapperCenter;
                                    }
                                    return (
                                        <View style={selectedStyle} key={i}>
                                            <TouchableOpacity
                                                onPress={() => this.showItem(i)}
                                            >
                                                <View style={styles.selectBoxRow}>
                                                    <Text style={[styles.selectBoxText, { fontSize: this.props.fontSize }]}>
                                                        {this.props.selectBoxText == null ?
                                                            <Text>{item}</Text>
                                                            :
                                                            <Text>{item[this.props.selectBoxText]}</Text>
                                                        }
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    );
                                })}
                            </View>
                        );
                    }
                })()}

            </View>
        )
    }
}

var { height, width } = Dimensions.get('window');
const styles = StyleSheet.create({
    selectBoxWrapperSingle: {
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000',
        width: 0.55 * width,
        opacity: 0.4,
        borderColor: '#FFFFFF',
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    selectBoxWrapper: {
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000',
        width: 0.55 * width,
        opacity: 0.4,
        borderColor: '#FFFFFF',
        borderWidth: 1,
        borderRadius: 12,
    },
    selectBoxWrapperCenter: {
        borderBottomWidth: 1,
        borderColor: '#FFFFFF',
        paddingHorizontal: 16,
        paddingVertical: 10,
        justifyContent: 'center',
        marginTop: -1,
    },
    selectBoxWrapperBottom: {
        borderColor: '#FFFFFF',
        paddingHorizontal: 16,
        padding: 10,
        justifyContent: 'center',
        marginTop: -2,
    },
    selectBoxRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: -3,
    },
    selectBoxText: {
        minHeight:0.03 * height,
        justifyContent:'center',
        alignSelf: 'flex-start',
        color: '#FFFFFF',
        fontSize: 17,
    },
    selectBoxIconWrapper: {
        alignItems: 'flex-end',
    },
    selectIcon: {
        color: '#FFFFFF',
        fontSize: 17,
        opacity: 0.9,
    },
});