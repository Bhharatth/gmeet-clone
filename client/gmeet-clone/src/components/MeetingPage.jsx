import React, { useEffect, useState } from "react";
import { CentralizedCard } from "./CentralCard";
import { Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import socketIO from 'socket.io-client';

let pc = new RTCPeerConnection({
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302",
    },
  ],
});

const MeetingPage = () => {
  const [socket, setSocket] = useState(null);
  const [meetingJoined, setMeetingJoined] = useState(null);
  const [videoStream, setVideoStream] = useState();
  const [remoteVideoStream, setRemoteVideoStream] = useState();

  const params = useParams();
  const roomId = params.roomId;

  useEffect(() => {
    const s = socketIO.connect("http://localhost:3001");
    s.on("connect", () => {
      setSocket(s);
      s.emit("join", { roomId });
   

    window.navigator.mediaDevices
      .getUserMedia({
        video: true,
      })
      .then(async (stream) => {
        setVideoStream(stream);
      });

      s.on("localDescriotion", async ({description})=> {
        console.log({description});
        pc.setRemoteDescription(description);
        pc.ontrack=(e)=> {
            setRemoteVideoStream(new MediaStream([e.track]));
        };
        s.on("iceCandidate", ({candidate})=> {
            pc.addIceCandidate(candidate);
          });
    
          pc.onicecandidate = ({candidate})=> {
            s.emit("icecandidateReplay", {candidate});
          };
    
          await pc.setLocalDescription(await pc.createAnswer());
          s.emit("remoteDescription", {description: pc.localDescription});
      });
      s.on("remoteDescription", async ({description})=> {
        pc.setRemoteDescription(description);

        pc.ontrack=(e)=> {
            setRemoteVideoStream(new MediaStream([e.track]));
        };

        s.on("iceCandidate", ({candidate})=> {
            pc.addIceCandidate(candidate);
        });

        pc.onicecandidate=({candidate})=> {
            s.emit("iceCandidateReplay", {candidate});
        }
      })
    });

    

  }, []);



  return (
    <div style={{ minHeight: "100vh" }}>
      <CentralizedCard>
        <div>
          <Typography textAlign={"center"} variant="h5">
            Hi welcome to meeting {roomId}
          </Typography>
        </div>
        <br />
        <br />
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button
            onClick={async () => {
              pc.onicecandidate = ({ candidate }) => {
                socket.emit("iceCandidate", { candidate });
              };
              pc.addTrack(videoStream.getVideoTracks()[0]);//sending video

              try {
                await pc.setLocalDescription(await pc.createOffer());
                console.log({ aa: pc.localDescription });
                socket.emit("localDescription", {
                  description: pc.localDescription,
                });
              } catch (err) {
                console.log({ msg: err.message });
              }
            }}
          >Connect</button>
        </div>
      </CentralizedCard>
    </div>
  );
};

export default MeetingPage;







