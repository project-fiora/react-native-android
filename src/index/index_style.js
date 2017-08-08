/**
 * Created by kusob on 2017. 7. 4..
 */

import {
    StyleSheet,
} from 'react-native';
import Common from "../common/common";

const dpi = Common.getRatio();
const wid = Common.winWidth();
const hei = Common.winHeight();
const styles = StyleSheet.create({
    container: { //background image
        flex: 1,
        justifyContent: 'center',
    },
    backgroundImg: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    loginContainer: { //wrapper
        alignItems: 'center',
    },
    row: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        width: '100%',
        height: '15%',
        opacity: 0.6,
    },
    logo: {
        width: 0.4 * wid,
        height: 0.4 * wid,
        opacity: 0.7,
    },
    logoTextWrapper: {
        marginTop: 10 * dpi,
        marginBottom: 50 * dpi,
    },
    logoText: {
        color: '#FFFFFF',
        fontSize: 18 * dpi,
        opacity: 0.7,
    },
    logoTextHighlight: {
        color: '#FFFFFF',
        fontSize: 18 * dpi,
        fontWeight: '500',
    },
    // mainIcon: { //MEMBER LOG-IN Image
    //     width: '50%',
    //     height: '25%',
    //     opacity: 0.6
    // },
    inputWrapper: { //입력칸과 아이콘 wrapper
        flexDirection: 'row',
    },
    inputTextIcon: {
        width: 15 * dpi,
        height: 15 * dpi,
        marginRight: -33 * dpi,
        marginTop: 17 * dpi,
        opacity: 0.4
    },
    input: { //입력칸
        width: 0.65 * wid,
        fontSize: 15 * dpi,
        color: '#FFFFFF',
        padding: 10 * dpi,
        paddingTop: 10 * dpi,
        paddingBottom: 10 * dpi,
        paddingLeft: 40 * dpi,
        marginRight: -25 * dpi,
        height: 50 * dpi,
        borderColor: '#FFFFFF',
        borderWidth: 1 * dpi,
        borderRadius: 15 * dpi,
        alignSelf: 'center',
        backgroundColor: '#000000',
        marginBottom: 5 * dpi,
        opacity: 0.2
    },
    autoLoginCheckBox: {
        width: 0.5 * wid,
        marginTop: 5 * dpi,
        marginBottom: 10 * dpi
    },
    autoLoginLabel: {
        opacity: 0.7,
        color: '#FFFFFF',
        fontSize: 14 * dpi,
    },
    autoLoginBox: {
        opacity: 0.7,
        width: 14 * dpi,
        height: 14 * dpi
    },
    noIconInput: {
        width: 240 * dpi,
        fontSize: 15 * dpi,
        color: '#FFFFFF',
        padding: 10 * dpi,
        paddingTop: 10 * dpi,
        paddingBottom: 10 * dpi,
        paddingLeft: 20 * dpi,
        marginRight: -25 * dpi,
        height: 50 * dpi,
        borderColor: '#FFFFFF',
        borderWidth: 1 * dpi,
        borderRadius: 15 * dpi,
        alignSelf: 'center',
        backgroundColor: '#000000',
        marginBottom: 5 * dpi,
        opacity: 0.2
    },
    button: { //버튼
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1 * dpi,
        borderRadius: 20 * dpi,
        borderColor: '#FFFFFF',
        padding: 8 * dpi,
        margin: 4 * dpi,
        opacity: 0.6
    },
    label: { //버튼텍스트
        width: 70 * dpi,
        alignSelf: 'center',
        textAlign: 'center',
        fontSize: 12 * dpi,
        fontWeight: '600',
        color: '#FFFFFF',
        opacity: 0.8
    },

    authBtn: {
        maxWidth: 118 * dpi,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderWidth: 1 * dpi,
        borderRadius: 20 * dpi,
        borderColor: '#FFFFFF',
        padding: 8 * dpi,
        marginTop: 4 * dpi,
        marginBottom: 8 * dpi,
        opacity: 0.8
    },
    authLabel: { //버튼텍스트
        width: 100 * dpi,
        alignSelf: 'center',
        textAlign: 'center',
        fontSize: 13 * dpi,
        fontWeight: '600',
        color: '#FFFFFF',
        opacity: 0.9
    },
    agreeText: {
        backgroundColor: 'transparent',
        color: '#FFFFFF',
        fontSize: 17 * dpi,
        marginTop: 10 * dpi,
        fontWeight: "900",
    },
    loadingIcon: {
        position: 'absolute',
        width: 40 * dpi,
        height: 40 * dpi,
        alignSelf: 'center',
        marginTop: 40 * dpi,
    },
});

export default styles;