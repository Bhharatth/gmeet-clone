import React, { useEffect } from 'react'

const video = ({stream}) => {
    const videoRef = useRef();
    useEffect(()=> {
        if(videoRef && videoRef.current){
            videoRef.current.srcObject = stream;
        }

    },[videoRef, stream]);
  return (
    <div>
        <div>
            <video style={{borderRadius:10}} ref={videoRef} muted width="100%" autoPlay={true} playsInline={true}/>
        </div>
    </div>
  )
}

export default video