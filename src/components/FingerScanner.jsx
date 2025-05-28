import React, { useState, useEffect } from 'react';
import { captureFinger, getMFS100Info } from '../utils/mantraSDK';
import scanningGif from '../../scanning.gif';
import './FingerScanner.css';

const FingerScanner = () => {
  const [fingerprints, setFingerprints] = useState({
    finger1: scanningGif,
    finger2: scanningGif,
    finger3: scanningGif,
    finger4: scanningGif
  });
  const [error, setError] = useState(null);
  const [isDeviceConnected, setIsDeviceConnected] = useState(false);

  useEffect(() => {
    checkDeviceConnection();
  }, []);

  const checkDeviceConnection = async () => {
    try {
      const deviceInfo = await getMFS100Info();
      if (deviceInfo.httpStaus && deviceInfo.data) {
        setIsDeviceConnected(true);
        setError(null);
      } else {
        setIsDeviceConnected(false);
        setError('Fingerprint scanner not connected. Please ensure the Mantra MFS100 service is running at https://localhost:8003');
      }
    } catch (err) {
      setIsDeviceConnected(false);
      setError('Unable to connect to fingerprint scanner. Please ensure the Mantra MFS100 service is running at https://localhost:8003');
    }
  };

  const handleCapture = async (fingerId) => {
    if (!isDeviceConnected) {
      await checkDeviceConnection();
      if (!isDeviceConnected) {
        return;
      }
    }

    setError(null);
    setFingerprints(prev => ({
      ...prev,
      [fingerId]: scanningGif
    }));

    try {
      const quality = 60;
      const timeout = 10;
      const res = await captureFinger(quality, timeout);
      
      if (res.httpStaus && res.data) {
        setFingerprints(prev => ({
          ...prev,
          [fingerId]: `data:image/bmp;base64,${res.data.BitmapData}`
        }));
      } else {
        throw new Error('Failed to capture fingerprint');
      }
    } catch (error) {
      console.error('Error capturing fingerprint:', error);
      setError('Failed to capture fingerprint. Please ensure your finger is properly placed on the scanner.');
      setFingerprints(prev => ({
        ...prev,
        [fingerId]: scanningGif
      }));
    }
  };

  return (
    <div className="container">
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
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
            disabled={!isDeviceConnected}
          >
            Capture Finger{num}
          </button>
        </div>
      ))}
    </div>
  );
};

export default FingerScanner;