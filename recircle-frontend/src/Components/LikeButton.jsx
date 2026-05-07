import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from '@/lib/axios';

export default function LikeButton({ productId, className = "" }) {
    const navigate = useNavigate();
    const [isGuest, setIsGuest] = useState(true);
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        // Fetch current authenticated user to see if they liked this product
        axios.get('/user')
            .then(response => {
                const user = response.data.data;
                setIsGuest(false);
                const wishlistIds = user?.wishlist_ids || response.data.wishlist_ids || [];
                setIsLiked(wishlistIds.includes(productId));
            })
            .catch(() => {
                setIsGuest(true);
                setIsLiked(false);
            });
    }, [productId]);

    const handleToggle = async (e) => {
        e.preventDefault(); // Prevent Link navigation if wrapped inside Link
        e.stopPropagation();

        if (isGuest) {
            navigate('/login');
            return;
        }

        // Optimistic UI update
        const previousState = isLiked;
        setIsLiked(!isLiked);

        try {
            await axios.post(`/wishlist/${productId}/toggle`);
        } catch (err) {
            console.error('Toggle wishlist error:', err);
            // Revert on error
            setIsLiked(previousState);
        }
    };

    return (
        <button
            onClick={handleToggle}
            className={`p-3 bg-white/80 backdrop-blur rounded-full hover:bg-white text-gray-400 hover:text-red-500 transition-all shadow-sm group ${className}`}
            aria-label={isLiked ? "Hapus dari wishlist" : "Tambah ke wishlist"}
        >
            <Heart 
                className={`w-5 h-5 transition-transform group-hover:scale-110 group-active:scale-95 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} 
            />
        </button>
    );
}
