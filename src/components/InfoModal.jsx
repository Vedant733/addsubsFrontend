/* eslint-disable react/prop-types */
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useRef } from 'react';
import { secondary } from '../extra/colors';
import { toast } from 'react-toastify';
import axios from 'axios';
import { ADD_SUBTITLE, ADD_VIDEO } from '../constants';

const style = {
    gap: '8px',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    display: 'flex', alignItems: 'center',
    borderRadius: '4px'
};

export default function InfoModal({ open, setOpen, subtitleList, videoFile, clearAll }) {
    const handleClose = () => setOpen(false);
    const inputRef = useRef(null)
    const vidNameInputRef = useRef(null)
    const handleSaveClick = async () => {
        if (!vidNameInputRef.current.value?.trim().length) return toast.error("Subtitle Name Required.")
        if (!inputRef.current.value?.trim().length) return toast.error("Subtitle Name Required.")
        try {
            const formData = new FormData();
            formData.append('video', videoFile);
            formData.append('title', vidNameInputRef.current.value.trim());
            await axios.post(ADD_VIDEO, formData).then(() => toast.success("Video Added"))
            await axios.post(ADD_SUBTITLE, {
                name: inputRef.current.value.trim(),
                subtitle: subtitleList
            }).then(() => toast.success("Subtitle Added."))
        } catch (err) {
            toast.error("Error Occured.")
        } finally {
            setOpen(false)
            clearAll()
        }
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <input ref={vidNameInputRef} style={{ padding: '12px 16px', borderRadius: '4px', width: '80%' }} placeholder="Video Name" />
                <input ref={inputRef} style={{ padding: '12px 16px', borderRadius: '4px', width: '80%' }} placeholder="Subtitle Name" />
                <button style={{ padding: '12px 16px', fontWeight: 600, background: secondary, borderRadius: '4px', border: 'none', color: 'white' }} onClick={handleSaveClick}>Save</button>
            </Box>
        </Modal>
    );
}
