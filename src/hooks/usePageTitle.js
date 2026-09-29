import { useEffect } from 'react';

/** Sets the browser tab title: usePageTitle('Favorites') -> "Favorites | Movie Explorer". */
export default function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | Movie Explorer` : 'Movie Explorer';
  }, [title]);
}
