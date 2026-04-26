import Header from "./components/shared/Header";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Chat from "./pages/Chat";
import { useAuth } from "./context/context";

import styles from "./App.module.css";

function App() {
	const auth = useAuth();
	const location = useLocation();
	const isChatPage = location.pathname === "/chat";
	
	return (
		<div>
			{!isChatPage && <Header />}
			<main className={!isChatPage ? styles.routes : ""}>
				<Routes>
					<Route path='/' element={<Home />} />
					<Route path='/login' element={<Login />} />
					<Route path='/signup' element={<Signup />} />
					{auth?.isLoggedIn && auth.user && (
						<Route path='/chat' element={<Chat />} />
					)}
					{/* Protected route redirect placeholder */}
					{!auth?.isLoggedIn && (
						<Route path='/chat' element={<Login />} />
					)}
				</Routes>
			</main>
		</div>
	);
}

export default App;
