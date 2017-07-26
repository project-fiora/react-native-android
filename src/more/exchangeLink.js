/**
 * Created by kusob on 2017. 7. 19..
 */
import React, {Component} from 'react';
import {
    Image,
    StyleSheet,
    Text, TouchableOpacity,
    View
} from 'react-native';
import {Actions} from 'react-native-router-flux';

export default class exchangeLink extends Component {
    constructor(props) {
        super(props);

        this.state = {
            siteList:[
                {name:'코인원', link:'https://coinone.co.kr/'},
                {name:'빗썸', link:'https://www.bithumb.com/'},
                {name:'코빗', link:'https://www.korbit.co.kr/'},
                {name:'Poloniex', link:'https://poloniex.com/'}
            ],
        };
    }

    componentDidMount() {

    }

    render() {
        return (
            <View style={styles.box}>
                {this.state.siteList.map((site, i) => {
                    return (<LinkBtn name={site.name}
                                     link={site.link}
                                       key={i}/>);
                })}
            </View>
        );
    }
}

class LinkBtn extends Component {
    goTo() {
        Actions.main({goTo:'exchangeSite', siteName:this.props.name, link:this.props.link});
    }

    render() {
        return (
            <View style={styles.btn}>
                <TouchableOpacity
                    underlayColor={'#AAAAAA'}
                    onPress={() => this.goTo()}
                >
                    <Text style={styles.menuText}>
                        {this.props.name}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
}

var styles = StyleSheet.create({
    box: {
        // borderBottomWidth: 0.5,
        // borderColor: '#A0A0A0',
    },
    btn: {
        borderBottomWidth: 0.5,
        borderColor: '#FFFFFF',
        padding: 20,
    },
    menuText: {
        backgroundColor: 'transparent',
        fontSize: 17,
        color: 'white',
        opacity: 0.9
    }
});
