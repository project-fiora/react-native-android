/**
 * Created by kusob on 2017. 7. 19..
 */
import React, {Component} from 'react';
import {
    WebView,
} from 'react-native';

export default class exchangeSite extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }

    render() {
        return (
            <WebView
                source={{uri: this.props.link}}
                // style={{marginTop: 20}}
            />
        );
    }
}
