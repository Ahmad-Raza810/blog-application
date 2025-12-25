import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        // Scroll the #root element which is the actual scroll container
        const root = document.getElementById('root');
        if (root) {
            root.scrollTo(0, 0);
        }
        // Also scroll window as fallback
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}
