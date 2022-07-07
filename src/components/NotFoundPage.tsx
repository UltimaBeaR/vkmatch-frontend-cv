import { Paper } from "@mui/material";

function NotFoundPage() {
    return (
        <Paper sx={{ height: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            Такой страницы не существует
        </Paper>
    );
}

export default NotFoundPage;