import React, { useState, useEffect, useRef } from "react";
import { Head, usePage, Link } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import { Send, Search, CheckCircle2, ChevronLeft, Tag } from "lucide-react";
import axios from "axios";

export default function ChatIndex({
    contacts: initialContacts,
    initial_selected_user_id,
    initial_product,
}) {
    const { auth } = usePage().props;
    const currentUser = auth.user;

    const [contacts, setContacts] = useState(initialContacts || []);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [activeProduct, setActiveProduct] = useState(initial_product || null);
    const [isSending, setIsSending] = useState(false);

    const messagesEndRef = useRef(null);

    // Initial load selected user
    useEffect(() => {
        if (initial_selected_user_id) {
            const user = contacts.find(
                (c) => c.id === initial_selected_user_id,
            );
            if (user) {
                openChat(user);
            } else {
                // If not in contacts yet, we might want to fetch their details or just set a basic outline
                // This is a simplified fallback
                openChat({ id: initial_selected_user_id, name: "Pengguna" });
            }
        }
    }, []);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Setup Laravel Echo listener
    useEffect(() => {
        if (!currentUser) return;

        // Listen to my own private channel for incoming messages
        const channel = window.Echo.private(
            `chat.${currentUser.id}`,
        );

        channel.listen("MessageSent", (e) => {
            const incomingMsg = e;

            // Update messages if we have the chat open with this sender
            setSelectedUser((currentSelected) => {
                if (
                    currentSelected &&
                    currentSelected.id === incomingMsg.sender_id
                ) {
                    setMessages((prev) => [...prev, incomingMsg]);

                    // Mark as read immediately
                    axios.get(`/chat/${incomingMsg.sender_id}`);
                }
                return currentSelected;
            });

            // Update contacts list (bring to top, update last message, inc unread if closed)
            setContacts((prevContacts) => {
                let updatedContacts = [...prevContacts];
                const existingIndex = updatedContacts.findIndex(
                    (c) => c.id === incomingMsg.sender_id,
                );

                if (existingIndex > -1) {
                    const contact = updatedContacts[existingIndex];
                    contact.last_message = incomingMsg.message;
                    contact.created_at = incomingMsg.time || "Baru saja";

                    // Only increment unread if chat is NOT currently open
                    // We must access selectedUser from the state via a ref or careful dependency check
                    // For simplicity, we just check if it's not the currently actively viewed sender

                    updatedContacts.splice(existingIndex, 1);
                    updatedContacts.unshift(contact);
                } else {
                    // New contact
                    updatedContacts.unshift({
                        id: incomingMsg.sender_id,
                        name: incomingMsg.sender?.name || "Pengguna",
                        avatar: `https://ui-avatars.com/api/?name=${incomingMsg.sender?.name || "U"}&background=f3f4f6&color=43552c`,
                        last_message: incomingMsg.message,
                        created_at: "Baru saja",
                        is_read: false,
                        unread_count: 1,
                    });
                }
                return updatedContacts;
            });
        });

        return () => {
            channel.stopListening("MessageSent");
        };
    }, [currentUser]);

    const openChat = async (user) => {
        setSelectedUser(user);

        // Zero out unread count in UI
        setContacts((prev) =>
            prev.map((c) => (c.id === user.id ? { ...c, unread_count: 0 } : c)),
        );

        try {
            const response = await axios.get(`/chat/${user.id}`);
            setMessages(response.data.messages);

            // Set active product based on the last message if exists, or keep initial
            const msgs = response.data.messages;
            if (msgs.length > 0 && msgs[msgs.length - 1].product) {
                setActiveProduct(msgs[msgs.length - 1].product);
            }
        } catch (error) {
            console.error("Failed to load messages", error);
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedUser) return;

        const tempMessage = {
            id: Date.now(),
            sender_id: currentUser.id,
            receiver_id: selectedUser.id,
            message: newMessage,
            product_id: activeProduct?.id,
            is_read: false,
            time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }),
        };

        setMessages((prev) => [...prev, tempMessage]);
        setNewMessage("");
        setIsSending(true);

        try {
            const response = await axios.post("/chat", {
                receiver_id: selectedUser.id,
                message: tempMessage.message,
                product_id: activeProduct?.id,
            });

            // Replace temp with real
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === tempMessage.id ? response.data.message : msg,
                ),
            );

            // Update contact list
            setContacts((prev) => {
                let updated = [...prev];
                const index = updated.findIndex(
                    (c) => c.id === selectedUser.id,
                );
                if (index > -1) {
                    const c = updated[index];
                    c.last_message = response.data.message.message;
                    c.created_at = "Baru saja";
                    updated.splice(index, 1);
                    updated.unshift(c);
                } else {
                    updated.unshift({
                        id: selectedUser.id,
                        name: selectedUser.name,
                        avatar:
                            selectedUser.avatar ||
                            `https://ui-avatars.com/api/?name=${selectedUser.name}&background=f3f4f6&color=43552c`,
                        last_message: response.data.message.message,
                        created_at: "Baru saja",
                        unread_count: 0,
                    });
                }
                return updated;
            });
        } catch (error) {
            console.error("Failed to send message", error);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <MainLayout>
            <Head title="Pesan" />
            <div className="bg-[#f7f9f7] min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto h-[80vh] flex bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden border border-gray-100">
                    {/* Contacts Sidebar */}
                    <div
                        className={`w-full md:w-1/3 flex-shrink-0 border-r border-gray-100 flex flex-col ${selectedUser ? "hidden md:flex" : "flex"}`}
                    >
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-2xl font-black text-gray-900 mb-4">
                                Pesan
                            </h2>
                            <div className="relative">
                                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Cari chat..."
                                    className="w-full bg-[#f7f9f7] border-none rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-[#43552c]/20"
                                />
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {contacts.length === 0 ? (
                                <div className="p-8 text-center text-gray-400 text-sm">
                                    Belum ada percakapan.
                                </div>
                            ) : (
                                contacts.map((contact) => (
                                    <button
                                        key={contact.id}
                                        onClick={() => openChat(contact)}
                                        className={`w-full text-left p-4 flex items-start gap-4 hover:bg-gray-50 transition-colors border-b border-gray-50 ${selectedUser?.id === contact.id ? "bg-[#43552c]/5" : ""}`}
                                    >
                                        <div className="relative">
                                            <img
                                                src={contact.avatar}
                                                alt=""
                                                className="w-12 h-12 rounded-full object-cover"
                                            />
                                            {contact.unread_count > 0 && (
                                                <span className="absolute -top-1 -right-1 bg-[#d4a373] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                                                    {contact.unread_count}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-baseline mb-1">
                                                <h4 className="font-bold text-gray-900 text-sm truncate">
                                                    {contact.name}
                                                </h4>
                                                <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap ml-2">
                                                    {contact.created_at}
                                                </span>
                                            </div>
                                            <p
                                                className={`text-sm truncate ${contact.unread_count > 0 ? "text-gray-900 font-bold" : "text-gray-500"}`}
                                            >
                                                {contact.last_message}
                                            </p>
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div
                        className={`flex-1 flex flex-col bg-[#f7f9f7]/50 ${!selectedUser ? "hidden md:flex" : "flex"}`}
                    >
                        {selectedUser ? (
                            <>
                                {/* Chat Header */}
                                <div className="h-20 px-6 border-b border-gray-100 bg-white flex items-center justify-between shadow-sm z-10">
                                    <div className="flex items-center gap-4">
                                        <button
                                            className="md:hidden text-gray-400 hover:text-gray-900"
                                            onClick={() =>
                                                setSelectedUser(null)
                                            }
                                        >
                                            <ChevronLeft className="w-6 h-6" />
                                        </button>
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={
                                                    selectedUser.avatar ||
                                                    `https://ui-avatars.com/api/?name=${selectedUser.name}&background=f3f4f6&color=43552c`
                                                }
                                                alt=""
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                            <div>
                                                <h3 className="font-bold text-gray-900">
                                                    {selectedUser.name}
                                                </h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Active Product Context Widget */}
                                {activeProduct && (
                                    <div className="bg-white mx-6 mt-6 p-3 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.03)] flex items-center gap-4 border border-gray-100">
                                        <img
                                            src={activeProduct.img}
                                            alt=""
                                            className="w-12 h-12 rounded-xl object-cover"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5">
                                                Berdiskusi Tentang
                                            </p>
                                            <h4 className="text-sm font-bold text-gray-900 truncate">
                                                {activeProduct.name}
                                            </h4>
                                            <p className="text-xs font-bold text-[#43552c]">
                                                Rp{" "}
                                                {parseInt(
                                                    activeProduct.price,
                                                ).toLocaleString("id-ID")}
                                            </p>
                                        </div>
                                        {/* Dynamic link to the product */}
                                        <Link
                                            href={`/product/${activeProduct.id}`}
                                            className="px-4 py-2 bg-[#f7f9f7] text-[#43552c] rounded-xl text-xs font-bold hover:bg-[#43552c]/10 transition-colors whitespace-nowrap border border-gray-100"
                                        >
                                            Lihat
                                        </Link>
                                    </div>
                                )}

                                {/* Messages History */}
                                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                    {messages.map((msg, idx) => {
                                        const isMine =
                                            msg.sender_id === currentUser.id;
                                        return (
                                            <div
                                                key={idx}
                                                className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}
                                            >
                                                <div
                                                    className={`px-5 py-3 max-w-[75%] rounded-2xl ${
                                                        isMine
                                                            ? "bg-[#43552c] text-white rounded-br-sm shadow-md shadow-[#43552c]/20"
                                                            : "bg-white border border-gray-100 text-gray-800 rounded-bl-sm shadow-sm"
                                                    }`}
                                                >
                                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                                        {msg.message}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-1 mt-1.5 px-1 text-[10px] font-bold text-gray-400">
                                                    <span>{msg.time}</span>
                                                    {isMine && (
                                                        <CheckCircle2
                                                            className={`w-3 h-3 ${msg.is_read ? "text-[#43552c]" : "text-gray-300"}`}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Chat Input Box */}
                                <div className="p-6 bg-white border-t border-gray-100">
                                    <form
                                        onSubmit={sendMessage}
                                        className="flex items-end gap-3"
                                    >
                                        <div className="flex-1 bg-[#f7f9f7] rounded-3xl border border-gray-200 focus-within:border-[#43552c] focus-within:ring-2 focus-within:ring-[#43552c]/20 transition-all p-1 flex items-center">
                                            <textarea
                                                rows="1"
                                                value={newMessage}
                                                onChange={(e) =>
                                                    setNewMessage(
                                                        e.target.value,
                                                    )
                                                }
                                                onKeyDown={(e) => {
                                                    if (
                                                        e.key === "Enter" &&
                                                        !e.shiftKey
                                                    ) {
                                                        e.preventDefault();
                                                        sendMessage(e);
                                                    }
                                                }}
                                                placeholder="Ketik pesan disini..."
                                                className="w-full bg-transparent border-none rounded-3xl px-4 py-2.5 text-sm focus:ring-0 resize-none max-h-32"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={
                                                !newMessage.trim() || isSending
                                            }
                                            className="w-12 h-12 flex-shrink-0 bg-[#43552c] text-white rounded-full flex items-center justify-center hover:bg-[#364423] shadow-md shadow-[#43552c]/20 transition-all disabled:opacity-50"
                                        >
                                            <Send className="w-5 h-5 ml-1" />
                                        </button>
                                    </form>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                                <div className="w-20 h-20 bg-[#43552c]/5 rounded-full flex items-center justify-center mb-6">
                                    <Send className="w-8 h-8 text-[#43552c] opacity-50" />
                                </div>
                                <h3 className="text-xl font-black text-gray-900 mb-2">
                                    Pilih Percakapan
                                </h3>
                                <p className="text-gray-500 max-w-sm">
                                    Diskusi soal produk lebih mudah melalui
                                    fitur obrolan WhatsApp-style ini.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
