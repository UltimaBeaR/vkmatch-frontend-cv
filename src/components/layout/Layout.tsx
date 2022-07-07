import { Outlet } from "react-router-dom";
import { Backdrop, CircularProgress, Container } from "@mui/material";
import Header from "./Header/Header";
import { useSelector } from "react-redux";

function Layout() {
    const isLoading = useSelector((state: any) => (state.global.isLoading as boolean));

    return (
        <>
            <header className={ isLoading ? "disable-interaction" : undefined }>
                <Header />
            </header>
            <main className={ isLoading ? "disable-interaction" : undefined }>
                <Container component="main" maxWidth="lg" sx={{ mt: 3, mb: 3 }}>
                    <Outlet />
                </Container>
            </main>
            <Backdrop
                invisible={true}
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isLoading}
            >
                <CircularProgress color="primary" size="7vh" />
            </Backdrop>
        </>
    );
}

export default Layout;