/**
 * Created by kusob on 2017. 7. 4..
 */

import {
    StyleSheet,
} from 'react-native';

const styles = StyleSheet.create({
    container: { //background image
        flex: 1,
        justifyContent: 'center',
        // width: 1000,
        // height: 1000,
        // resizeMode: 'cover',
    },
    backgroundImg: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    loginContainer: { //wrapper
        alignItems: 'center',
    },
    loadingIconWrapper: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    loadingIcon: {
        width: 50,
        height: 50,
    },
    mainIcon: { //MEMBER LOG-IN Image
        width: 130,
        height: 130,
        opacity: 0.6
    },
    inputWrapper: { //입력칸과 아이콘 wrapper
        flexDirection: 'row',
    },
    inputTextIcon: {
        width: 15,
        height: 15,
        marginRight: -33,
        marginTop: 17,
        opacity: 0.4
    },
    input: { //입력칸
        width: 240,
        fontSize: 15,
        color: '#FFFFFF',
        padding: 10,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 40,
        marginRight: -25,
        height: 50,
        borderColor: '#FFFFFF',
        borderWidth: 1,
        borderRadius: 15,
        alignSelf: 'center',
        backgroundColor: '#000000',
        marginBottom: 5,
        opacity: 0.2
    },
    noIconInput: {
        width: 240,
        fontSize: 15,
        color: '#FFFFFF',
        padding: 10,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 20,
        marginRight: -25,
        height: 50,
        borderColor: '#FFFFFF',
        borderWidth: 1,
        borderRadius: 15,
        alignSelf: 'center',
        backgroundColor: '#000000',
        marginBottom: 5,
        opacity: 0.2
    },
    button: { //버튼
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 20,
        borderColor: '#FFFFFF',
        padding: 8,
        margin: 4,
        opacity: 0.6
    },
    authBtn: {
        maxWidth: 118,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 20,
        borderColor: '#FFFFFF',
        padding: 8,
        marginTop: 4,
        marginBottom: 8,
        opacity: 0.8
    },
    label: { //버튼텍스트
        width: 100,
        alignSelf: 'center',
        textAlign: 'center',
        fontSize: 12,
        fontWeight: '600',
        color: '#FFFFFF',
        opacity: 0.8
    },
    authLabel: { //버튼텍스트
        width: 100,
        alignSelf: 'center',
        textAlign: 'center',
        fontSize: 13,
        fontWeight: '600',
        color: '#FFFFFF',
        opacity: 0.9
    },
    agreeText: {
        backgroundColor: 'transparent',
        color: '#FFFFFF',
        fontSize: 17,
        marginTop: 10,
        fontWeight: "900",
    },
    loadingIcon: {
        position: 'absolute',
        width: 40,
        height: 40,
        alignSelf: 'center',
        marginTop: 40,
    },
});

export default styles;