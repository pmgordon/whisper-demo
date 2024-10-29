
import uvicorn
import io
import uuid
import base64
from fastapi import FastAPI
from pydantic import BaseModel
from openai import OpenAI
from random import randrange

VOICES = [ "alloy", "echo", "fable", "onyx", "nova",  "shimmer"]


client = OpenAI()

class AudioFile(BaseModel):
    base64Webm: str

class AudioFileResponse(BaseModel):
    response: str
    messageId: str

class TTSInput(BaseModel):
    text: str

class TTSResponse(BaseModel):
    content: bytes

app = FastAPI()


@app.post("/api/transcribe")
async def transcribe(item: AudioFile):
    uuid_message = str(uuid.uuid4())
    base64_data = item.base64Webm.split(",")[1]
    f = io.BytesIO(base64.b64decode(base64_data))
    f.name = "./file.webm"
    transcription = client.audio.transcriptions.create(
    model="whisper-1", 
    file=f
    )
    print(transcription.text)
    repsonse = AudioFileResponse(response=transcription.text, messageId=uuid_message)
    return repsonse

@app.post("/api/get-audio")
async def get_audio(input: TTSInput):
    # voice = VOICES[randrange(6)]

    # completion = client.chat.completions.create(
    # model="gpt-4o-mini",
    # messages=[
    #     {"role": "system", "content": "You are a helpful assistant, you have personal preferences ,  respond in 1 sentence"},
    #     {"role": "user", "content": input.text}
    # ]
    # )

    # response = client.audio.speech.create(
    # model="tts-1",
    # voice=voice,
    # input=f"{completion.choices[0].message.content}"
    # )
    # base64_encoded_data = base64.b64encode(response.content)
    # base64_output = base64_encoded_data.decode('utf-8')
    my_file = open("./output.mp3", "rb")
    my_bytes = my_file.read()
    my_file.close()
    base64_encoded_data = base64.b64encode(my_bytes)
    base64_output = base64_encoded_data.decode('utf-8')

    return TTSResponse(content=base64_output)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
