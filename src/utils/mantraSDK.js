const uri = "https://localhost:8003/mfs100/";

export const captureFinger = async (quality, timeout) => {
  const MFS100Request = {
    Quality: quality,
    TimeOut: timeout
  };

  try {
    const response = await fetch(`${uri}capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(MFS100Request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { httpStaus: true, data };
  } catch (error) {
    console.error('Error:', error);
    return { httpStaus: false, err: error.message };
  }
};

export const getMFS100Info = async () => {
  try {
    const response = await fetch(`${uri}info`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return { httpStaus: true, data };
  } catch (error) {
    return { httpStaus: false, err: error.message };
  }
};