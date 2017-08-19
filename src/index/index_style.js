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
    container: { 
        flex: 1,
        justifyContent: 'center',
    },
    backgroundImg: { //background image
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    loginContainer: { //wrapper
        alignItems: 'center',
        justifyContent: 'center',
    },
    row: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        width: '100%',
        height: '10%',
        opacity: 0.6,
    },
    logo: {
        width: 0.4 * wid,
        height: 0.4 * wid,
        opacity: 0.7,
    },
    logoTextWrapper: {
        marginTop: 10,
        marginBottom: 50,
    },
    logoText: {
        color: '#FFFFFF',
        fontSize: 18,
        opacity: 0.7,
    },
    logoTextHighlight: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '500',
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
        width: 0.65 * wid,
        height: 50,
        fontSize: 15,
        color: '#FFFFFF',
        padding: 10,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 40,
        marginRight: -25,
        borderColor: '#FFFFFF',
        borderWidth: 1,
        borderRadius: 15,
        alignSelf: 'center',
        backgroundColor: '#000000',
        marginBottom: 5,
        opacity: 0.2
    },
    autoLoginCheckBox: {
        width: 0.5 * wid,
        marginTop: 5,
        marginBottom: 10
    },
    autoLoginLabel: {
        opacity: 0.7,
        color: '#FFFFFF',
        fontSize: 14,
    },
    autoLoginBox: {
        opacity: 0.7,
        width: 14,
        height: 14
    },
    noIconInput: {
        width: 240,
        height: 50,
        fontSize: 15,
        color: '#FFFFFF',
        padding: 10,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 20,
        marginRight: -25,
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
    label: { //버튼텍스트
        minWidth: 70,
        alignSelf: 'center',
        textAlign: 'center',
        fontSize: 12,
        fontWeight: '600',
        color: '#FFFFFF',
        opacity: 0.8
    },

    authBtn: {
        maxWidth: 118,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderWidth: 1,
        borderRadius: 20,
        borderColor: '#FFFFFF',
        padding: 8,
        marginTop: 4,
        marginBottom: 8,
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
    viewPolicyBtnText:{
        borderColor:'#FFFFFF',
        opacity:0.7,
        borderWidth:1,
        borderRadius:15,
        justifyContent:'center',
        textAlign:'center',
        color:'#FFFFFF',
        padding:10,
        fontSize:17,
        fontWeight:'600',
        marginVertical:10,
    },
});

export default styles;