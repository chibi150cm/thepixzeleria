// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Menu from "./pages/Menu";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Blogs from "./pages/Blogs";
import CartPage from "./pages/CartPage.jsx";
import AdminPanel from "./pages/AdminPanel";
import Juego from './pages/Juego.jsx';
import Window from "./components/Window";
import './App.css';

function ProtectedAdminRoute({ children }) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser || currentUser.role !== 'admin') {
        return <Navigate to="/" replace />;
    }
    
    return children;
}

function MainPage({ User, setUser, cart, setCart, handleLoginSuccess }) {
    const [openWindow, setOpenWindow] = useState(null);

    const pages = {
        home: <Home User={User} setUser={setUser} />,
        login: <Login 
            User={User} 
            setUser={setUser} 
            onLoginSuccess={handleLoginSuccess}
            onClose={() => setOpenWindow(null)}
        />,
        menu: <Menu cart={cart} setCart={setCart} />,
        about: <About />,
        contact: <Contact />,
        blogs: <Blogs />,
        cart: <CartPage cart={cart} setCart={setCart} />,
        juego: <Juego />   
    };

    return (
        <div className="page-wrapper">
            <header className="header">
                <h1>
                    <img src="pixzeleria-logo.svg" alt="Pixzelería" />
                </h1>
            </header>

            <p className="description">Pizzería en Pixeles</p>

            <nav className="window">
                <p className="window-title">Nav</p>
                <div className="container">
                    {Object.keys(pages).map((key) => (
                        <button
                            key={key}
                            className="button"
                            onClick={() => setOpenWindow(key)}
                        >
                            {key === 'game' ? 'JUEGO' : key.toUpperCase()}
                        </button>
                    ))}
                </div>
            </nav>

            <Window
                title={openWindow ? openWindow.toUpperCase() : ""}
                isOpen={!!openWindow}
                onClose={() => setOpenWindow(null)}
            >
                {openWindow && pages[openWindow]}
            </Window>
        </div>
    );
}

export default function App() {
    const [User, setUser] = useState(null);
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const users = JSON.parse(localStorage.getItem('pixeleriaUsers')) || [];
        const adminExists = users.some(user => user.email === 'admin@pixzeleria.com');
        
        if (!adminExists) {
            users.push({
                run: '12345678-9',
                name: 'Admin',
                lastname: 'Principal',
                email: 'admin@pixzeleria.com',
                password: 'admin123',
                role: 'admin',
                status: 'active'
            });
            localStorage.setItem('pixeleriaUsers', JSON.stringify(users));
        }

        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            setUser(currentUser);
        }
    }, []);

    // Función para manejar login exitoso
    const handleLoginSuccess = (user) => {
        setUser(user);
    };

    return (
        <BrowserRouter basename="/thepixzeleria">
            <Routes>
                <Route 
                    path="/" 
                    element={
                        <MainPage 
                            User={User} 
                            setUser={setUser} 
                            cart={cart} 
                            setCart={setCart}
                            handleLoginSuccess={handleLoginSuccess}
                        />
                    } 
                />

                <Route 
                    path="/admin" 
                    element={
                        <ProtectedAdminRoute>
                            <AdminPanel />
                        </ProtectedAdminRoute>
                    } 
                />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}