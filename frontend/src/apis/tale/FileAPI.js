import FileInstance from './FileInstance';

const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await FileInstance.post('/file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }

  return response.data;
};

const downloadFile = async (fileName) => {
  try {
    const response = await FileInstance.get(`/download/${fileName}`, {
      responseType: 'blob',
    });

    const blobFile = window.URL.createObjectURL(new Blob([response.data]));
    const downloadElement = document.createElement('a');

    downloadElement.href = blobFile;
    downloadElement.setAttribute('download', fileName);

    document.body.appendChild(link);
    link.click();
    document.remove();
  } catch (error) {
    console.log('download failed', error);
    throw error;
  }
};

export { uploadFile, downloadFile };
