import React, { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Users as UsersIcon,
    Search,
    Shield,
    User as UserIcon,
    Mail,
    Calendar,
    CheckCircle2,
    XCircle,
    Power,
    Edit,
    Trash2,
    Plus,
    Filter,
    X,
    Loader2
} from 'lucide-react';
import api from '@/lib/axios';

export default function AdminUsersPage() {
    const [users, setUsers] = useState({ data: [], current_page: 1, last_page: 1, total: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [role, setRole] = useState('');
    
    // Form Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user',
    });
    const [errors, setErrors] = useState({});

    // Debounce search
    useEffect(() => {
        document.title = "Admin — Kelola Pengguna";
        const delayDebounceFn = setTimeout(() => {
            fetchUsers(1);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [search, role]);

    const fetchUsers = async (page = 1) => {
        setIsLoading(true);
        try {
            const res = await api.get('/admin/users', {
                params: { search, role, page }
            });
            setUsers(res.data.data);
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRoleChange = (newRole) => {
        setRole(newRole);
    };

    const openCreateModal = () => {
        setEditingUser(null);
        setFormData({ name: '', email: '', password: '', role: 'user' });
        setErrors({});
        setIsModalOpen(true);
    };

    const openEditModal = (user) => {
        setEditingUser(user);
        setFormData({
            name: user.name || '',
            email: user.email || '',
            password: '',
            role: user.role || 'user',
        });
        setErrors({});
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setErrors({});
    };

    const handleFormChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // clear error for this field
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        setErrors({});

        try {
            if (editingUser) {
                await api.patch(`/admin/users/${editingUser.id}`, formData);
            } else {
                await api.post('/admin/users', formData);
            }
            closeModal();
            fetchUsers(users.current_page); // refresh current page
        } catch (err) {
            if (err.response && err.response.data.errors) {
                setErrors(err.response.data.errors);
            } else {
                alert(err.response?.data?.message || 'Gagal menyimpan pengguna.');
            }
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
            try {
                await api.delete(`/admin/users/${id}`);
                fetchUsers(users.current_page);
            } catch (err) {
                alert('Gagal menghapus pengguna.');
            }
        }
    };

    const handleToggleStatus = async (id) => {
        if (confirm('Ubah status aktif user ini?')) {
            try {
                await api.post(`/admin/users/${id}/toggle-status`);
                fetchUsers(users.current_page);
            } catch (err) {
                alert('Gagal mengubah status pengguna.');
            }
        }
    };

    // Helper for pagination numbers
    const renderPagination = () => {
        if (users.last_page <= 1) return null;
        
        const pages = [];
        for (let i = 1; i <= users.last_page; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => fetchUsers(i)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all
                        ${users.current_page === i 
                            ? 'bg-[#2c4055] text-white shadow-sm' 
                            : 'bg-white border border-gray-200 text-gray-500 hover:border-[#2c4055] hover:text-[#2c4055]'
                        }`}
                >
                    {i}
                </button>
            );
        }
        return <div className="flex gap-2">{pages}</div>;
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Manajemen Pengguna</h2>
                        <p className="text-gray-500 mt-1">Total {users.total || 0} pengguna terdaftar.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3">
                        <div className="relative w-full sm:w-48">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <select
                                value={role}
                                onChange={(e) => handleRoleChange(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#2c4055]/20 focus:border-[#2c4055] appearance-none"
                            >
                                <option value="">Semua Peran</option>
                                <option value="user">User</option>
                                <option value="seller">Seller</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari nama atau email..."
                                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#2c4055]/20 focus:border-[#2c4055] transition-all"
                            />
                        </div>

                        <button
                            onClick={openCreateModal}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2 bg-[#2c4055] text-white rounded-xl text-sm font-medium hover:bg-[#1f2d3d] transition-all shadow-sm"
                        >
                            <Plus className="w-4 h-4" />
                            Tambah User
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Pengguna</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Kontak</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Peran</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center">
                                            <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-2" />
                                            <p className="text-sm text-gray-500">Memuat data pengguna...</p>
                                        </td>
                                    </tr>
                                ) : users?.data?.length > 0 ? (
                                    users.data.map((user) => (
                                        <tr key={user.id} className="group hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-[#2c4055]/10 text-[#2c4055] flex items-center justify-center font-bold">
                                                        {user.name?.charAt(0) || '?'}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900 text-sm">{user.name}</p>
                                                        <div className="flex items-center gap-1 mt-0.5 text-xs text-gray-500">
                                                            <Calendar className="w-3.5 h-3.5" />
                                                            {new Date(user.created_at).toLocaleDateString('id-ID')}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                                    <Mail className="w-4 h-4 text-gray-400" />
                                                    {user.email}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium uppercase tracking-wider border
                                                    ${user.role === 'admin' ? 'bg-red-50 text-red-700 border-red-200' :
                                                        user.role === 'seller' ? 'bg-[#2c4055]/10 text-[#2c4055] border-[#2c4055]/20' :
                                                            'bg-blue-50 text-blue-700 border-blue-200'}`}
                                                >
                                                    {user.role === 'admin' ? <Shield className="w-3.5 h-3.5" /> : <UserIcon className="w-3.5 h-3.5" />}
                                                    {user.role}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {user.is_active ? (
                                                    <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-semibold bg-emerald-50 px-2 py-1 rounded w-fit border border-emerald-100">
                                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                                        AKTIF
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1.5 text-red-600 text-xs font-semibold bg-red-50 px-2 py-1 rounded w-fit border border-red-100">
                                                        <XCircle className="w-3.5 h-3.5" />
                                                        DIBLOKIR
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleToggleStatus(user.id)}
                                                        className={`p-2 rounded-lg transition-colors border shadow-sm
                                                            ${user.is_active ? 'text-amber-600 bg-white border-gray-200 hover:bg-amber-50 hover:border-amber-200' : 'text-emerald-600 bg-white border-gray-200 hover:bg-emerald-50 hover:border-emerald-200'}`}
                                                        title={user.is_active ? 'Blokir Pengguna' : 'Aktifkan Pengguna'}
                                                    >
                                                        <Power className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => openEditModal(user)}
                                                        className="p-2 rounded-lg text-blue-600 bg-white border border-gray-200 shadow-sm hover:bg-blue-50 hover:border-blue-200 transition-colors"
                                                        title="Edit Pengguna"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(user.id)}
                                                        className="p-2 rounded-lg text-red-600 bg-white border border-gray-200 shadow-sm hover:bg-red-50 hover:border-red-200 transition-colors"
                                                        title="Hapus Pengguna"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-gray-500 text-sm">
                                            Tidak ada data pengguna ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {!isLoading && users?.total > 0 && (
                        <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-200 flex items-center justify-between">
                            <p className="text-sm text-gray-500 font-medium">
                                Menampilkan <span className="text-gray-900 font-semibold">{((users.current_page - 1) * 15) + 1}</span> - <span className="text-gray-900 font-semibold">{Math.min(users.current_page * 15, users.total)}</span> dari <span className="text-gray-900 font-semibold">{users.total}</span> pengguna
                            </p>
                            {renderPagination()}
                        </div>
                    )}
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 tracking-tight">
                                    {editingUser ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}
                                </h3>
                                <p className="text-gray-500 text-sm mt-0.5">Lengkapi informasi pengguna di bawah ini.</p>
                            </div>
                            <button onClick={closeModal} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={e => handleFormChange('name', e.target.value)}
                                        className={`w-full px-3 py-2 bg-white border ${errors.name ? 'border-red-300' : 'border-gray-200'} rounded-lg text-sm focus:ring-2 focus:ring-[#2c4055]/20 focus:border-[#2c4055] outline-none transition-colors`}
                                        placeholder="Masukkan nama lengkap..."
                                    />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name[0]}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Email</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={e => handleFormChange('email', e.target.value)}
                                        className={`w-full px-3 py-2 bg-white border ${errors.email ? 'border-red-300' : 'border-gray-200'} rounded-lg text-sm focus:ring-2 focus:ring-[#2c4055]/20 focus:border-[#2c4055] outline-none transition-colors`}
                                        placeholder="nama@email.com"
                                    />
                                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email[0]}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Peran (Role)</label>
                                    <select
                                        value={formData.role}
                                        onChange={e => handleFormChange('role', e.target.value)}
                                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2c4055]/20 focus:border-[#2c4055] outline-none transition-colors appearance-none"
                                    >
                                        <option value="user">User</option>
                                        <option value="seller">Seller</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Password {editingUser && <span className="text-gray-400 font-normal">(kosongkan jika tidak diubah)</span>}
                                    </label>
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={e => handleFormChange('password', e.target.value)}
                                        className={`w-full px-3 py-2 bg-white border ${errors.password ? 'border-red-300' : 'border-gray-200'} rounded-lg text-sm focus:ring-2 focus:ring-[#2c4055]/20 focus:border-[#2c4055] outline-none transition-colors`}
                                        placeholder="Min. 8 karakter..."
                                    />
                                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password[0]}</p>}
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-gray-100 mt-6">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 bg-white hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isProcessing}
                                    className="flex-1 px-4 py-2 bg-[#2c4055] text-white hover:bg-[#1f2d3d] rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isProcessing && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {isProcessing ? 'Menyimpan...' : (editingUser ? 'Simpan Perubahan' : 'Tambah Pengguna')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}


