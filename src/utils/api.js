export const apiFetch = async (endpoint, options = {}) => {
    const token = localStorage.getItem('admin_token');
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8787/api';

    const headers = {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers
    };

    // If body is NOT FormData and Content-Type isn't explicitly set, default to JSON
    if (options.body && !(options.body instanceof FormData) && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
    }

    try {
        const res = await fetch(`${apiBase}${endpoint}`, {
            ...options,
            headers
        });

        if (res.status === 401) {
            if (window.location.pathname.startsWith('/admin')) {
                localStorage.removeItem('admin_token');
                window.location.href = '/edit';
            }
            throw new Error('Unauthorized: Session expired');
        }

        return res;
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};
