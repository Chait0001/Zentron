import { useRef, useState, useEffect, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
	deleteAllChats,
	getAllChats,
	postChatRequest,
} from "../../helpers/api-functions";

import { useAuth } from "../context/context";
import SpinnerOverlay from "../components/shared/SpinnerOverlay";
import toast from "react-hot-toast";

import WelcomeScreen from "../components/home/WelcomeScreen";
import ChatMessage from "../components/chat/ChatMessage";

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
	}, [auth, navigate]);

	const handleSend = async (overrideText?: string) => {
		const content = overrideText || input;
		if (!content.trim()) return;

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
		<div style={{ display: 'flex', height: '100vh', width: '100%', backgroundColor: '#07101f', color: '#e8f4ff', fontFamily: "'Nunito', sans-serif", overflow: 'hidden' }}>
			
			{/* Left Sidebar */}
			<aside style={{ width: '200px', flexShrink: 0, backgroundColor: '#0d1a2e', borderRight: '1px solid rgba(74,240,255,0.12)', display: 'flex', flexDirection: 'column', zIndex: 40 }}>
				<div style={{ padding: '24px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
					<div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #0088cc, #4af0ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px rgba(74,240,255,0.4)' }}>
                        <span style={{ fontFamily: "'Exo 2', sans-serif", fontWeight: 800, fontSize: '20px', color: '#fff' }}>Z</span>
                    </div>
					<div>
						<h1 style={{ color: '#fff', fontFamily: "'Exo 2', sans-serif", fontWeight: 800, fontSize: '18px', letterSpacing: '1px', margin: 0, background: 'linear-gradient(90deg, #fff, #4af0ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ZENTRON</h1>
					</div>
				</div>

				<div style={{ padding: '0 16px', marginBottom: '24px' }}>
					<button 
						onClick={clearChatsHandler}
						style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(74,240,255,0.25)', color: '#4af0ff', backgroundColor: 'rgba(74,240,255,0.05)', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s ease', cursor: 'pointer' }}
						onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(74,240,255,0.1)'}
						onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(74,240,255,0.05)'}
					>
						<span style={{ fontSize: '18px', lineHeight: 1 }}>+</span> New Conversation
					</button>
				</div>

				<div style={{ flex: 1, overflowY: 'auto', padding: '0 16px' }}>
					<p style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(232,244,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px', paddingLeft: '8px', margin: 0 }}>Recent</p>
					<div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '12px' }}>
						{[
							'Python script help',
							'Essay feedback',
							'Startup ideas'
						].map((item, i) => (
							<div key={i} style={{ padding: '10px', borderRadius: '8px', color: 'rgba(232,244,255,0.7)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', transition: 'background 0.2s', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
								<span style={{ opacity: 0.5 }}>💬</span> {item}
							</div>
						))}
					</div>
				</div>

				{/* Bottom User Profile */}
				<div style={{ padding: '16px', borderTop: '1px solid rgba(74,240,255,0.12)' }}>
					<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
						<div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#1e3a5f', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>
							{auth?.user?.name?.charAt(0).toUpperCase() || 'U'}
						</div>
						<div style={{ flex: 1, overflow: 'hidden' }}>
							<p style={{ fontSize: '14px', fontWeight: 700, color: '#fff', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{auth?.user?.name || 'Your Account'}</p>
                            <p style={{ fontSize: '11px', color: '#4af0ff', margin: 0 }}>Pro Plan</p>
						</div>
					</div>
				</div>
			</aside>

			{/* Main Content Area */}
			<main style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', backgroundColor: '#07101f' }}>
				
				{/* Top Header */}
				<header style={{ height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', borderBottom: '1px solid rgba(74,240,255,0.12)' }}>
					<h2 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', margin: 0, fontFamily: "'Exo 2', sans-serif" }}>Zentron Chat</h2>
					<div style={{ display: 'flex', gap: '12px' }}>
                        <button style={{ padding: '6px', color: 'rgba(232,244,255,0.6)', cursor: 'pointer', background: 'none', border: 'none' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        </button>
                        <button style={{ padding: '6px', color: 'rgba(232,244,255,0.6)', cursor: 'pointer', background: 'none', border: 'none' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                        </button>
                        <button 
                            onClick={handleLogout}
                            style={{ padding: '6px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', fontSize: '12px', fontWeight: 700, color: 'rgba(232,244,255,0.8)', cursor: 'pointer', background: 'transparent' }}
                        >
                            Log out
                        </button>
					</div>
				</header>

				{/* Chat Area */}
				<div 
					ref={messageContainerRef}
					style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}
				>
					<div style={{ maxWidth: '800px', margin: '0 auto', width: '100%', height: '100%' }}>
						{isLoadingChats ? (
							<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
								<SpinnerOverlay />
							</div>
						) : (
							<>
								{chatMessages.length === 0 ? (
                                    <WelcomeScreen 
                                        username={auth?.user?.name || 'User'} 
                                        onChipClick={(text) => handleSend(text)} 
                                    />
								) : (
									<div style={{ display: 'flex', flexDirection: 'column', paddingBottom: '20px' }}>
										{chatMessages.map((message, index) => (
                                            <ChatMessage 
                                                key={index} 
                                                role={message.role} 
                                                content={message.content} 
                                                userName={auth?.user?.name} 
                                            />
										))}
										{isLoading && <ChatMessage role="assistant" content="" isTyping={true} />}
									</div>
								)}
							</>
						)}
					</div>
				</div>

				{/* Input Area */}
				<div style={{ padding: '0 32px 24px 32px' }}>
					<div style={{ maxWidth: '800px', margin: '0 auto' }}>
						<div style={{ 
                            backgroundColor: '#0d1a2e', 
                            borderRadius: '14px', 
                            border: '1px solid rgba(74,240,255,0.25)', 
                            padding: '8px 12px', 
                            display: 'flex', 
                            alignItems: 'flex-end', 
                            gap: '12px', 
                            transition: 'all 0.2s',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                        }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(74,240,255,0.5)'; e.currentTarget.style.boxShadow = '0 0 15px rgba(74,240,255,0.15), 0 4px 20px rgba(0,0,0,0.2)'; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(74,240,255,0.25)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)'; }}>
							<textarea
								value={input}
								onChange={(e) => setInput(e.target.value)}
								placeholder="Message Zentron..."
								rows={1}
								style={{ 
                                    flex: 1, 
                                    backgroundColor: 'transparent', 
                                    color: '#fff', 
                                    fontSize: '15px', 
                                    resize: 'none', 
                                    outline: 'none', 
                                    border: 'none', 
                                    padding: '10px 8px',
                                    fontFamily: "'Nunito', sans-serif"
                                }}
								onKeyDown={(e) => {
									if (e.key === 'Enter' && !e.shiftKey) {
										e.preventDefault();
										handleSend();
									}
								}}
							/>
							<button 
								onClick={() => handleSend()}
								disabled={!input.trim() || isLoading}
								style={{ 
                                    width: '40px', 
                                    height: '40px', 
                                    borderRadius: '10px', 
                                    backgroundColor: (!input.trim() || isLoading) ? 'transparent' : 'rgba(74,240,255,0.1)', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center', 
                                    cursor: (!input.trim() || isLoading) ? 'not-allowed' : 'pointer', 
                                    border: 'none',
                                    transition: 'all 0.2s',
                                    opacity: (!input.trim() || isLoading) ? 0.3 : 1
                                }}
                                onMouseEnter={(e) => { if (input.trim() && !isLoading) e.currentTarget.style.backgroundColor = 'rgba(74,240,255,0.2)'; }}
                                onMouseLeave={(e) => { if (input.trim() && !isLoading) e.currentTarget.style.backgroundColor = 'rgba(74,240,255,0.1)'; }}
							>
								<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4af0ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
									<line x1="22" y1="2" x2="11" y2="13"></line>
									<polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
								</svg>
							</button>
						</div>
						<p style={{ textAlign: 'center', fontSize: '11px', color: 'rgba(232,244,255,0.3)', marginTop: '8px', marginBottom: 0 }}>
							Enter to send · Shift+Enter for new line
						</p>
					</div>
				</div>
			</main>
		</div>
	);
};

export default Chat;
