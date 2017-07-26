/**
 * Created by kusob on 2017. 6. 26..
 */
import React, {Component} from 'react';
import {ImageBackground, AsyncStorage} from 'react-native';
import {Actions} from 'react-native-router-flux';
import realm from '../common/realm';

import styles from './index_style';
import Join from './join';
import Login from './login';




export default class Title extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentPage: 'title',
        };
    }

    getCurrentPage() {
        return this.state.currentPage;
    }

    titlePage() {
        this.setState({currentPage: 'title'});
    }

    joinPage() {
        this.setState({currentPage: 'join'});
    }

    render() {
        return (
            <ImageBackground imageStyle={styles.backgroundImg} source={require('../common/img/background2.png')}
                             style={styles.container}>
                {this.state.currentPage === 'title' &&
                <Login goJoinPage={this.joinPage.bind(this)}/>
                }

                {this.state.currentPage === 'join' &&
                <Join
                    goTitlePage={this.titlePage.bind(this)}
                    getCurrentPage={this.getCurrentPage.bind(this)}
                />
                }
            </ImageBackground>
        );
    }
}

