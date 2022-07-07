import _uniqueId from 'lodash/uniqueId';
import { useState } from 'react';

export function useLocalId(): (id: string) => string {
    const [uniqueId] = useState(_uniqueId());

    function fn(id: string): string {
        return `${id}-${uniqueId}`;
    }

    return fn;
}