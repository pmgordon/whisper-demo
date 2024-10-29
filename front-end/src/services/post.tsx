export const postAudio = async (blob: any) => {
    const rawResponse = await fetch('/api/transcribe', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({base64Webm: blob})
      });
      const content = await rawResponse.json();
      return content
}


export const getAudio = async (text: any) => {
    const rawResponse = await fetch('/api/get-audio', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({text: text})
      });
      const content = await rawResponse.json();
      return content

}