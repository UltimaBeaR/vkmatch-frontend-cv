import { Paper } from "@mui/material";

function NotLoggedInPage() {
    return (
        <Paper sx={{ height: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            Нужно авторизоваться
        </Paper>
    );
}

export default NotLoggedInPage;