import { VideoUploadProps } from '../../../types/video';
import { UploadArea } from './UploadArea';
import { Toast } from '../Toast';
import { useVideoUpload } from './useVideoUpload';
import { useToast } from '../../../hooks/useToast';
import { useTheme } from '../../../contexts/ThemeContext';

export function VideoUpload({ label, onChange }: VideoUploadProps) {
  const { colors } = useTheme();
  const { isVisible, message, showToast, hideToast } = useToast();
  
  const { 
    uploadedFile,
    previewUrl,
    handleFileChange,
    handleDelete
  } = useVideoUpload((file) => {
    onChange(file);
    showToast('Video uploaded successfully!');
  });

  return (
    <div className="w-full">
      <label 
        className="block text-sm font-medium mb-2"
        style={{ color: colors.primary }}
      >
        {label}
      </label>
      <UploadArea
        onChange={handleFileChange}
        onDelete={handleDelete}
        previewUrl={previewUrl}
        fileName={uploadedFile?.name}
      />
      {isVisible && (
        <Toast
          message={message}
          onClose={hideToast}
        />
      )}
    </div>
  );
}