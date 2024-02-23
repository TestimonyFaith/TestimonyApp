import { StyleSheet } from "react-native";
import { COLORS, FONT, SIZES } from "../../constants";

const styles = StyleSheet.create({
    container: {
        width: "100%",
    },
    logo:{
        width:50,
        height:50,
        padding:10,
        margin:10
    },
    logoHead:{
        width:30,
        height:30,
        padding:3,
        marginTop:10
    },
    imgMsg:{
        width:150,
        height:150,
        padding:2,
        margin:2,
        borderRadius:10
    },
    imgMsgAlone:{
        width:200,
        height:200,
        padding:2,
        margin:2,
        borderRadius:10
    },
    imgMsgBuffer:{
        width:50,
        height:50,
        padding:2,
        margin:2,
        borderRadius:5
    },
    buttonSecondary: {
        alignItems: 'center',
        backgroundColor: '#DEDEDE',
        padding: 10,
        fontFamily: FONT.regular,
        fontSize: SIZES.medium,
        color: COLORS.lightWhite,
        fontWeight:"bold",
        borderRadius:5,
        width:'50%',
        shadowColor: "#000000",
        shadowOffset: {
        width: 0,
        height: 3,
        },
        shadowOpacity:  0.17,
        shadowRadius: 3.05,
        elevation: 4
    },
    button: {
        alignItems: 'center',
        backgroundColor: COLORS.green,
        padding: 10,
        fontFamily: FONT.regular,
        fontSize: SIZES.medium,
        color: COLORS.lightWhite,
        fontWeight:"bold",
        borderRadius:5,
        width:"80%",
        shadowColor: "#000000",
        shadowOffset: {
        width: 0,
        height: 3,
        },
        shadowOpacity:  0.17,
        shadowRadius: 3.05,
        elevation: 4
    },
    buttonDash: {
        backgroundColor: COLORS.green,
        padding: 10,
        fontFamily: FONT.regular,
        fontSize: SIZES.medium,
        color: COLORS.lightWhite,
        fontWeight:"bold",
        borderRadius:5,
        width:"50%",
        shadowColor: "#000000",
        shadowOffset: {
        width: 0,
        height: 3,
        },
        shadowOpacity:  0.17,
        shadowRadius: 3.05,
        elevation: 4
    },
    buttonTextDash: {
        color:COLORS.lightGrayMsg,
        fontSize:10
    },
    buttonThird: {
        alignItems: 'center',
        backgroundColor: COLORS.green,
        padding: 10,
        fontFamily: FONT.regular,
        fontSize: SIZES.medium,
        color: COLORS.lightWhite,
        fontWeight:"bold",
        borderRadius:5,
        width:'50%',
        shadowColor: "#000000",
        shadowOffset: {
        width: 0,
        height: 3,
        },
        shadowOpacity:  0.17,
        shadowRadius: 3.05,
        elevation: 4
    },
    textButtonSecondary:{
        fontWeight:"bold",
        color:'#ffffff'
    },
    textButton:{
        fontWeight:"bold",
        color:"#fff"
    },
    buttonIcon: {
        alignItems: 'center',
        backgroundColor: COLORS.red,
        padding: 10,
        fontFamily: FONT.regular,
        fontSize: SIZES.medium,
        color: COLORS.lightWhite,
        fontWeight:"bold",
        borderRadius:5,
        width:40,
        height:40,
        shadowColor: "#000000",
        shadowOffset: {
        width: 0,
        height: 3,
        },
        shadowOpacity:  0.17,
        shadowRadius: 3.05,
        elevation: 4
    },
    buttonTab: {
        alignItems: 'center',
        backgroundColor: COLORS.darkGrey,
        padding: 10,
        fontFamily: FONT.regular,
        fontSize: SIZES.medium,
        color: COLORS.lightWhite,
        fontWeight:"bold",
        borderRadius:5,
        width:"80%",
        shadowColor: "#000000",
        shadowOffset: {
        width: 0,
        height: 3,
        },
        shadowOpacity:  0.17,
        shadowRadius: 3.05,
        elevation: 4
    },
    input: {
        height: 40,
        margin: 12,
        borderBottomWidth: 2,
        padding: 10,
        width:"80%",
    },
    link:{
        height: 40,
        margin: 12,
        borderBottomWidth: 2,
        padding: 10,
        width:"80%",
    },
});

export default styles;
