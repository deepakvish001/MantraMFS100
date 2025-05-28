import React, { useState } from 'react';
import { captureFinger } from '../utils/mantraSDK';
import scanningGif from '../../scanning.gif';
import './FingerScanner.css';

const FingerScanner = () => {
  const [fingerprints, setFingerprints] = useState({
    finger1: scanningGif,
    finger2: scanningGif,
    finger3: scanningGif,
    finger4: scanningGif
  });

  const handleCapture = async (fingerId) => {
    setFingerprints(prev => ({
      ...prev,
      [fingerId]: scanningGif
    }));

    setTimeout(async () => {
      try {
        const quality = 60;
        const timeout = 10;
        const res = await captureFinger(quality, timeout);
        
        if (res.httpStaus && res.data) {
          setFingerprints(prev => ({
            ...prev,
            [fingerId]: `data:image/bmp;base64,${res.data.BitmapData}`
          }));
        }
      } catch (error) {
        console.error('Error capturing fingerprint:', error);
      }
    }, 1000);
  };

  return (
    <div className="container">
      {[1, 2, 3, 4].map((num) => (
        <div key={num} className="fingerbox">
          <img
            id={`fingerImg${num}`}
            className="capturedImg"
            src={fingerprints[`finger${num}`]}
            alt={`Finger ${num}`}
          />
          <br />
          <button
            className="btnReadThumbs"
            onClick={() => handleCapture(`finger${num}`)}
          >
            Capture Finger{num}
          </button>
        </div>
      ))}
    </div>
  );
};

export default FingerScanner;