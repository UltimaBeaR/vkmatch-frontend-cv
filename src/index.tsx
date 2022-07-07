import './index.scss';

import ReactDOM from 'react-dom/client';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import {
    QueryClient,
    QueryClientProvider
} from 'react-query';

import { BrowserRouter } from "react-router-dom";

import vkAuthorizeService from 'services/vkAuthorizeService';
import reportWebVitals from 'reportWebVitals';
import theme from 'theme';
import RouteConfig from 'components/routing/RouteConfig';
import store from 'store/store'
import { Provider as ReduxProvider } from 'react-redux'

const queryClient = new QueryClient();

async function run() {
    await vkAuthorizeService.setAuthorizationState();

    const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

    window.document
        .querySelectorAll('.vkmatch-preloader')
        .forEach(element => element.classList.remove('vkmatch-preloader'));
    
    const rootNode = (
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <ReduxProvider store={store}>
                    <ThemeProvider theme={theme}>
                        <CssBaseline />
                        <RouteConfig />
                    </ThemeProvider>
                </ReduxProvider>
            </QueryClientProvider>
        </BrowserRouter>
    );
    
    root.render(rootNode);
    
    // If you want to start measuring performance in your app, pass a function
    // to log results (for example: reportWebVitals(console.log))
    // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
    reportWebVitals();
}

run();