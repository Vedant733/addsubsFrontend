import React from 'react';
import VideoPlayer from './components/VideoPlayer';
import { ToastContainer, toast } from 'react-toastify';
import Onboarding from './components/Onboarding';
import { useQuery } from 'react-query'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import WatchMovie from './components/WatchMovie';
import { WELCOME_API } from './constants';
import axios from 'axios';


function App() {
  useQuery('WELCOME_API', () => axios.get(WELCOME_API), {
    onSuccess: () => {
      const welcome = sessionStorage.getItem('welcome')
      if (welcome) return;
      toast.success('Welcome')
      sessionStorage.setItem('welcome', 'welcome')
    },
    onError: () => {
      toast.warning('Server Starting...Wait A Few Minutes')
    },
    retryDelay: 10000,
    retry: 1
  })

  // const playerRef = React.useRef(null);
  const [videoUrl, setVideoUrl] = React.useState(null)
  const [onBoardingDone, setOnBoardingDone] = React.useState(false)
  const [videoFile, setVideoFile] = React.useState(null)
  const clearAll = () => {
    setOnBoardingDone(false)
    setVideoFile(null)
    setVideoUrl(null)
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/'
          element={
            !onBoardingDone
              ? <Onboarding
                videoUrl={videoUrl}
                setVideoUrl={setVideoUrl}
                videoFile={videoFile}
                setVideoFile={setVideoFile}
                setOnBoardingDone={setOnBoardingDone}
              />
              : <VideoPlayer
                url={videoUrl}
                videoFile={videoFile} clearAll={clearAll} />
          }
        />
        <Route path='/watch' element={<WatchMovie />} />
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  )
}

export default App
