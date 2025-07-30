// src/components/OCRReader.tsx
import React, { useState } from 'react';
import Tesseract from 'tesseract.js';

const OCRReader = () => {
  const [text, setText] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleOCR = () => {
    if (!image) return;

    setLoading(true);
    Tesseract.recognize(image, 'eng', {
      logger: m => console.log(m), // Progress logger (optional)
    }).then(({ data: { text } }) => {
      setText(text);
      setLoading(false);
    });
  };

  return (
    <div className="p-4">
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <button
        className="mt-2 p-2 bg-blue-500 text-white rounded"
        onClick={handleOCR}
        disabled={loading || !image}
      >
        {loading ? 'Scanning...' : 'Extract Text'}
      </button>

      {text && (
        <div className="mt-4 p-2 border rounded bg-gray-100 whitespace-pre-wrap">
          <h3 className="font-bold">Extracted Text:</h3>
          {text}
        </div>
      )}
    </div>
  );
};

export default OCRReader;
