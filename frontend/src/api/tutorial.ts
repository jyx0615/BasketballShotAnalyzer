import axios from 'axios';

export async function fetchRandomTutorial(): Promise<string> {
  try {
    const response = await axios.get("http://127.0.0.1:5000/api/tutorial");
    return response.data.tutorial_link;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch tutorial');
  }
}