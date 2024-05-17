import create from 'zustand';
import { getCharacters } from '../apis/characterApi';

const useCharacterStore = create((set) => ({
    characters: [],
    fetchCharacters: async () => {
        try {
            const response = await getCharacters();
            set({ characters: response.data[0].characters });
        } catch (error) {
            console.error('Failed to fetch characters:', error);
        }
    },
}));

export default useCharacterStore;
