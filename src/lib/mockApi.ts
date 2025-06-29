// Mock API for development
import songsData from '../../songs.json';

export interface ApiSong {
  id: number;
  title: string;
  url: string;
}

class MockApi {
  private songs: ApiSong[] = [...songsData]; // Create a copy to avoid mutating the original

  async getSongs(): Promise<ApiSong[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return this.songs;
  }

  async uploadSong(title: string, url: string): Promise<{ message: string; song: ApiSong }> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const song: ApiSong = {
      id: Date.now(),
      title,
      url
    };
    
    this.songs.unshift(song); // Add to beginning of array
    
    return { message: 'Song uploaded successfully', song };
  }
}

export const mockApi = new MockApi(); 