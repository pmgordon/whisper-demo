import React, { useEffect, useRef, useState } from 'react';
import logo from './logo.svg';
import { Box, Button, Card, CardContent, Container, CssBaseline, FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput, Typography } from '@mui/material';
import { Mic } from '@mui/icons-material';
import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';
import { getAudio, postAudio } from './services/post';

interface Chat {
  id: number;
  message: string;
  // Add other properties as needed
}

function App() {

  let isAResend = useRef(false);
  let isAudioResend = useRef(false);

  const recordingControls = useAudioRecorder();
  const [audioData, setAudioData] = useState("");

  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    if(isAudioResend.current) {
      return
    }
    isAudioResend.current = true;

    if (audioData) {
      let audio = new Audio(audioData);
      audio.play();
    }
  }, [audioData]);

  const GetChats = () => {
    return (
      <div>
        {chats.map(function (data: any) {
          return (
            <div key={data.messageId} style={{ marginTop: "10px" }}>
              <Card sx={{ minWidth: 275 }}>
                <CardContent>
                  <Typography variant="body2">
                    {data.response}
                  </Typography>
                </CardContent>
              </Card>
            </div>
          )
        })}
      </div>
    )
  }


  const handleEchoAudio = async (input: string) => {
    const audio = await getAudio(input)
    console.log(audio)
    setAudioData(`data:audio/mp3;base64,${audio.content}`);
  }

  const handleClickToSpeak = () => {
    isAResend.current = false;
    isAudioResend.current = false
    recordingControls.startRecording()

  }

  const handleHandleStop = () => {
    recordingControls.stopRecording()
  }

  const preparePost = async (blob: any) => {
    if(isAResend.current) {
      return
    }

    isAResend.current = true;
    var reader = new FileReader
    reader.readAsDataURL(blob)
    reader.onload = async () => {
      console.log("Here")
      const response = await postAudio(reader.result)
      setChats(prevChats => {
        return [
          ...prevChats,
          response
        ]
      })
      handleEchoAudio(response.response)
    };

  }

  useEffect(() => {
    if (!recordingControls.recordingBlob) return;
    console.log("Here")
    preparePost(recordingControls.recordingBlob)
  }, [recordingControls.recordingBlob])


  const addAudioElement = (blob: Blob | MediaSource) => {
    const url = URL.createObjectURL(blob);
    const audio = document.createElement("audio");
    audio.src = url;
    audio.controls = true;
    document.body.appendChild(audio);
  };

  return (
    <div className="App">
      <Container maxWidth="sm">
        <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-chat">Chat</InputLabel>
          <OutlinedInput
            id="outlined-adornment-chat"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onMouseDown={handleClickToSpeak}
                  onMouseUp={handleHandleStop}
                  edge="end"
                >
                  <Mic />
                </IconButton>
              </InputAdornment>
            }
            label="Chat"
          />
        </FormControl>
        <GetChats />
      </Container>
    </div>
  );
}

export default App;
