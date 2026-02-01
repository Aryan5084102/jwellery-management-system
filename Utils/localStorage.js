// Example: To save/load data from localStorage (call in slices if needed)
export const saveToLocalStorage = (key, data) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(data));
  }
};

export const loadFromLocalStorage = (key) => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }
  return [];
};