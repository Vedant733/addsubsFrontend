import { toast } from "react-toastify";
import { getTimeStringToNumber } from "../extra/functions";
import React from "react";
import { primary } from "../extra/colors";

/* eslint-disable react/prop-types */
function AddSubtitle({ currentSubtitle, setCurrentSubtitle, setAddSubtitleBoxOpen, setSubtitleList, endTime }) {

    const close = () => {
        document.startViewTransition(() => {
            setAddSubtitleBoxOpen(false)
            setCurrentSubtitle(null)
        })
    }
    const [subEnd, setSubEnd] = React.useState(currentSubtitle.end)

    const addSubtitle = () => {
        if (!currentSubtitle.description.trim().length) return toast.error("Enter Subtitles.")
        setSubtitleList(prev => {
            const ret = [...prev, currentSubtitle]
            ret.sort((a, b) => getTimeStringToNumber(a.start) - getTimeStringToNumber(b.start)
            )
            return [...ret]
        })
        setCurrentSubtitle(null)
        setAddSubtitleBoxOpen(false)
    }
    return <div style={{ position: 'relative', width: '95%', height: 'auto', padding: '8px', marginBottom: '4px', border: '1px solid ' + primary, background: primary, borderRadius: '4px' }}>
        <span style={{ position: 'absolute', right: 10, cursor: 'pointer' }} onClick={close}>X</span>
        {currentSubtitle &&
            <>
                <label style={{ color: 'white' }}>Start : </label><input value={currentSubtitle.start} disabled style={{ color: 'white', fontWeight: 700, borderRadius: '4px', textAlign: 'center', border: 'none', padding: '4px', width: '50px', marginRight: '4px' }} placeholder="MM:SS" />
                <label style={{ color: 'white' }}>End  : </label><input value={subEnd} onChange={(e) => setSubEnd(e.target.value)} onBlur={() => {
                    try {
                        const end = getTimeStringToNumber(subEnd);
                        if (end > endTime || end <= getTimeStringToNumber(currentSubtitle.start)) throw new Error('?')
                        setCurrentSubtitle(prev => ({ ...prev, end: subEnd }))
                    } catch (err) {
                        setSubEnd(currentSubtitle.end)
                        toast.error('Enter Valid Endtime.')
                    }
                }} style={{ borderRadius: '4px', textAlign: 'center', border: 'none', padding: '4px', width: '50px', fontWeight: 700 }} placeholder="MM:SS" />
                <br />
                <textarea value={currentSubtitle.description}
                    onChange={(e) => setCurrentSubtitle(prev => ({ ...prev, description: e.target.value }))}
                    style={{ padding: '1%', width: '98%', height: '60px', resize: 'none', marginTop: '4px', borderRadius: '4px', border: '1px solid lightgray' }} />
                <button style={{ padding: '4px 16px', border: '1px solid white', borderRadius: '4px', color: primary, fontWeight: 700 }} onClick={addSubtitle}>Add</button>
            </>
        }
    </div>;
}

export default AddSubtitle;
