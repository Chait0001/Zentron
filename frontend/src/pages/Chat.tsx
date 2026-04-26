import { useRef, useState, useEffect, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import {
	deleteAllChats,
	getAllChats,
	postChatRequest,
} from "../../helpers/api-functions";

import ChatLoading from "../components/chat/ChatLoading";
import { useAuth } from "../context/context";
import SpinnerOverlay from "../components/shared/SpinnerOverlay";
import toast from "react-hot-toast";

type Message = {
	role: "user" | "assistant";
	content: string;
};

const Chat = () => {
	const auth = useAuth();
	const navigate = useNavigate();

	const [chatMessages, setChatMessages] = useState<Message[]>([]);
	const [input, setInput] = useState("");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isLoadingChats, setIsLoadingChats] = useState<boolean>(true);

	const messageContainerRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (messageContainerRef.current) {
			messageContainerRef.current.scrollTop =
				messageContainerRef.current.scrollHeight;
		}
	}, [chatMessages, isLoading]);

	useLayoutEffect(() => {
		const getChats = async () => {
			try {
				if (auth?.isLoggedIn && auth.user) {
					const data = await getAllChats();
					setChatMessages([...data.chats]);
				}
				setIsLoadingChats(false);
			} catch (err) {
				console.log(err);
				setIsLoadingChats(false);
			}
		};
		getChats();
	}, [auth]);

	useEffect(() => {
		if (!auth?.user) {
			return navigate("/login");
		}
	}, [auth]);

	const handleSend = async () => {
		if (!input.trim()) return;

		const content = input;
		setInput("");

		const newMessage: Message = { role: "user", content };
		setChatMessages((prev) => [...prev, newMessage]);

		setIsLoading(true);
		try {
			const chatData = await postChatRequest(content);
			if (chatData && chatData.chats) {
				setChatMessages([...chatData.chats]);
			} else {
				throw new Error("Invalid response from server");
			}
		} catch (error: any) {
			console.log(error);
			toast.error("Failed to send message: " + (error.message || "Unknown error"));
		} finally {
			setIsLoading(false);
		}
	};

	const clearChatsHandler = async () => {
		try {
			toast.loading("Deleting Messages ...", { id: "delete-msgs" });
			const data = await deleteAllChats();
			setChatMessages(data.chats || []);
			toast.success("Deleted Messages Successfully", { id: "delete-msgs" });
		} catch (error: any) {
			toast.error(error.message, { id: "delete-msgs" });
		}
	};

	const handleLogout = async () => {
		try {
			await auth?.logout();
			navigate("/");
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="flex h-screen w-full bg-[#0a0a0f] text-[#e0e0ff] font-['Space_Grotesk'] overflow-hidden">
			
			{/* Left Sidebar */}
			<aside className="w-[260px] flex-shrink-0 bg-[#0e0e1c] border-r border-white/[0.05] flex flex-col z-40">
				<div className="p-6 pb-8">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#38bdf8] flex items-center justify-center shadow-lg shadow-indigo-500/20 relative group">
                            <div className="w-5 h-5 bg-white/90 transform rotate-45 shadow-[0_0_15px_rgba(255,255,255,0.8)]"></div>
                        </div>
						<div>
							<h1 className="text-white font-bold text-lg tracking-tight leading-none">ZENTRON</h1>
						</div>
					</div>
				</div>

				<div className="px-4 mb-6">
					<button 
						onClick={clearChatsHandler}
						className="w-full py-3 rounded-xl border border-white/[0.1] text-sm font-medium text-[#e0e0ff]/70 hover:bg-white/[0.03] transition-all flex items-center justify-start px-4 gap-3"
					>
						<span className="text-xl leading-none">+</span> New Conversation
					</button>
				</div>

				<div className="flex-1 overflow-y-auto px-4">
					<p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-2">Recent</p>
					<div className="space-y-1">
						{[
							'Python script help',
							'Essay feedback',
							'Startup ideas'
						].map((item, i) => (
							<div key={i} className="p-3 rounded-xl hover:bg-white/[0.03] text-sm text-[#e0e0ff]/60 flex items-center gap-3 cursor-pointer transition-colors truncate">
								<span className="opacity-30">💬</span> {item}
							</div>
						))}
					</div>
				</div>

				{/* Bottom User Profile */}
				<div className="p-5 border-t border-white/[0.05]">
					<div className="flex items-center gap-3.5 px-1">
						<div className="w-9 h-9 rounded-full bg-[#6366f1] flex items-center justify-center text-white text-sm font-bold shadow-lg">
							{auth?.user?.name?.charAt(0).toUpperCase() || 'Z'}
						</div>
						<div className="flex-1 truncate">
							<p className="text-sm font-bold text-white truncate">{auth?.user?.name || 'Your Account'}</p>
						</div>
					</div>
				</div>
			</aside>

			{/* Main Content Area */}
			<main className="flex-1 flex flex-col relative bg-[#0a0a0f]">
				
				{/* Top Header */}
				<header className="h-16 flex items-center justify-between px-8 border-b border-white/[0.05]">
					<h2 className="text-sm font-bold text-white tracking-tight">Zentron</h2>
					<button 
						onClick={handleLogout}
						className="px-5 py-2 rounded-xl border border-white/[0.1] text-xs font-bold text-[#e0e0ff]/80 hover:bg-white/[0.05] transition-all"
					>
						Log out
					</button>
				</header>

				{/* Chat Area */}
				<div 
					ref={messageContainerRef}
					className="flex-1 overflow-y-auto px-8 py-10"
				>
					<div className="max-w-3xl mx-auto w-full">
						{isLoadingChats ? (
							<div className="flex justify-center items-center h-[60vh]">
								<SpinnerOverlay />
							</div>
						) : (
							<>
								{chatMessages.length === 0 ? (
									<div className="flex flex-col items-center justify-center min-h-[70vh]">
										<div className="w-20 h-20 rounded-[28px] bg-gradient-to-br from-[#6366f1] to-[#38bdf8] flex items-center justify-center mb-8 shadow-2xl shadow-indigo-500/20 relative">
                                            <div className="w-10 h-10 bg-white shadow-[0_0_25px_rgba(255,255,255,0.9)] transform rotate-45"></div>
                                        </div>
										<h2 className="text-4xl font-bold text-white tracking-tight mb-3">Welcome to Zentron</h2>
										<p className="text-[#e0e0ff]/50 text-sm font-medium text-center max-w-sm mb-12 leading-relaxed">
											A high-performance AI experience. Start a weightless conversation today.
										</p>

										<div className="grid grid-cols-2 gap-4 w-full max-w-2xl">
											{[
												{ title: 'Write code', desc: 'Python, JS, and more' },
												{ title: 'Brainstorm ideas', desc: 'Creative thinking' },
												{ title: 'Explain concepts', desc: 'Clear and simple' },
												{ title: 'Improve writing', desc: 'Essays, emails, docs' }
											].map((card, i) => (
												<div 
													key={i}
													onClick={() => setInput(card.title)}
													className="p-6 rounded-2xl border border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.04] hover:border-[#6366f1]/30 transition-all cursor-pointer group"
												>
													<h4 className="text-[14px] font-bold text-white mb-1">{card.title}</h4>
													<p className="text-[12px] font-medium text-[#e0e0ff]/40">{card.desc}</p>
												</div>
											))}
										</div>
									</div>
								) : (
									<div className="space-y-10">
										{chatMessages.map((message, index) => (
											<div key={index} className="flex gap-5 group">
												<div className={`w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center text-sm font-bold shadow-lg ${message.role === 'user' ? 'bg-[#6366f1]' : 'bg-white/[0.05] border border-white/[0.05]'}`}>
													{message.role === 'user' ? (auth?.user?.name?.charAt(0).toUpperCase() || 'U') : 'Z'}
												</div>
												<div className="flex-1 space-y-2.5">
                                                    <p className="text-[15px] leading-relaxed text-[#e0e0ff] whitespace-pre-wrap">
														{message.content}
													</p>
												</div>
											</div>
										))}
										{isLoading && <ChatLoading />}
									</div>
								)}
							</>
						)}
					</div>
				</div>

				{/* Input Area */}
				<div className="p-8 pt-0">
					<div className="max-w-3xl mx-auto">
						<div className="bg-[#14141f] rounded-[26px] border border-white/[0.08] p-2 flex items-center gap-3 focus-within:border-[#6366f1]/50 focus-within:shadow-[0_0_30px_rgba(99,102,241,0.1)] transition-all">
							<textarea
								value={input}
								onChange={(e) => setInput(e.target.value)}
								placeholder="Message Zentron..."
								rows={1}
								className="flex-1 bg-transparent text-[15px] text-white placeholder:text-[#e0e0ff]/20 resize-none outline-none py-3 px-5"
								onKeyDown={(e) => {
									if (e.key === 'Enter' && !e.shiftKey) {
										e.preventDefault();
										handleSend();
									}
								}}
							/>
							<button 
								onClick={handleSend}
								disabled={!input.trim() || isLoading}
								className="w-12 h-12 rounded-[20px] bg-gradient-to-br from-[#6366f1] to-[#38bdf8] flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-20"
							>
								<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
									<line x1="22" y1="2" x2="11" y2="13"></line>
									<polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
								</svg>
							</button>
						</div>
						<p className="text-center text-[10px] font-bold text-[#e0e0ff]/30 mt-5 tracking-widest uppercase">
							Enter to send · Shift+Enter for new line
						</p>
					</div>
				</div>
			</main>
		</div>
	);
};

export default Chat;


