import React, { useState, useEffect } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
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
    X
} from 'lucide-react';

export default function AdminUsersPage({ users = { data: [] }, filters = {} }) {
    useEffect(() => {
        console.log('AdminUsersPage mounted with props:', { users, filters });
    }, [users, filters]);

    const [search, setSearch] = useState(filters?.search || '');
    const [role, setRole] = useState(filters?.role || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    const { data, setData, post, patch, delete: destroyMethod, processing, errors, reset, clearErrors } = useForm({
        name: '',
        email: '',
        password: '',
        role: 'user',
    });

    const handleSearch = (e) => {
        if (e) e.preventDefault();
        router.get('/admin/users', { search, role }, { preserveState: true });
    };

    const handleRoleChange = (newRole) => {
        setRole(newRole);
        router.get('/admin/users', { search, role: newRole }, { preserveState: true });
    };

    const openCreateModal = () => {
        setEditingUser(null);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (user) => {
        setEditingUser(user);
        setData({
            name: user.name || '',
            email: user.email || '',
            password: '',
            role: user.role || 'user',
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
        clearErrors();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingUser) {
            patch(`/admin/users/${editingUser.id}`, {
                onSuccess: () => closeModal(),
            });
        } else {
            post('/admin/users', {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
            router.delete(`/admin/users/${id}`);
        }
    };

    const handleToggleStatus = (id) => {
        if (confirm('Ubah status aktif user ini?')) {
            router.post(`/admin/users/${id}/toggle-status`);
        }
    };

    const breadcrumbs = [
        { label: 'Admin', href: '#' },
        { label: 'Pengguna', href: '/admin/users' },
    ];

    return (
        <DashboardLayout title="Manajemen Pengguna" breadcrumbs={breadcrumbs}>
            <Head title="Admin — Kelola Pengguna" />

            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Manajemen Pengguna</h2>
                        <p className="text-gray-500 mt-1">Total {users?.total || 0} pengguna terdaftar.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3">
                        <div className="relative w-full sm:w-64">
                            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <select
                                value={role}
                                onChange={(e) => handleRoleChange(e.target.value)}
                                className="w-full pl-11 pr-4 py-2 bg-white border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-[#43552c]/20 focus:border-[#43552c] appearance-none"
                            >
                                <option value="">Semua Peran</option>
                                <option value="user">User</option>
                                <option value="seller">Seller</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        <form onSubmit={handleSearch} className="relative w-full sm:w-64">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari nama atau email..."
                                className="w-full pl-11 pr-4 py-2 bg-white border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-[#43552c]/20 focus:border-[#43552c] transition-all"
                            />
                        </form>

                        <button
                            onClick={openCreateModal}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2 bg-[#43552c] text-white rounded-xl text-sm font-bold hover:bg-[#324021] transition-all shadow-sm"
                        >
                            <Plus className="w-4 h-4" />
                            Tambah User
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#f7f9f7]/50 border-b border-gray-50">
                                    <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pengguna</th>
                                    <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Kontak</th>
                                    <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Peran</th>
                                    <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {users?.data?.length > 0 ? (
                                    users.data.map((user) => (
                                        <tr key={user.id} className="group hover:bg-gray-50/50 transition-colors">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-[#43552c]/10 text-[#43552c] flex items-center justify-center font-bold">
                                                        {user.name?.charAt(0) || '?'}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-800 text-sm">{user.name}</p>
                                                        <div className="flex items-center gap-1 mt-0.5 text-[10px] text-gray-400">
                                                            <Calendar className="w-3 h-3" />
                                                            Terdaftar {user.created_at}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                                                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                                                    {user.email}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                                                    ${user.role === 'admin' ? 'bg-red-50 text-red-600' :
                                                        user.role === 'seller' ? 'bg-[#43552c]/8 text-[#43552c]' :
                                                            'bg-blue-50 text-blue-600'}`}
                                                >
                                                    {user.role === 'admin' ? <Shield className="w-3 h-3" /> : <UserIcon className="w-3 h-3" />}
                                                    {user.role}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                {user.is_active ? (
                                                    <div className="flex items-center gap-1.5 text-green-600 text-[10px] font-bold">
                                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                                        AKTIF
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1.5 text-red-500 text-[10px] font-bold">
                                                        <XCircle className="w-3.5 h-3.5" />
                                                        DIBLOKIR
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleToggleStatus(user.id)}
                                                        className={`p-2 rounded-lg transition-colors 
                                                            ${user.is_active ? 'text-orange-400 hover:bg-orange-50' : 'text-green-500 hover:bg-green-50'}`}
                                                        title={user.is_active ? 'Blokir Pengguna' : 'Aktifkan Pengguna'}
                                                    >
                                                        <Power className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => openEditModal(user)}
                                                        className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 transition-colors"
                                                        title="Edit Pengguna"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(user.id)}
                                                        className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
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
                                        <td colSpan="5" className="px-8 py-10 text-center text-gray-500 italic text-sm">
                                            Tidak ada data pengguna ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {users?.links?.length > 0 && (
                        <div className="px-8 py-5 bg-[#f7f9f7]/30 border-t border-gray-50 flex items-center justify-between">
                            <p className="text-xs text-gray-500 font-medium">
                                Menampilkan <span className="text-gray-900 font-bold">{users.from || 0}</span> sampai <span className="text-gray-900 font-bold">{users.to || 0}</span> dari <span className="text-gray-900 font-bold">{users.total || 0}</span> pengguna
                            </p>
                            <div className="flex gap-2">
                                {users.links.map((link, idx) => (
                                    link.url ? (
                                        <Link
                                            key={idx}
                                            href={link.url}
                                            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all
                                            ${link.active ? 'bg-[#43552c] text-white shadow-sm' :
                                                    link.url ? 'bg-white border border-gray-100 text-gray-500 hover:border-[#43552c] hover:text-[#43552c]' :
                                                        'text-gray-300 pointer-events-none'}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ) : (
                                        <span
                                            key={idx}
                                            className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-gray-300"
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    )
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-xl overflow-hidden">
                        <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-[#f7f9f7]/50">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">
                                    {editingUser ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}
                                </h3>
                                <p className="text-gray-500 text-xs mt-1">Lengkapi informasi pengguna di bawah ini.</p>
                            </div>
                            <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-5">
                            <div className="grid grid-cols-1 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Nama Lengkap</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className={`w-full px-5 py-3 bg-gray-50 border ${errors.name ? 'border-red-300' : 'border-gray-100'} rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-[#43552c]/20 focus:border-[#43552c] transition-all`}
                                        placeholder="Masukkan nama lengkap..."
                                    />
                                    {errors.name && <p className="text-red-500 text-[10px] font-bold px-1">{errors.name}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Alamat Email</label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        className={`w-full px-5 py-3 bg-gray-50 border ${errors.email ? 'border-red-300' : 'border-gray-100'} rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-[#43552c]/20 focus:border-[#43552c] transition-all`}
                                        placeholder="nama@email.com"
                                    />
                                    {errors.email && <p className="text-red-500 text-[10px] font-bold px-1">{errors.email}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Peran (Role)</label>
                                    <select
                                        value={data.role}
                                        onChange={e => setData('role', e.target.value)}
                                        className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-[#43552c]/20 focus:border-[#43552c] transition-all appearance-none"
                                    >
                                        <option value="user">User</option>
                                        <option value="seller">Seller</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">
                                        Password {editingUser && <span className="text-gray-300 normal-case font-medium">(kosongkan jika tidak diubah)</span>}
                                    </label>
                                    <input
                                        type="password"
                                        value={data.password}
                                        onChange={e => setData('password', e.target.value)}
                                        className={`w-full px-5 py-3 bg-gray-50 border ${errors.password ? 'border-red-300' : 'border-gray-100'} rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-[#43552c]/20 focus:border-[#43552c] transition-all`}
                                        placeholder="Min. 8 karakter..."
                                    />
                                    {errors.password && <p className="text-red-500 text-[10px] font-bold px-1">{errors.password}</p>}
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 px-6 py-3 border border-gray-100 text-gray-500 rounded-2xl text-sm font-bold hover:bg-gray-50 transition-all"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-2 px-10 py-3 bg-[#43552c] text-white rounded-2xl text-sm font-bold hover:bg-[#324021] transition-all shadow-lg shadow-[#43552c]/20 disabled:opacity-50"
                                >
                                    {processing ? 'Menyimpan...' : (editingUser ? 'Simpan Perubahan' : 'Tambah Pengguna')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}


