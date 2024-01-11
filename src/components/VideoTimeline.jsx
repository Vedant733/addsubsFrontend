/* eslint-disable react/prop-types */
import React from 'react';
import { getTime, getTimeStringToNumber } from '../extra/functions';
import { secondaryLight } from '../extra/colors';

// const minSec = 5;
// const minLength = 50px;
// Each Sec represented by 10px

const pixelsPerSecond = 20;

export const VideoTimeline = ({ subtitleList, currentTime, endTime, playerRef, currentSubtitle, pointerRef }) => {

    const [timeline,] = React.useState(Array.from({ length: endTime / 5 + 1 }, (_, index) => {
        const timestamp = 5 * index;
        return getTime(timestamp)
    }));

    const onClick = (e) => {
        const box = e.currentTarget;
        const left = e.pageX + box.scrollLeft - box.getBoundingClientRect().left - 12; // 12 is the padding
        console.log(left)
        playerRef.current.seekTo(left / pixelsPerSecond, 'seconds');
        pointerRef.current.focus();
    };

    return <div ref={pointerRef} style={{ width: '100%', height: '100%', overflowX: 'auto', paddingLeft: '12px', display: 'flex', alignItems: 'center' }} onClick={onClick}>
        <div className="line" style={{ width: (endTime * 10) + 'px', height: '50%', position: 'relative' }}>
            <div style={{ width: (endTime * pixelsPerSecond) + 'px', height: '1px', background: 'white', position: 'absolute', top: '50%', transform: 'translateY(-50%)' }} />
            <div style={{ transition: '.5s all', width: '4px', height: '150%', background: 'black', position: 'absolute', top: '50%', transform: 'translate(-2px,-50%)', left: `${currentTime * pixelsPerSecond}px`, borderRadius: '20%' }} />
            {currentSubtitle && <div style={{ width: `${(getTimeStringToNumber(currentSubtitle.end) - getTimeStringToNumber(currentSubtitle.start)) * pixelsPerSecond}px`, left: `${getTimeStringToNumber(currentSubtitle.start) * pixelsPerSecond}px`, height: '50%', background: secondaryLight, position: 'absolute', borderRadius: '8px', transform: 'translateY(50%)' }}></div>}
            {subtitleList.map(item => (<div key={item.id} style={{ width: `${(getTimeStringToNumber(item.end) - getTimeStringToNumber(item.start)) * pixelsPerSecond}px`, left: `${getTimeStringToNumber(item.start) * pixelsPerSecond}px`, height: '50%', background: secondaryLight, borderRadius: '8px', position: 'absolute', display: 'grid', placeItems: 'center', transform: 'translateY(50%)' }}>
                <div style={{ color: 'black', background: 'rgb(204 204 254)', textOverflow: 'ellipsis', maxLines: 1, width: '50%', overflow: 'hidden', whiteSpace: 'nowrap', textAlign: 'center', borderRadius: '4px', opacity: .5 }}>{item.description}</div>
            </div>))}
            {timeline.map((val, index) => (<>
                <div key={index} style={{ top: '50%', transform: 'translateY(-50%)', position: 'absolute', height: '50%', width: '.1px', left: `${index * (pixelsPerSecond * 5)}px`, background: 'white' }}></div>
                <div key={(index + 1) * (timeline.length)} style={{ top: '10%', transform: 'translateY(-50%)', position: 'absolute', left: `${index * (pixelsPerSecond * 5) - 5}px`, color: 'white', fontSize: '.7rem' }}>
                    {val}
                </div>
            </>))}
        </div>
    </div >;
};
