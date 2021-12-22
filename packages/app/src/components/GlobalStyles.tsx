import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  *, *:before, *:after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    /* font-family: 'Montserrat', 'Helvetica Neue', Arial, sans-serif;
    font-weight: 300; */
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    /* background: var(--color-background);
    color: var(--color-text);
    transition: background-color 300ms; */
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-overflow-scrolling: touch;
  }

  a {
    color: white; //var(--color-text);
    text-decoration: none;
    transition: outline-offset 300ms ease;
    outline: none;

    :hover, :focus {
      color: red; // var(--color-text-active);
      text-decoration: underline;
      outline: none;
    }

    /* ::after {
      content: '';
      display: block;
      width: 0px;
      height: 1px;
      position: relative;
      bottom: 2px;
      left: 0;
      background-color: var(--color-text-active);
      transition: width 300ms ease-in-out;
      opacity: 0.75;
    } */

    /* :hover, :focus {
      outline: none;
      ::after {
        width: 100%;
      }
    } */
    /* :focus {
      outline: 2px dashed var(--color-text-active);
      outline-offset: 5px;
    } */
  }
  
  /* h1 {
    font-size: 2.2rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }
  h2 {
    font-size: 2rem;
    font-weight: 400;
    margin-bottom: 1rem;
  }
  h3 {
    font-size: 1.8rem;
    margin-bottom: 1rem;
  }
  h4 {
    font-size: 1.7rem;
    margin-bottom: 1rem;
  }
  h5 {
    font-size: 1.6rem;
    margin-bottom: 1rem;
  }
  h6 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  p {
    font-size: 1.2rem;
    font-weight: 400;
    line-height: 1.8rem;
    margin-bottom: 1em;
  }

  ul,
  ol {
    list-style-position: inside;
    margin: 1rem 0;

    > li {
      margin-bottom: 1rem;
    }
  }

  hr {
    background: var(--color-text);
    height: 1px;
    border: 0;
    margin: 1rem 0;
  }

  code {
    font-family: "Courier New", Courier, monospace;
  } */
`;

export default GlobalStyles;
