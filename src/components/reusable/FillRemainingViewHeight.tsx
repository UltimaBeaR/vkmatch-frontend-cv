import { useLayoutEffect, useRef, useState } from "react";

interface Props {
    bottomOffsetPx?: number,
    children: any
}

function FillRemainingViewHeight({ children, bottomOffsetPx = 0 }: Props) {
    const ref = useRef<HTMLDivElement>(null);

    const [ topOffset, setTopOffset ] = useState(0);

    useLayoutEffect(() => {
        if (ref.current) {
            setTopOffset(ref.current.offsetTop);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ ref.current ]);

    return (
        <div ref={ref} style={{ height: `calc(100vh - ${topOffset}px - ${bottomOffsetPx}px)` }}>
            {children}
        </div>
    )
}

export default FillRemainingViewHeight;
