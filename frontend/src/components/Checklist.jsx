import { useState, useEffect, useRef } from 'react';
import '../styles/Checklist.css';

export default function Checklist({ user, token, onSubmit }) {
  const [checklist, setChecklist] = useState({
    workout_1: false,
    workout_2: false,
    reading_pages: 0,
    no_alcohol: false,
    clean_eating: false,
    photo_url: null,
  });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTodaysChecklist();
  }, [token]);

  const fetchTodaysChecklist = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/checklist/today`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      setChecklist(data);
      setSubmitted(data.completed || false);
    } catch (err) {
      console.error('Failed to fetch checklist:', err);
    }
  };

  const photoInputRef = useRef(null);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoPreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoClick = () => {
    photoInputRef.current?.click();
  };

  const handleCheckboxChange = (field) => {
    setChecklist(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handlePagesChange = (e) => {
    const value = Math.min(parseInt(e.target.value, 10) || 0, 999);
    setChecklist(prev => ({
      ...prev,
      reading_pages: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let photoBase64 = null;
      if (photo) {
        const reader = new FileReader();
        photoBase64 = await new Promise((resolve) => {
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(photo);
        });
      }

      const payload = {
        ...checklist,
        photo: photoBase64,
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/checklist/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Failed to submit checklist');
        setLoading(false);
        return;
      }

      const result = await response.json();
      setChecklist(result);
      setPhoto(null);
      setPhotoPreview(null);
      setSubmitted(true);
      onSubmit();

      // Reset submission status after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setError('Connection error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isComplete = checklist.workout_1 && checklist.workout_2 &&
                     checklist.reading_pages >= 10 &&
                     checklist.no_alcohol && checklist.clean_eating && photoPreview;

  return (
    <div className="checklist-container">
      <form onSubmit={handleSubmit} className="checklist-form">
        <h2>Today's Challenges</h2>

        <div className="checklist-item">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={checklist.workout_1}
              onChange={() => handleCheckboxChange('workout_1')}
              disabled={submitted}
            />
            <span className="icon">💪</span>
            <span className="text">Workout 1</span>
          </label>
        </div>

        <div className="checklist-item">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={checklist.workout_2}
              onChange={() => handleCheckboxChange('workout_2')}
              disabled={submitted}
            />
            <span className="icon">🏋️</span>
            <span className="text">Workout 2</span>
          </label>
        </div>

        <div className="checklist-item">
          <label className="label-text">📖 Pages Read: {checklist.reading_pages}/10</label>
          <input
            type="number"
            min="0"
            max="999"
            value={checklist.reading_pages || ''}
            onChange={handlePagesChange}
            disabled={submitted}
            className="pages-input"
          />
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${Math.min(checklist.reading_pages, 10) * 10}%` }}></div>
          </div>
        </div>

        <div className="checklist-item">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={checklist.no_alcohol}
              onChange={() => handleCheckboxChange('no_alcohol')}
              disabled={submitted}
            />
            <span className="icon">🚫</span>
            <span className="text">No Alcohol</span>
          </label>
        </div>

        <div className="checklist-item">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={checklist.clean_eating}
              onChange={() => handleCheckboxChange('clean_eating')}
              disabled={submitted}
            />
            <span className="icon">🥗</span>
            <span className="text">Clean Eating</span>
          </label>
        </div>

        <div className="checklist-item photo-upload">
          <label className="label-text">📸 Upload Photo Proof</label>
          <div className="photo-input-wrapper" onClick={handlePhotoClick}>
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              disabled={submitted}
              className="photo-input"
            />
            <span className="upload-text">Click to upload or take photo</span>
          </div>
          {photoPreview && (
            <div className="photo-preview">
              <img src={photoPreview} alt="Preview" />
            </div>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}

        {submitted && (
          <div className="success-message">✅ Checklist submitted! Great job today!</div>
        )}

        <button
          type="submit"
          disabled={loading || !isComplete || submitted}
          className={`submit-btn ${isComplete && !submitted ? 'enabled' : ''}`}
        >
          {submitted ? '✅ Submitted for Today' : loading ? 'Submitting...' : `Submit Checklist (${isComplete ? '✅' : '❌'})`}
        </button>

        <p className="checklist-hint">Complete all items and upload a photo to submit</p>
      </form>
    </div>
  );
}
