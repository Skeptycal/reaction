import Colors from "./Colors"

export default {
  breakpoints: [768, 900, 1024, 1192],
  flexboxgrid: {
    // Defaults
    gutterWidth: 3, // rem
    outerMargin: 2, // rem
    container: {
      sm: 46, // rem
      md: 61, // rem
      lg: 76, // rem
    },
    breakpoints: {
      xs: 0, // em
      sm: 48, // em
      md: 64, // em
      lg: 75, // em
    },
  },
  publishing: {
    breakpoints: {
      xs: 600, // px
      sm: 720, // px
      md: 900, // px
      lg: 1080, // px
      xl: 1280, // px
    },
  },
  colors: Colors,
}
