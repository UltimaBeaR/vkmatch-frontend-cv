/* eslint-disable react-hooks/exhaustive-deps */

import classes from './UserList.module.scss';

import React, { useEffect, useRef, useState } from "react";
import { useVirtual } from "react-virtual";
import { UserDistributionItem } from "services/backend/ApiModels/UserDistributionItem";
import UserListItem from './UserListItem';
import { useQuery } from 'react-query';
import _uniqueId from 'lodash/uniqueId';

import SimpleBar from "simplebar-react";
import "simplebar/src/simplebar.css";

export interface UsersChunk {
    users: UserDistributionItem[],
    totalCount: number
}

interface Props {
    getNextUsersChunk(offset: number, limit: number): Promise<UsersChunk>,
    onUserClick(vkUserId: number): void,
    width: string,
    height?: string,
    chunkSize: number,
    selectedUserId?: number,
    handledUserIds?: number[],
    showText?: boolean
}

function UserList({ getNextUsersChunk, onUserClick, width, height, chunkSize, selectedUserId = -1, handledUserIds = [], showText = true }: Props) {
    const [totalCount, setTotalCount] = useState(0);
    const [loadedUserCount, setLoadedUserCount] = useState(0);
    const [isAllLoaded, setIsAllLoaded] = useState(false);
    const [users, setUsers] = useState([] as UserDistributionItem[]);

    const parentRef = useRef<HTMLElement>(null);

    const [uniqueQueryKey] = useState(_uniqueId('user-list-'));

    const offset = Math.max(0, loadedUserCount - handledUserIds.length);

    const { refetch, isLoading } = useQuery(
        [uniqueQueryKey, offset],
        () => getNextUsersChunk(offset, chunkSize),
        {
            enabled: false,
            onSuccess: handleNewChunk
        }
    );

    const rowVirtualizer = useVirtual({
        size: users.length,
        parentRef,
        estimateSize: React.useCallback(() => 60, []),
        overscan: 5
    });

    useEffect(() => {
        refetch();
    }, []);

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

        const lastItemOffset = 4;

        if (lastItem.index + lastItemOffset >= users.length - 1) {
            refetch();
        }
    }, [loadedUserCount, rowVirtualizer.virtualItems, isLoading, isAllLoaded]);

    function handleNewChunk(chunk: UsersChunk) {
        setLoadedUserCount(old => old + chunk.users.length);

        if (totalCount === 0) {
            setTotalCount(chunk.totalCount);
        }

        const isAllLoaded = offset + chunk.users.length === chunk.totalCount;

        setIsAllLoaded(isAllLoaded);

        setUsers(old => [...old, ...chunk.users]);
    };

    return (
        <SimpleBar
            scrollableNodeProps={{ ref: parentRef, style: { willChange: 'transform' } }}
            className={classes['list-outer']}
            style={{ width: width, height: height }}
        >
                <div
                    className={classes['list-inner']}
                    style={{ height: `${rowVirtualizer.totalSize}px` }}
                >
                    {
                        rowVirtualizer.virtualItems.map(virtualRow => {
                            const user = users[virtualRow.index];

                            const isSelected = user.userId === selectedUserId;

                            const isHandled = handledUserIds.indexOf(user.userId) !== -1;

                            return (
                                <div
                                    key={virtualRow.index}
                                    ref={virtualRow.measureRef}
                                    className={classes['row']}
                                    style={{
                                        transform: `translateY(${virtualRow.start}px)`
                                    }}
                                >
                                    <UserListItem user={user} isSelected={isSelected} isHandled={isHandled} onUserClick={onUserClick} showText={showText} />
                                </div>
                            );
                        })
                    }
                </div>
        </SimpleBar>
    );
}

export default UserList;
