/* eslint-disable react/prop-types */
import React from 'react'
import ReactPlayer from 'react-player'
import { VideoTimeline } from './VideoTimeline'
import AddSubtitle from './AddSubtitle'
import { getTime, getTimeStringToNumber } from '../extra/functions'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { backgroundColor, boxBorderColor, secondary, secondaryLight } from '../extra/colors'
import InfoModal from './InfoModal'
import { Box } from '@mui/material'

export const VideoPlayer = ({ url, videoFile, clearAll }) => {

    const [endTime, setEndTime] = React.useState(null)
    const playerRef = React.useRef(null)
    const pointerRef = React.useRef(null)
    const [currentTime, setCurrentTime] = React.useState(0)
    const [currentSubtitle, setCurrentSubtitle] = React.useState(null)
    const [addSubtitleBoxOpen, setAddSubtitleBoxOpen] = React.useState(false);
    const [showSubtitleBox, setShowSubtitleBox] = React.useState(null)
    const [openSaveModal, setOpenSaveModal] = React.useState(false)
    const [subtitleList, setSubtitleList] = React.useState([])

    const onReady = (e) => {
        setEndTime(e.getDuration())
    }

    const onSeek = (e) => {
        setCurrentTime(e)
        pointerRef.current.scrollTo({ left: (parseInt(e) * 20) - 100, behavior: 'smooth' });
        const exists = subtitleList.filter((item) => getTimeStringToNumber(item.start) <= currentTime && getTimeStringToNumber(item.end) >= currentTime)
        if (exists.length) setShowSubtitleBox(exists[0].description)
        else setShowSubtitleBox(null)
    }

    const onProgress = (e) => {
        setCurrentTime(e.playedSeconds)
        pointerRef.current.scrollTo({ left: (parseInt(e.playedSeconds) * 20) - 100, behavior: 'smooth' });
        const exists = subtitleList.filter((item) => getTimeStringToNumber(item.start) <= currentTime && getTimeStringToNumber(item.end) >= currentTime)
        if (exists.length) setShowSubtitleBox(exists[0].description)
        else setShowSubtitleBox(null)
    }
    4
    const handleAddSubtitleButton = () => {
        const exists = subtitleList.filter((item) => getTimeStringToNumber(item.start) <= currentTime && getTimeStringToNumber(item.end) >= currentTime)
        if (exists?.length) return toast.error("Subtitle Already Exists.")
        let closetEndTime = null;
        const endSecTemp = 5;
        for (let sub of subtitleList) {
            if (getTimeStringToNumber(sub.start) > currentTime) {
                closetEndTime = getTimeStringToNumber(sub.start);
                break;
            }
        }
        if (closetEndTime) setCurrentSubtitle({
            start: getTime(currentTime),
            end: getTime(Math.min(endTime, Math.min(closetEndTime, currentTime + endSecTemp))),
            description: '',
            id: Math.random()
        })
        else setCurrentSubtitle({
            start: getTime(currentTime),
            end: getTime(Math.min(endTime, (currentTime + endSecTemp))),
            description: '',
            id: Math.random()
        })
        setAddSubtitleBoxOpen(true)
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
        }}>
            <InfoModal
                open={openSaveModal}
                setOpen={setOpenSaveModal}
                subtitleList={subtitleList}
                videoFile={videoFile}
                clearAll={clearAll}
            />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', flexDirection: { xs: 'column', md: 'row' } }}>
                <div className="c1" style={{ flex: 1, height: '65vh', minWidth: '60%', position: 'relative', border: '1px solid ' + boxBorderColor, padding: '12px' }}>
                    <ReactPlayer
                        url={url}
                        controls={true}
                        config={{ fullScreen: { enabled: false } }}
                        ref={playerRef}
                        width={'100%'}
                        height={'100%'}
                        onReady={onReady}
                        onSeek={onSeek}
                        onProgress={onProgress}
                    />
                    {currentSubtitle && <div style={{ background: '#00000061', position: 'absolute', left: '50%', transform: 'translateX(-50%)', bottom: '20%', padding: '12px', color: 'white', wordBreak: 'break-all' }}>{currentSubtitle.description}</div>}
                    {showSubtitleBox && <div style={{ background: '#00000061', position: 'absolute', left: '50%', transform: 'translateX(-50%)', bottom: '20%', padding: '12px', color: 'white', wordBreak: 'break-all' }}>{showSubtitleBox}</div>}
                </div>
                <div className="c2" style={{ background: backgroundColor, flex: 1, minWidth: '35%', padding: '12px', height: '65vh', border: '1px solid ' + boxBorderColor }}>
                    {!addSubtitleBoxOpen ? <>
                        <button style={{ padding: '12px 16px', fontWeight: 600, marginBottom: '8px', background: secondary, borderRadius: '4px', border: 'none', color: 'white' }} onClick={handleAddSubtitleButton}>Add Subtitle</button>
                        <button style={{ padding: '12px 16px', fontWeight: 600, marginBottom: '8px', background: secondary, borderRadius: '4px', border: 'none', color: 'white', marginLeft: '4px' }} onClick={() => setOpenSaveModal(true)}>Save</button>
                        <button style={{ padding: '12px 16px', fontWeight: 600, marginBottom: '8px', background: secondary, borderRadius: '4px', border: 'none', color: 'white', marginLeft: '4px' }} onClick={() => clearAll()}>Exit</button>
                    </>
                        : <AddSubtitle
                            currentTime={currentTime}
                            currentSubtitle={currentSubtitle}
                            setCurrentSubtitle={setCurrentSubtitle}
                            setAddSubtitleBoxOpen={setAddSubtitleBoxOpen}
                            subtitleList={subtitleList}
                            setSubtitleList={setSubtitleList}
                            endTime={endTime}
                        />}
                    <div style={{ overflowY: 'auto', height: addSubtitleBoxOpen ? '42vh' : '55vh' }}>
                        {subtitleList.map((item) => <div key={item.id} style={{ padding: '8px', border: '1px solid ' + secondary, marginBottom: '8px', borderRadius: '4px', background: secondaryLight, width: '95%' }}>
                            <input disabled value={item.start} style={{ border: 'none', background: 'white', textAlign: 'center', width: '50px', marginRight: '4px' }} placeholder="MM:SS" />
                            <input disabled value={item.end} style={{ border: 'none', background: 'white', textAlign: 'center', width: '50px' }} placeholder="MM:SS" />
                            <br />
                            <textarea disabled value={item.description}
                                style={{ width: '100%', height: '60px', resize: 'none', marginTop: '8px', borderRadius: '4px' }} />
                        </div>)}
                    </div>
                </div>
            </Box>
            <div className="c3" style={{ position: 'relative', width: '94%', display: 'flex', background: backgroundColor, height: '25vh', justifyContent: 'center', marginTop: '1rem', padding: '.6% 3%', flexDirection: 'column' }}>
                <span style={{ height: 'fit-content', color: 'white', fontSize: '1.4rem', fontWeight: 800 }}>Timeline</span>
                {endTime && <VideoTimeline
                    pointerRef={pointerRef}
                    subtitleList={subtitleList} currentTime={currentTime} endTime={endTime} playerRef={playerRef} currentSubtitle={currentSubtitle} />}
            </div>
        </div >
    );
}

export default VideoPlayer;