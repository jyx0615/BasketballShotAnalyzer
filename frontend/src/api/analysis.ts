import { AnalysisResult } from '../types/analysis';
import axios from 'axios';
import { API_ENDPOINTS } from './config';

export async function analyzeShot(
  video: File,
  type: 'comparison' | 'individual',
  comparisonVideo?: File
): Promise<AnalysisResult> {
  const formData = new FormData();
  formData.append('video', video);

  if (type === 'comparison' && comparisonVideo) {
    formData.append('comparison_video', comparisonVideo);
    try{
      const response1 = await axios.post(API_ENDPOINTS.analyze.comparison, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });
      const feedback = response1.data.feedback;
      const filename = response1.data.filename;

      const response2 = await axios.get(`${API_ENDPOINTS.image.release}/${filename}`, {
        responseType: 'blob' // Set the response type to 'blob'
      });
      const imgBlob = new Blob([response2.data], { type: response2.headers['content-type'] });
      const imgUrl = URL.createObjectURL(imgBlob);

      const response4 = await axios.get(`${API_ENDPOINTS.image.lowest}/${filename}`, {
        responseType: 'blob' // Set the response type to 'blob'
      });
      const imgBlob2 = new Blob([response4.data], { type: response4.headers['content-type'] });
      const imgUrl2 = URL.createObjectURL(imgBlob2);

      const response3 = await axios.get(`${API_ENDPOINTS.video.compare}/${filename}`, {
        responseType: 'blob' // Set the response type to 'blob'
      });
      const videoBlob = new Blob([response3.data], { type: response3.headers['content-type'] });
      const videoUrl = URL.createObjectURL(videoBlob);

      return {
        "type": type,
        "score": 40,
        "keyFrames": [
          {
            "url": imgUrl2,
            "label": "lowest compare"
          },
          {
            "url": imgUrl,
            "label": "release compare"
          },
        ],
        "feedback": [
          {
            "title": "問題",
            "content": feedback.problem,
            "type": "primary"
          }, 
          {
            "title": "教練建議",
            "content": feedback.instruction,
            "type": "secondary"
          },
          {
            "title": "訓練計畫",
            "content": feedback.practice,
            "type": "primary"
          }
        ],
        "videoUrl": videoUrl
      };
    } catch (error) {
      console.error('Error during analysis:', error);
      throw error;
    }
  } else {
    try {
      const response1 = await axios.post(API_ENDPOINTS.analyze.individual, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });
      const feedback = response1.data.feedback;
      const filename = response1.data.filename;
  
      const response2 = await axios.get(`${API_ENDPOINTS.image.path}/${filename}`, {
        responseType: 'blob' // Set the response type to 'blob'
      });
      const imgBlob = new Blob([response2.data], { type: response2.headers['content-type'] });
      const imgUrl = URL.createObjectURL(imgBlob);
  
      const response3 = await axios.get(`${API_ENDPOINTS.video.path}/${filename}`, {
        responseType: 'blob' // Set the response type to 'blob'
      });
      const videoBlob = new Blob([response3.data], { type: response3.headers['content-type'] });
      const videoUrl = URL.createObjectURL(videoBlob);

      return {
        "type": type,
        "score": 58,
        "keyFrames": [{
          "url": imgUrl,
          "label": "shot path"
        }],
        "feedback": [
          {
            "title": "問題",
            "content": feedback.problem,
            "type": "primary"
          }, 
          {
            "title": "教練建議",
            "content": feedback.instruction,
            "type": "secondary"
          },
          {
            "title": "訓練計畫",
            "content": feedback.practice,
            "type": "primary"
          }
        ],
        "videoUrl": videoUrl
      };
    } catch (error) {
      console.error('Error during analysis:', error);
      throw error;
    }
  } 
}