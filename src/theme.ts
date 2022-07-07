import { createTheme } from '@mui/material/styles';

// const tinderColor1 = '#ff655b';
// const tinderColor2 = '#fd297b';
const tinerColorMixed = '#fe406b';

const theme = createTheme({
    palette: {
        background: {
            default: '#edeef0',
        },
        primary: {
            main: tinerColorMixed,
        }
    },
});

export default theme;