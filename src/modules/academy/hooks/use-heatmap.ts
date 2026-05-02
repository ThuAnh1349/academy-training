import { useState } from 'react';

// Heatmap toggle hook based on original implementation
export function useHeatmap() {
  const [hmVisible, setHmVisible] = useState(false);

  const toggleHeatmap = () => {
    setHmVisible(!hmVisible);
  };

  return { hmVisible, toggleHeatmap };
}
