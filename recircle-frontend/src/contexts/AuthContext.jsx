import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '@/lib/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try {
            const stored = localStorage.getItem('auth_user');
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    });
    const [loading, setLoading] = useState(true);

    // Verifikasi token ke server sekali saat app mount
    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        if (!token) {
            setLoading(false);
            return;
        }

        api.get('/profile') // Pakai /profile yang sudah dilindungi auth:sanctum
            .then((res) => {
                const userData = res.data?.data ?? null;
                if (userData) {
                    setUser(userData);
                    localStorage.setItem('auth_user', JSON.stringify(userData));
                }
                // Jika userData null tapi tidak error, biarkan user dari localStorage tetap ada
            })
            .catch((err) => {
                // Hanya logout jika server mengatakan 401 (token benar-benar tidak valid)
                if (err.response?.status === 401) {
                    setUser(null);
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('auth_user');
                }
                // Error lain (network, 500, dsb) — jangan logout, biarkan user tetap login
            })
            .finally(() => setLoading(false));
    }, []);

    /**
     * Simpan token & user setelah login berhasil.
     * Dipanggil dari Login.jsx / Register.jsx
     */
    const loginSuccess = useCallback((token, userData) => {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('auth_user', JSON.stringify(userData));
        setUser(userData);
    }, []);

    /**
     * Logout — hapus token, user, redirect ke /login
     */
    const logout = useCallback(async () => {
        try {
            await api.post('/logout');
        } catch {
            // Tetap logout lokal meskipun API gagal
        } finally {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
            setUser(null);
            window.location.href = '/login';
        }
    }, []);

    /**
     * Refresh user data dari server (dipanggil setelah update profil, dll)
     */
    const refreshUser = useCallback(async () => {
        try {
            const res = await api.get('/profile');
            const userData = res.data?.data ?? null;
            if (userData) {
                setUser(userData);
                localStorage.setItem('auth_user', JSON.stringify(userData));
            }
        } catch {
            // Diam saja jika gagal
        }
    }, []);

    const isAdmin = user?.role === 'admin';
    const isSeller = user?.role === 'seller' || user?.is_seller === true;
    const isLoggedIn = !!user;

    return (
        <AuthContext.Provider value={{ user, loading, loginSuccess, logout, refreshUser, isAdmin, isSeller, isLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}

export default AuthContext;
