/* eslint-disable react/prop-types */

import { useNavigate } from "react-router";
import { primary, secondary, secondaryLight } from "../extra/colors";
import { toast } from "react-toastify";

function Onboarding({ videoUrl, setVideoUrl, videoFile, setVideoFile, setOnBoardingDone }) {

    const navigate = useNavigate()

    return <div style={{ width: '100%', background: 'white', display: 'grid', placeItems: 'center', height: '100vh' }}>
        <span style={{ position: 'absolute', top: 10, left: 50, fontSize: '2rem', fontWeight: 800 }}>SubVid</span>
        <div style={{ border: '1px solid ' + primary, padding: '24px', borderRadius: '4px', backgroundColor: secondaryLight, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label htmlFor="files" style={{ borderRadius: '4px', background: primary, padding: '12px 16px', color: 'white', fontWeight: 600, textAlign: 'center', maxWidth: '200px', textOverflow: 'ellipsis', maxLines: 1, overflow: 'hidden', whiteSpace: 'nowrap', fontSize: '1.05rem' }}>{videoFile ? videoFile.name : 'Add Subtitles To A Video'}</label>
            <input id="files" hidden style={{}} value={null} type='file' onChange={(e) => {
                const selectedFile = e.target.files[0]
                if (!selectedFile) return toast.error('Select A File')
                if (!selectedFile.type.startsWith('video/')) return toast.error('Select A Video')
                if (selectedFile.size >= 50 * 1024 * 1024) return toast.error('File Size Limit is 50MB.')
                setVideoFile(selectedFile)
                setVideoUrl(URL.createObjectURL(selectedFile))
            }} />
            {videoUrl && <div style={{ width: '100%', textAlign: 'center', gap: '12px', display: 'flex', flexDirection: 'column' }}>
                <button style={{ padding: '12px 16px', fontWeight: 600, margin: '8px 0px', background: primary, borderRadius: '4px', border: 'none', color: 'white', }} onClick={() => {
                    setOnBoardingDone(true)
                }}>Start Editing From Scratch</button>
            </div>}
            {!videoUrl && <><div style={{ width: '100%', textAlign: 'center' }}>OR</div>
                <button style={{ padding: '12px 16px', fontWeight: 600, marginBottom: '8px', background: secondary, borderRadius: '4px', border: 'none', color: 'white' }} onClick={() => navigate("/watch")}>Watch Video</button></>}
        </div>
    </div>;
}

export default Onboarding;
