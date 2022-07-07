import useDimensions from "react-cool-dimensions";

import * as backend from 'services/backend/backend';
import PhotoGallery, { PhotosChunk } from 'components/reusable/PhotoGallery/PhotoGallery';

interface Props {
    userId: number
}

function UserPhotos({ userId }: Props) {
    const { observe, width, height } = useDimensions<HTMLDivElement>();

    const roundedWidth = Math.floor(width);
    const roundedHeight = Math.floor(height);

    async function getNextPhotosChunk(offset: number, limit: number): Promise<PhotosChunk> {
        const photosChunk = await backend.photo.get(userId, offset, limit);

        return {
            totalCount: photosChunk.totalCount,
            photos: photosChunk.items.map(item => ({ ...item }))
        };
    }

    return (
        <div key={userId} ref={observe} style={{ height: '100%' }}>
            <PhotoGallery
                getNextPhotosChunk={getNextPhotosChunk}
                width={roundedWidth} maxHeight={roundedHeight}
                paddingLeft={12} paddingRight={12} paddingTop={12} paddingBottom={12}
            />
        </div>
    );
}

export default UserPhotos;