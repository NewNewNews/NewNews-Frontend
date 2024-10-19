"use client";

import React, { useState } from 'react';
import axios from 'axios';

const NewsToSpeech = () => {
  const [newsContent, setNewsContent] = useState('');
  const [audioUrl, setAudioUrl] = useState('');

  const handleConvert = async () => {
    try {
      const response = await axios.post(
        '/api/read-aloud',
        { content: newsContent },
        { responseType: 'blob' }
      );

      const audioBlob = new Blob([response.data], { type: 'audio/mp3' });
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(audioUrl);
    } catch (error) {
      console.error('Error generating audio:', error);
      alert('Failed to convert text to speech');
    }
  };

  return (
    <div className="p-4">
      <textarea
        rows={4}
        className="border w-full p-2"
        value={newsContent}
        onChange={(e) => setNewsContent(e.target.value)}
        placeholder="Enter news content..."
      />
      <button
        onClick={handleConvert}
        className="bg-blue-500 text-white px-4 py-2 mt-2 rounded"
      >
        Convert to Speech
      </button>

      {audioUrl && (
        <div className="mt-4">
          <audio controls>
            <source src={audioUrl} type="audio/mp3" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
};

export default NewsToSpeech;
