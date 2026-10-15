import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NavigationSection } from '@/types/navigation';
import { MovieItem } from '@/types/content';

interface NavigationState {
  activeSection: NavigationSection;
  mobileMenuOpen: boolean;
  selectedMovieForModal: MovieItem | null;
  searchModalOpen: boolean;
  searchPreviewQuery: string;
}

const initialState: NavigationState = {
  activeSection: 'feed',
  mobileMenuOpen: false,
  selectedMovieForModal: null,
  searchModalOpen: false,
  searchPreviewQuery: '',
};

export const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    setActiveSection: (state, action: PayloadAction<NavigationSection>) => {
      state.activeSection = action.payload;
      state.mobileMenuOpen = false; // close mobile menu on selection
    },
    setMobileMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.mobileMenuOpen = action.payload;
    },
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    openMovieModal: (state, action: PayloadAction<MovieItem>) => {
      state.selectedMovieForModal = action.payload;
    },
    closeMovieModal: (state) => {
      state.selectedMovieForModal = null;
    },
    openSearchModal: (state) => {
      state.searchModalOpen = true;
    },
    closeSearchModal: (state) => {
      state.searchModalOpen = false;
    },
    setSearchPreviewQuery: (state, action: PayloadAction<string>) => {
      state.searchPreviewQuery = action.payload;
    },
  },
});

export const {
  setActiveSection,
  setMobileMenuOpen,
  toggleMobileMenu,
  openMovieModal,
  closeMovieModal,
  openSearchModal,
  closeSearchModal,
  setSearchPreviewQuery,
} = navigationSlice.actions;

export default navigationSlice.reducer;
