import { StyleSheet } from "react-native";
import { COLORS, FONT, SIZES } from "../../constants";

const styleFonts = StyleSheet.create({
  container: {
    width: "100%",
  },
  subtitle: {
    fontFamily: FONT.playfairMedium,
    fontSize: SIZES.large,
    color: COLORS.colorSubtitle,
  },
  title: {
    fontFamily: FONT.RobotoSlabBold,
    fontSize: SIZES.xLarge,
    color: COLORS.colorTitle,
    marginTop: 2,
  },  
  titleH2: {
    fontFamily: FONT.RobotoSlabBold,
    fontSize: SIZES.medium,
    color: COLORS.colorTitle,
    marginTop: 2,
  },
  subtitleH2: {
    fontFamily: FONT.playfairMedium,
    fontSize: SIZES.small,
    color: COLORS.colorSubtitle,
    marginTop: 2,
  },
  hastag: {
    bold:true,
    fontSize: SIZES.xxLarge,
    color: COLORS.green,
    marginTop: 2,

  },
  subHastag: {
    bold:true,
    fontSize: SIZES.xLarge,
    color: COLORS.green,
    marginTop: 2,

  },
  label:{
    fontFamily: FONT.bold,
    fontSize: SIZES.medium,
    color: COLORS.gray,
    width:"100%",
    borderBottomWidth:2,
    borderBottomColor:COLORS.gray
  },
  messageH2:{
    fontFamily: FONT.RobotoMedium,
    fontSize: SIZES.large,
    color: COLORS.colorTitle,
  },
  message:{
    fontFamily: FONT.RobotoMedium,
    fontSize: SIZES.medium,
    color: COLORS.colorTitle,
  },
  verse:{
    fontFamily: FONT.RobotoMedium,
    fontSize: SIZES.medium,
    fontStyle: 'italic',
    color: '#000',
  },
  verseRef:{
    fontFamily: FONT.RobotoMedium,
    fontSize: SIZES.medium,
    fontWeight:'bold',
    color: '#000',
  },
  footerMessage:{
    fontFamily: FONT.RobotoMedium,
    fontSize: SIZES.small,
    color: COLORS.tertiary,
    marginTop: 2,
  },
  headerMessage: {
    fontFamily: FONT.RobotoMedium,
    fontSize: SIZES.large,
    color: COLORS.primary,
  },
  navbarTitle:{
    flex:1,
    fontFamily: FONT.bold,
    fontSize: SIZES.xLarge,
    color: COLORS.primary,
    color:"#ffffff",
  },
  dateMsg:{
    flex:1,
    fontFamily: FONT.RobotoMedium,
    fontSize: SIZES.xSmall,
    color:"#898989",
  },
  authorMsg:{
    flex:1,
    fontFamily: FONT.RobotoMedium,
    fontSize: SIZES.small,
    color:"#000000",
  },
  contentMsg:{
    flex:1,
    fontFamily: FONT.RobotoMedium,
    fontSize: SIZES.small,
    color:"#000000",
  },
  dateMsg:{
    flex:1,
    fontFamily: FONT.RobotoSlabBold,
    fontSize: SIZES.xSmall,
    color:"#898989",
    fontStyle:'italic'
  },
  navbarSubtitle:{
    fontFamily: FONT.RobotoMedium,
    fontSize: SIZES.small,
    color:COLORS.gray2,
  }});

  export default styleFonts;
