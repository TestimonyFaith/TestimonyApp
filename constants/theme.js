
//font-family: "Gabriela", serif;
const COLORS = {
  primary: "#312651",
  tertiary: "#FF7754",

  gray: "#83829A",
  lightGrayMsg:"#EBE2E2",
  gray2: "#C8C2C0",
  darkGrey: '#C8C8C8',

  colorTitle: "#393939",
  colorSubtitle : "#898989",
  darkGrayMsg:'#595959',

  white: "#F3F4F8",
  lightWhite: "#E9E9E9",
  lightDark: "#082326",
  lightMode: '#ffffff',
  darkMode:'#082326',
  green:'#E0CDA9',
  white:'#ffffff'
  //green:'#156ef6'
  //green:'#2AB7CA' //pas mal non plus
  //green:'#297373' //pas mal vert-Bleu 
  //green: "#db0029", //rouge OK mais trop chalereux
  //green:"#4d4dff" // bleu violet : entre paix, confiance et spiritualité ! NON !
  //green: "#50C878" // pas mal vert 
};

const LABELS = {
  msgConvEmpty : 'Partagez votre foi avec les autres membres !'
}

const IMAGESURL = {
  logoURL : 'https://firebasestorage.googleapis.com/v0/b/testimony-aff22.appspot.com/o/assets%2Ffeather.png?alt=media&token=9f1e0703-91bd-4a3d-b0d6-bb1d63cc19c4'
}

const FONT = {
  calibri:'Calibri',
  gabriela:'Gabriela',
  dmsMedium:'dmsMedium',
  dmsRegular: 'dmsRegular',
  dmsBold:'dmsBold',
  playfairBlack:'playfairBlack',
  playfairBold:'playfairBold',
  playfairMedium:'playfairMedium',
  playfairRegular:'playfairRegular',
  playfairSemiBold:'playfairSemiBold',
  RobotoBlack:'RobotoBlack',
  RobotoMedium:'RobotoMedium',
  RobotoRegular:'RobotoRegular',
  RobotoLight:'RobotoLight',
  RobotoSlabBlack:'RobotoSlabBlack',
  RobotoSlabMedium:'RobotoSlabMedium',
  RobotoSlabLight:'RobotoSlabLight',
  RobotoSlabBold:'RobotoSlabBold',
  RobotoSlabExtraBold:'RobotoSlabExtraBold',
  RobotoSlabSemiBold:'RobotoSlabSemiBold',
}

const SIZES = {
  xSmall: 10,
  small: 12,
  medium: 16,
  large: 20,
  xLarge: 24,
  xxLarge: 32,
};

const SHADOWS = {
  small: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5.84,
    elevation: 5,
  },
};


const THEME = [
  {
    id:0,
    colorAccent:'#156ef6'
  },
  {
    id:1,
    colorAccent:'#2AB7CA'
  },
  {
    id:2,
    colorAccent:'#297373'
  },
  {
    id:3,
    colorAccent:'#db0029'
  },
  {
    id:4,
    colorAccent:'#4d4dff'
  },
  {
    id:5,
    colorAccent:'#50C878'
  },
]


export { COLORS, FONT, SIZES, SHADOWS, LABELS, IMAGESURL, THEME };
