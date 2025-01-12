import { LoadingSpinner } from '../shared/LoadingSpinner';
import ReactPlayer from 'react-player';

interface TutorialVideoProps {
  url: string | null;
  isLoading: boolean;
}

export function TutorialVideo({ url, isLoading }: TutorialVideoProps) {
  return (
    <>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <LoadingSpinner size={40} />
        </div>
      )}
      {url && (
        <ReactPlayer url={url} controls />
      )}
    </>
  );
}