/**
 * Created by kusob on 2017. 8. 12..
 */

import React, { Component } from 'react';
import {WebView} from 'react-native';

export default class PrivatePolicy extends Component {
    render() {
        return (
            <WebView
                source={{ uri: "http://blog.naver.com/holein0ne/221072640549" }}
            />
        );
    }
}