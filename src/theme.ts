import { extendTheme } from "native-base";
import { color } from "native-base/lib/typescript/theme/styled-system";
export const themeNative = extendTheme({
  fontConfig: {
    Ubuntu: {
      100: {
        normal: "Ubuntu-Light",
        italic: "Ubuntu-LightItalic",
      },
      200: {
        normal: "Ubuntu-Light",
        italic: "Ubuntu-LightItalic",
      },
      300: {
        normal: "Ubuntu-Light",
        italic: "Ubuntu-LightItalic",
      },
      400: {
        normal: "Ubuntu-Regular",
        italic: "Ubuntu-Italic",
      },
      500: {
        normal: "Ubuntu-Medium",
        italic: "Ubuntu-MediumItalic",
      },
      600: {
        normal: "Ubuntu-Medium",
        italic: "Ubuntu-MediumItalic",
      },
      700: {
        normal: "Ubuntu-Bold",
        italic: "Ubuntu-BoldItalic",
      },
      800: {
        normal: "Ubuntu-Bold",
        italic: "Ubuntu-BoldItalic",
      },
      900: {
        normal: "Ubuntu-Bold",
        italic: "Ubuntu-BoldItalic",
      },
    },
  },

  fonts: {
    heading: "Ubuntu",
    body: "Ubuntu",
    mono: "Ubuntu",
  },

  colors: {
    primary_old: {
      "50": "#a4f5c8",
      "100": "#86edb5",
      "200": "#6be3a1",
      "300": "#52d88e",
      "400": "#33d17a",
      "500": "#33bb70",
      "600": "#34a466",
      "700": "#348e5d",
      "800": "#337953",
      "900": "#316548",
    },
    primary: {
      "50": "#f7fee7",
      "100": "#ecfccb",
      "200": "#d9f99d",
      "300": "#bef264",
      "400": "#a3e635",
      "500": "#84cc16",
      "600": "#65a30d",
      "700": "#4d7c0f",
      "800": "#3f6212",
      "900": "#365314",
    },
    //     //300: '#d97706'// 'muted.300'
    // },
    buttonColors: {
      50: "#d4d4d8",
      100: "#d4d4d8",
      200: "#d4d4d8",
      300: "#d4d4d8",
      400: "#d4d4d8",
      500: "#d4d4d8",
      600: "#F5F1F1", // base Color
      700: "#d4d4d8",
      800: "#71717a", // pressed
      900: "#8E8E93",
    },
  },
  components: {
    Text: {
      baseStyle: {
        color: "muted.400",
      },
    },
    Heading: {
      baseStyle: {
        color: "muted.400",
        alignText: "center",
      },
    },
    Container: {
      baseStyle: {
        // backgroundColor: 'muted.100',
        //colorScheme: 'primary',
        padding: 10,
        margin: 10,
        borderRadius: "3xl",
        shadow: 2,
      },
    },
    View: {
      baseStyle: {
        alignItems: "center",
        justifyContent: "center",
      },
    },
    Button: {
      baseStyle: {
        borderRadius: "2xl",
        shadow: 2,
      },

      defaultProps: {
        size: "lg",
        _text: {
          fontWeight: "900",
          fontSize: 20,
        },
      },
      _disabled: {
        variant: "subtle",
      },
    },

    Select: {
      baseStyle: {
        borderRadius: "lg",
        borderWidth: 0,
        // shadow: 2,
        bg: "muted.100",
        // bg: 'primary.100'
        // colorScheme:'primary'
      },
      defaultProps: {
        fontSize: "lg",
        placeholderTextColor: "muted.400",
        color: "muted.500",
        fontColor: "white",
        fontWeight: "bold",
      },
    },

    Input: {
      defaultProps: {
        variant: "filled",
        bg: "muted.100",
        borderRadius: 15,
        size: "2xl",
        textAlign: "center",
        fontWeight: "bold",
        maxWidth: 350,
        _invalid: { color: "error.400" },
      },
    },
  },

  // Button: {
  //     baseStyle:{
  //         // backgroundColor:'muted.300',
  //         // shadow: 2

  //     }
  // }
});

export const customFonts = {
  "Ubuntu-Light": require("../assets/fonts/Ubuntu-Light.ttf"),
  "Ubuntu-LightItalic": require("../assets/fonts/Ubuntu-LightItalic.ttf"),
  "Ubuntu-Regular": require("../assets/fonts/Ubuntu-Regular.ttf"),
  "Ubuntu-Italic": require("../assets/fonts/Ubuntu-Italic.ttf"),
  "Ubuntu-Medium": require("../assets/fonts/Ubuntu-Medium.ttf"),
  "Ubuntu-MediumItalic": require("../assets/fonts/Ubuntu-MediumItalic.ttf"),
  "Ubuntu-Bold": require("../assets/fonts/Ubuntu-Bold.ttf"),
  "Ubuntu-BoldItalic": require("../assets/fonts/Ubuntu-BoldItalic.ttf"),
};

import { DefaultTheme } from "@react-navigation/native";

export const themeNavigation = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: themeNative.colors.primary[500],
  },
};
