
const STORAGE_KEY = 'recentSearches';

export const getRecentSearches = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const addRecentSearch = (term) => {
  let searches = getRecentSearches();
  // Remove if already exists, to avoid duplicates
  searches = searches.filter(item => item !== term);
  // Add to front
  searches.unshift(term);
  // Limit to 5 items
  if (searches.length > 5) {
    searches = searches.slice(0, 5);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(searches));
  return searches;
};

export const clearRecentSearches = () => {
  localStorage.removeItem(STORAGE_KEY);
};

