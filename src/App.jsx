import React from 'react';
import VideoPlayer from './components/VideoPlayer';
import { ToastContainer } from 'react-toastify';
import Onboarding from './components/Onboarding';
import { QueryClient, QueryClientProvider } from 'react-query'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import WatchMovie from './components/WatchMovie';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchIntervalInBackground: false,
      refetchInterval: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false
    }
  }
});

function App() {

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
      <QueryClientProvider client={queryClient}>
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
      </QueryClientProvider>
    </BrowserRouter>
  )
}

export default App
