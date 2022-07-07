import { Grid, Paper } from "@mui/material";
import FillRemainingViewHeight from "components/reusable/FillRemainingViewHeight";
import UserPhotos from "./UserPhotos";

export interface GalleryProp {
    userId: number
}

function Gallery({ userId }: GalleryProp) {
    return (
        <Grid item lg={12}>
            <FillRemainingViewHeight key={userId} bottomOffsetPx={24}>
                <Paper elevation={2} style={{ height: '100%' }}>
                    <UserPhotos userId={userId} />
                </Paper>
            </FillRemainingViewHeight>
        </Grid>
    );
}

export default Gallery;