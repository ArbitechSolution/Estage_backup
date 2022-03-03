import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: 'Clash Display', sans-serif;
    }

    body {
        background-color: #1B1B1B;
        color: #FFFFFF;
    }

    a {
        color: inherit;
        text-decoration: none;
    }

`;

export default GlobalStyle;
