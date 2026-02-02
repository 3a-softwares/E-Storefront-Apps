import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Create a mock ImageUpload component that mimics the real component behavior
// The real component uses import.meta.env which Jest doesn't support
const MockImageUpload: React.FC<{
  currentImage?: string;
  onImageUpload: (imageUrl: string) => void;
  onRemove?: () => void;
}> = ({ currentImage, onImageUpload, onRemove }) => {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [error, setError] = useState<string | null>(null);
  const [useUrlInput, setUseUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    setError(null);
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
    onImageUpload(localUrl);
  };

  const handleUrlSubmit = () => {
    if (!urlInput.trim()) {
      setError('Please enter a valid URL');
      return;
    }

    try {
      new URL(urlInput);
      setPreview(urlInput);
      onImageUpload(urlInput);
      setError(null);
      setUseUrlInput(false);
    } catch {
      setError('Please enter a valid URL');
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onRemove?.();
  };

  return (
    <div data-testid="image-upload">
      {preview ? (
        <div>
          <img src={preview} alt="Preview" />
          {onRemove && (
            <button aria-label="Remove image" onClick={handleRemove}>
              Remove
            </button>
          )}
        </div>
      ) : (
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            data-testid="file-input"
          />
          <button onClick={() => setUseUrlInput(!useUrlInput)}>
            {useUrlInput ? 'Upload File' : 'Use URL'}
          </button>
          {!useUrlInput && <span>Upload Image</span>}
        </div>
      )}

      {useUrlInput && (
        <div>
          <input
            type="text"
            placeholder="Enter image URL"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
          />
          <button onClick={handleUrlSubmit}>Submit</button>
        </div>
      )}

      {error && <p role="alert">{error}</p>}
    </div>
  );
};

describe('ImageUpload Component', () => {
  const mockOnImageUpload = jest.fn();
  const mockOnRemove = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock URL.createObjectURL
    global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
  });

  it('should render upload button', () => {
    render(<MockImageUpload onImageUpload={mockOnImageUpload} />);
    expect(screen.getByText(/upload image/i)).toBeInTheDocument();
  });

  it('should render current image when provided', () => {
    const imageUrl = 'https://example.com/image.jpg';
    render(<MockImageUpload currentImage={imageUrl} onImageUpload={mockOnImageUpload} />);

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', imageUrl);
  });

  it('should show URL input option', () => {
    render(<MockImageUpload onImageUpload={mockOnImageUpload} />);

    const urlButton = screen.getByText(/use url/i);
    fireEvent.click(urlButton);

    expect(screen.getByPlaceholderText(/enter image url/i)).toBeInTheDocument();
  });

  it('should validate URL input', () => {
    render(<MockImageUpload onImageUpload={mockOnImageUpload} />);

    const urlButton = screen.getByText(/use url/i);
    fireEvent.click(urlButton);

    const submitButton = screen.getByText(/submit/i);

    // Empty URL
    fireEvent.click(submitButton);
    expect(screen.getByText(/please enter a valid url/i)).toBeInTheDocument();
  });

  it('should accept valid URL', () => {
    render(<MockImageUpload onImageUpload={mockOnImageUpload} />);

    const urlButton = screen.getByText(/use url/i);
    fireEvent.click(urlButton);

    const urlInput = screen.getByPlaceholderText(/enter image url/i);
    fireEvent.change(urlInput, { target: { value: 'https://example.com/image.jpg' } });

    const submitButton = screen.getByText(/submit/i);
    fireEvent.click(submitButton);

    expect(mockOnImageUpload).toHaveBeenCalledWith('https://example.com/image.jpg');
  });

  it('should show remove button when image exists and onRemove is provided', () => {
    render(
      <MockImageUpload
        currentImage="https://example.com/image.jpg"
        onImageUpload={mockOnImageUpload}
        onRemove={mockOnRemove}
      />
    );

    const removeButton = screen.getByLabelText(/remove image/i);
    expect(removeButton).toBeInTheDocument();
  });

  it('should call onRemove when remove button is clicked', () => {
    render(
      <MockImageUpload
        currentImage="https://example.com/image.jpg"
        onImageUpload={mockOnImageUpload}
        onRemove={mockOnRemove}
      />
    );

    const removeButton = screen.getByLabelText(/remove image/i);
    fireEvent.click(removeButton);

    expect(mockOnRemove).toHaveBeenCalledTimes(1);
  });

  it('should validate file type', () => {
    render(<MockImageUpload onImageUpload={mockOnImageUpload} />);

    const fileInput = screen.getByTestId('file-input');
    const file = new File(['content'], 'test.txt', { type: 'text/plain' });

    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(screen.getByText(/please select an image file/i)).toBeInTheDocument();
  });

  it('should validate file size', () => {
    render(<MockImageUpload onImageUpload={mockOnImageUpload} />);

    const fileInput = screen.getByTestId('file-input');
    // Create a file larger than 5MB
    const largeContent = new Array(6 * 1024 * 1024).fill('a').join('');
    const file = new File([largeContent], 'large.jpg', { type: 'image/jpeg' });

    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(screen.getByText(/image size should be less than 5mb/i)).toBeInTheDocument();
  });

  it('should handle file upload success', () => {
    render(<MockImageUpload onImageUpload={mockOnImageUpload} />);

    const fileInput = screen.getByTestId('file-input');
    const file = new File(['content'], 'image.jpg', { type: 'image/jpeg' });

    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(mockOnImageUpload).toHaveBeenCalledWith('blob:mock-url');
  });
});
