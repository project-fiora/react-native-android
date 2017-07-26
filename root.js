/**
 * Created by kusob on 2017. 6. 28..
 */

import React,{ Component } from 'react';

import {Scene, Router} from 'react-native-router-flux';

import Title from './src/index/title';
import Main from './src/index/main';
import Scanner from "./src/common/scanner";

export default class Root extends Component {
    render() {
        return(
            <Router duration={0}>
                <Scene key="root" direction="vertical" hideNavBar>
                    <Scene key="title" component={Title} initial={true}/>
                    <Scene key="main" component={Main}/>
                    <Scene key="scanner" component={Scanner}/>
                </Scene>
            </Router>
        );
    }
}