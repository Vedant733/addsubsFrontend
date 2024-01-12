import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { primary, secondaryLight } from "../extra/colors";
import React from "react";
import axios from "axios";
import { useQuery } from "react-query";
import { GET_ALL_SUBTITLES, GET_ALL_VIDEOS, GET_SUBTITLE_BY_NAME, GET_VIDEO_BY_NAME } from "../constants";
import { toast } from "react-toastify";
import { getTimeStringToNumber } from "../extra/functions";
import ReactPlayer from "react-player";
import CircularProgress from '@mui/material/CircularProgress';

function WatchMovie() {

    const [subtitleNameList, setSubtitleNameList] = React.useState([])
    const [subtitleName, setSubtitleName] = React.useState(null)
    const [subtitleList, setSubtitleList] = React.useState([])
    const [videoNameList, setVideoNameList] = React.useState([])
    const [videoName, setVideoName] = React.useState(null)
    const [videoURL, setVideoURL] = React.useState(null)
    const [isFullscreen, setIsFullscreen] = React.useState(false);
    const [currentSubtitle, setCurrentSubtitle] = React.useState(null)
    const [isLoading, setIsLoading] = React.useState(false)
    const playerRef = React.useRef(null)

    const handleProgress = (e) => {
        const exists = subtitleList.filter((item) => getTimeStringToNumber(item.start) <= e.playedSeconds && getTimeStringToNumber(item.end) >= e.playedSeconds)
        if (exists.length) setCurrentSubtitle(exists[0].description)
        else setCurrentSubtitle(null)
    }

    React.useEffect(() => {
        const fullscreenChangeHandler = () => {
            setIsFullscreen(!!(document.fullscreenElement || document.webkitFullscreenElement));
        };
        document.addEventListener('fullscreenchange', fullscreenChangeHandler);
        document.addEventListener('webkitfullscreenchange', fullscreenChangeHandler);

        return () => {
            document.removeEventListener('fullscreenchange', fullscreenChangeHandler);
            document.removeEventListener('webkitfullscreenchange', fullscreenChangeHandler);
        };
    }, []);

    React.useEffect(() => {
        if (isFullscreen && subtitleList.length) toast.error('Subtitle seems to be having some problem during fullscreen mode.')
    }, [isFullscreen, subtitleList.length])

    useQuery('GET_VIDEO_NAMES', () => axios.get(GET_ALL_VIDEOS), {
        onSuccess: (res) => {
            if (res.data) setVideoNameList(res.data)
        },
        onError: () => {
            toast.error("Server starting... Give It A Few Minutes")
        }
    })

    useQuery('GET_SUBTITLE_NAMES', () => axios.get(GET_ALL_SUBTITLES), {
        onSuccess: (res) => {
            if (res.data) setSubtitleNameList(res.data)
        },
        onError: () => {
            toast.error("Some Error Occured.")
        }
    })

    useQuery(['GET_SUBTITLE_', subtitleName], () => axios.get(GET_SUBTITLE_BY_NAME + subtitleName), {
        onSuccess: (res) => {
            if (res.data.length) {
                setSubtitleList(res.data[0].subtitle)
            }
        },
        onError: () => {
            toast.error("Some Error Occured.")
        },
        enabled: !!subtitleName
    })

    const handleClick = async () => {
        if (!videoName) return toast.error('Select A Video')
        try {
            setIsLoading(true)
            const response = await axios.post(GET_VIDEO_BY_NAME, { title: videoName }, { responseType: 'blob' })
            const blob = new Blob([response.data], { type: 'video/mp4' })
            setVideoURL(URL.createObjectURL(blob));
        } catch (err) {
            toast.error('Some Error Occured.')
        } finally {
            setIsLoading(false)
        }
    }

    return <div style={{ display: 'grid', placeItems: 'center', height: '100vh', width: '100%', background: 'white' }}>
        <span style={{ position: 'absolute', top: 10, left: 50, fontSize: '2rem', fontWeight: 800 }}>SubVid</span>
        {!videoURL ? <div style={{ border: '1px solid ' + primary, padding: '24px', borderRadius: '4px', backgroundColor: secondaryLight, display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '200px' }}>
            <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-label">Select Video</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={videoName}
                    label="Select Video"
                    sx={{ padding: 'none' }}
                    onChange={(e) => setVideoName(e.target.value)}
                >
                    {videoNameList?.map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}
                </Select>
            </FormControl>
            <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-label">Select Subtitle</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={subtitleName}
                    label="Select Subtitle"
                    sx={{ padding: 'none' }}
                    onChange={(e) => setSubtitleName(e.target.value)}
                >
                    {subtitleNameList.map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}
                </Select>
            </FormControl>
            <button
                onClick={() => {
                    if (!isLoading) handleClick()
                }}
                style={{ padding: '12px 16px', fontWeight: 600, marginTop: '8px', background: primary, borderRadius: '4px', border: 'none', color: 'white', }} >
                {isLoading ? <CircularProgress sx={{ color: 'white', fontSize: '1rem' }} /> : `Start Watching`}
            </button>
            <sub style={{ fontSize: '.5rem' }}>Make Sure You Select Appropriate Subtitles</sub>
        </div>
            : (
                <div style={{ position: 'relative', width: '640px', height: '300px' }}>
                    <ReactPlayer
                        url={videoURL}
                        controls={true}
                        controlsList="nofullscreen nodownload"
                        ref={playerRef}
                        width={'100%'}
                        height={'100%'}
                        onSeek={handleProgress}
                        onProgress={handleProgress}
                    />
                    {
                        currentSubtitle &&
                        <div style={{ background: '#00000061', position: 'absolute', left: '50%', transform: 'translateX(-50%)', bottom: '20%', padding: '12px', color: 'white', wordBreak: 'break-all', }}>
                            {currentSubtitle}
                        </div>
                    }
                </div>
            )}
    </div>;
}

export default WatchMovie;
