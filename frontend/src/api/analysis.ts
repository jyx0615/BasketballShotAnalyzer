import { AnalysisResult } from '../types/analysis';
import axios from 'axios';

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
      // Use mock service instead of real API
      const response1 = await axios.post("http://127.0.0.1:5000/api/analyze/comparison", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });
      const feedback = response1.data.feedback;
      const filename = response1.data.filename;

      const response2 = await axios.get(`http://127.0.0.1:5000/api/release/image/${filename}`, {
        responseType: 'blob' // Set the response type to 'blob'
      });
      const imgBlob = new Blob([response2.data], { type: response2.headers['content-type'] });
      const imgUrl = URL.createObjectURL(imgBlob);

      const response4 = await axios.get(`http://127.0.0.1:5000/api/lowest/image/${filename}`, {
        responseType: 'blob' // Set the response type to 'blob'
      });
      const imgBlob2 = new Blob([response4.data], { type: response4.headers['content-type'] });
      const imgUrl2 = URL.createObjectURL(imgBlob2);

      const response3 = await axios.get(`http://127.0.0.1:5000/api/compare/video/${filename}`, {
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
      // Use mock service instead of real API
      const response1 = await axios.post("http://127.0.0.1:5000/api/analyze/individual", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });
      const feedback = response1.data.feedback;
  
      const response2 = await axios.get(`http://127.0.0.1:5000/api/path/image/${response1.data.filename}`, {
        responseType: 'blob' // Set the response type to 'blob'
      });
      const imgBlob = new Blob([response2.data], { type: response2.headers['content-type'] });
      const imgUrl = URL.createObjectURL(imgBlob);
  
      const response3 = await axios.get(`http://127.0.0.1:5000/api/path/video/${response1.data.filename}`, {
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