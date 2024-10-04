import React, { useState, useEffect } from 'react';

const VideoList = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    // Fetch videos from the server
    fetch('/downloads')
      .then(response => response.json())
      .then(data => setVideos(data));
  }, []);

  return (
    <div className="video-list">
      <h1>Scraped Videos</h1>
      <ul>
        {videos.map(video => (
          <li key={video}>
            <a href={`/downloads/${video}`} target="_blank" rel="noopener noreferrer">
              {video}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VideoList;
