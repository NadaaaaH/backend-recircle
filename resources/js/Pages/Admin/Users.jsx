import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import {
    Users as UsersIcon,
    Search,
    MoreVertical,
    Shield,
    User as UserIcon,
    Mail,
    Calendar,
    CheckCircle2,
    XCircle,
    Power
} from 'lucide-react';

export default function Users({ users, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    const breadcrumbs = [
        { label: 'Admin', href: '#' },
        { label: 'Pengguna', href: '/admin/users' },
    ];

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/users', { search }, { preserveState: true });
    };

    const handleToggleStatus = (id) => {
        if (confirm('Ubah status aktif user ini?')) {
            router.post(`/admin/users/${id}/toggle-status`);
        }
    };

    return (
        <DashboardLayout title="Manajemen Pengguna" breadcrumbs={breadcrumbs}>
            <Head title="Admin — Kelola Pengguna" />

            <div className="space-y-6">
                {/* Header & Search */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Manajemen Pengguna</h2>
                        <p className="text-gray-500 mt-1">Total {users.total} pengguna terdaftar di sistem.</p>
                    </div>

                    <form onSubmit={handleSearch} className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari nama atau email..."
                            className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-[#43552c]/20 focus:border-[#43552c] transition-all"
                        />
                    </form>
                </div>

                {/* Users Table Card */}
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
                                {users.data.map((user) => (
                                    <tr key={user.id} className="group hover:bg-gray-50/50 transition-colors">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-[#43552c]/10 text-[#43552c] flex items-center justify-center font-bold">
                                                    {user.name.charAt(0)}
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
                                                <button className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-8 py-5 bg-[#f7f9f7]/30 border-t border-gray-50 flex items-center justify-between">
                        <p className="text-xs text-gray-500 font-medium">
                            Menampilkan <span className="text-gray-900 font-bold">{users.from}</span> sampai <span className="text-gray-900 font-bold">{users.to}</span> dari <span className="text-gray-900 font-bold">{users.total}</span> pengguna
                        </p>
                        <div className="flex gap-2">
                            {users.links.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.url}
                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all
                                        ${link.active ? 'bg-[#43552c] text-white shadow-sm' :
                                            link.url ? 'bg-white border border-gray-100 text-gray-500 hover:border-[#43552c] hover:text-[#43552c]' :
                                                'text-gray-300 pointer-events-none'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
