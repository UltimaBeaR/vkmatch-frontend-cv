/* eslint-disable react-hooks/exhaustive-deps */

import classes from './PhotoGallery.module.scss';

import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { useQuery } from 'react-query';
import { useVirtual } from 'react-virtual';
import _uniqueId from 'lodash/uniqueId';

import calculateLayout, { Size } from 'utils/photoGalleryLayout';

import SimpleBar from "simplebar-react";
import "simplebar/src/simplebar.css";
import { Box, CircularProgress } from '@mui/material';
import useDebounced from 'hooks/useDebounced';

interface PhotoLayoutRowItem {
    width: number,
    url: string
}

interface PhotoLayoutRow {
    items: PhotoLayoutRowItem[],
    height: number
}

export interface Photo {
    urlSmall: string,
    widthSmall: number,
    heightSmall: number,

    urlLarge: string,
    widthLarge: number,
    heightLarge: number
}

export interface PhotosChunk {
    photos: Photo[],
    totalCount: number
}

function checkIfFirstPhotoFitsBetter(
    targetWidth: number, targetHeight: number,
    firstWidth: number, firstHeight: number,
    secondWidth: number, secondHeight: number
): boolean {
    const targetSquare = targetWidth * targetHeight;
    const firstSquare = firstWidth * firstHeight;
    const secondSquare = secondWidth * secondHeight;

    const firstDistance = Math.abs(targetSquare - firstSquare);
    const secondDistance = Math.abs(targetSquare - secondSquare);

    return firstDistance < secondDistance;
}

const PhotoGallery: React.FC<{
    getNextPhotosChunk(offset: number, limit: number): Promise<PhotosChunk>
    width: number,
    maxHeight?: number,
    minRowHeight?: number,
    maxRowHeight?: number,
    gap?: number,
    paddingLeft?: number,
    paddingRight?: number,
    paddingTop?: number,
    paddingBottom?: number,
}> = ({
    getNextPhotosChunk,
    width,
    maxHeight = 800,
    minRowHeight = 200, maxRowHeight = 300,
    gap = 5,
    paddingLeft = 0,
    paddingRight = 0,
    paddingTop = 0,
    paddingBottom = 0
}) => {
    const [totalCount, setTotalCount] = useState(0);
    
    const [layoutRows, setLayoutRows] = useState<PhotoLayoutRow[]>([]);
    const [incompleteRow, setIncompleteRow] = useState<Photo[]>([]);
    
    const [loadedPhotoCount, setLoadedPhotoCount] = useState(0);
    const [loadedPhotos, setLoadedPhotos] = useState<Photo[]>([]);

    const [isAllLoaded, setIsAllLoaded] = useState(false);
    const [loadedChunksCount, setLoadedChunksCount] = useState(0);
    const [renderingWidth, setRenderingWidth] = useState(width);

    const [wasInitialized, setWasInitialized] = useState(false);

    const [isLayoutRebuilding, setIsLayoutRebuilding] = useState(false);

    const parentRef = useRef<HTMLElement>(null);

    const [uniqueQueryKey] = useState(_uniqueId('photo-gallery-'));

    const { refetch, isLoading } = useQuery(
        [uniqueQueryKey, loadedPhotoCount],
        () => getNextPhotosChunk(loadedPhotoCount, calcPhotosToRequestCount()),
        {
            enabled: false,
            onSuccess: handleNewPhotoChunk
        }
    );

    const rowVirtualizer = useVirtual({
        size: layoutRows.length,
        parentRef,
        estimateSize: React.useCallback((index: any) => layoutRows[index].height + (index < layoutRows.length - 1 ? gap : 0), [layoutRows.length, gap]),
    });

    const rebuildLayout = useDebounced((width: number) => {
        addNewPhotos(loadedPhotos, width, isAllLoaded);

        setIsLayoutRebuilding(false);
    }, 400);

    useLayoutEffect(() => {
        if ((!wasInitialized && width !== 0) || (wasInitialized && width !== renderingWidth)) {
            setRenderingWidth(width);

            if (wasInitialized) {
                setIsLayoutRebuilding(true);
                setLayoutRows([]);
                rebuildLayout(width);
            }
            else {
                refetch();
            }

            if (!wasInitialized) {
                setWasInitialized(true);
            }
        }
        
    }, [width]);

    useEffect(() => {
        if (isAllLoaded || isLoading) {
            return;
        }

        if (rowVirtualizer.virtualItems.length === 0) {
            return;
        }

        const lastItem = rowVirtualizer.virtualItems[rowVirtualizer.virtualItems.length - 1];
        
        if (!lastItem) {
            return;
        }

        const doRefetch = 
            (loadedChunksCount > 1 && (lastItem.index + 5) >= layoutRows.length - 1) ||
            (loadedChunksCount <= 1 && lastItem.index >= layoutRows.length - 1);

        if (doRefetch) {
            refetch();
        }
    }, [loadedPhotoCount, rowVirtualizer.virtualItems, isLoading, isAllLoaded]);
    
    function calcPhotosToRequestCount(): number {
        const averageRowCount = maxHeight / ((minRowHeight + maxRowHeight) / 2);
        const averagePhotosPerRow = 4;

        if (loadedChunksCount > 1) {
            // На третий раз и далее - то есть если юзер активно скролит и скорее всего дойдет до конца списка
            // - берем сразу много фоток, чтобы юзер не ждал постоянно подгрузки, т.к. могут быть задержки
            return Math.max(1, Math.round((averageRowCount * averagePhotosPerRow) * 5));
        }

        if (loadedChunksCount === 1) {
            // На второй раз (первый скроллинг, или если неповезло на первый раз заполнить пространство - то до скроллинга) берем 2 экрана
            return Math.max(1, Math.round((averageRowCount * averagePhotosPerRow) * 2));
        }

        // На первый раз грузим кол-во фоток чтобы заполнить все видимое пространство.
        // Добавляем несколько дополнительных строк, чтобы не триггерить запрос следующего чанка по скроллу.
        return Math.max(1, Math.round(averageRowCount + 7) * averagePhotosPerRow);
    }

    function handleNewPhotoChunk(photosChunk: PhotosChunk) {
        setLoadedChunksCount(old => old + 1);

        setLoadedPhotoCount(old => old + photosChunk.photos.length);
        setLoadedPhotos(old => [...old, ...photosChunk.photos]);

        if (totalCount === 0) {
            setTotalCount(photosChunk.totalCount);
        }

        const isAllLoaded = loadedPhotoCount + photosChunk.photos.length === photosChunk.totalCount;

        setIsAllLoaded(isAllLoaded);

        addNewPhotos([
            ...incompleteRow,
            ...photosChunk.photos
        ], renderingWidth, isAllLoaded);
    };

    function addNewPhotos(photos: Photo[], renderingWidth: number, isAllLoaded: boolean) {
        const areaWidth = renderingWidth - (paddingLeft + paddingRight);

        const layout = calculateLayout(
            photos.map(x => ({
                width: x.widthLarge,
                height: x.heightLarge
            }) as Size),
            areaWidth,
            minRowHeight, maxRowHeight,
            1.6,
            gap
        );

        const doTakeLastRow = isAllLoaded || !layout.lastRowIsIncomplete;

        const photoLayout: PhotoLayoutRow[] = [];

        let photoIdx = 0;

        for (let rowIdx = 0; rowIdx < layout.rows.length - (doTakeLastRow ? 0 : 1); rowIdx++)
        {
            const row = layout.rows[rowIdx];

            const photoLayoutRow = {
                height: row.height,
                items: []
            } as PhotoLayoutRow;

            for (let width of row.widths)
            {
                const photo = photos[photoIdx];

                const isSmallFitsBetter = checkIfFirstPhotoFitsBetter(
                    width, photoLayoutRow.height,
                    photo.widthSmall, photo.heightSmall,
                    photo.widthLarge, photo.heightLarge,
                );

                photoLayoutRow.items.push({
                    url: isSmallFitsBetter ? photo.urlSmall : photo.urlLarge,
                    width: width
                });

                photoIdx++;
            }

            photoLayout.push(photoLayoutRow);
        }

        setLayoutRows(old => [...old, ...photoLayout]);
        setIncompleteRow(doTakeLastRow ? [] : photos.slice(photoIdx));
    }

    if (layoutRows.length === 0) {
        if (isLayoutRebuilding || isLoading) {
            return (
                <Box className="center-contents" sx={{ height: '100%' }}>
                    <CircularProgress color="primary" />
                </Box>
            );
        }
        else {
            return (
                <Box className="center-contents" sx={{ height: '100%' }}>
                    Нет фото
                </Box>
            );
        }
    }

    return (
        <SimpleBar
            scrollableNodeProps={{ ref: parentRef, style: { willChange: 'transform' } }}
            className={classes['list-outer']}
            style={{ maxHeight: `${maxHeight}px` }}
        >
            <div
                className={classes['list-inner']}
                style={{ height: `${rowVirtualizer.totalSize}px`, marginLeft: `${paddingLeft}px`, marginTop: `${paddingTop}px` }}
            >
                {
                    rowVirtualizer.virtualItems.map(virtualRow => {
                        const layoutRow = layoutRows[virtualRow.index];

                        const photoElements = layoutRow.items.map((item, photoIdx) => {
                            return (
                                <div
                                    key={photoIdx}
                                    className={classes['image-placeholder']}
                                    style={{
                                        width: item.width, height: layoutRow.height,
                                        marginRight: photoIdx < layoutRow.items.length - 1
                                            ? `${gap}px`
                                            : undefined
                                    }}
                                >
                                    <img
                                        className={classes.image}
                                        src={item.url}
                                        width={item.width} height={layoutRow.height}
                                        alt="Фото"
                                    />
                                </div>
                            );
                        });

                        return (
                            <div
                                key={virtualRow.index}
                                className={classes['row']}
                                style={{
                                    height: `${virtualRow.size}px`,
                                    transform: `translateY(${virtualRow.start}px)`
                                }}
                            >
                                {photoElements}
                            </div>
                        );
                    })
                }
            </div>
            { isLoading && <div>Загрузка дополнительных фоток...</div> }
            { isAllLoaded && <div style={{ height: paddingBottom }} /> }
        </SimpleBar>
    );
}

export default PhotoGallery;