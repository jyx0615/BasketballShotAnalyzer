import axios from 'axios';
import { API_ENDPOINTS } from './config';

export async function fetchRandomTutorial(): Promise<string> {
  try {
    const response = await axios.get(API_ENDPOINTS.tutorial);
    return response.data.tutorial_link;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch tutorial');
  }
}