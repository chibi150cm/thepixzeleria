import { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import '../../styles/AdminPanel.css'

const AdminLayout = ({ children, activeSection, onSectionChange }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [adminUser, setAdminUser] = useState(null);

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');

    console.log("🔍 AdminLayout - Verificando usuario...");
    console.log("currentUser:", currentUser);

    if (!currentUser) {
      console.log("No hay usuario logueado, redirigiendo...");
      window.location.href = '/thepixzeleria/';
      return;
    }

    const user = JSON.parse(currentUser);
    console.log("Usuario parseado:", user);
    console.log("¿Es admin?", user.role === 'admin');

    if (user.role !== 'admin') {
      console.log("Usuario no es admin, redirigiendo...");
      window.location.href = '/thepixzeleria/';
      return;
    }

    console.log("Usuario admin válido");
    setAdminUser(user);
  }, []);

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      // Limpiar localStorage
      localStorage.removeItem('currentUser');
      console.log("Sesión cerrada");
      window.location.href = '/thepixzeleria/';
    }
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  if (!adminUser) {
    return (
      <div className="admin-loading" style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '20px'
      }}>
        <div style={{ fontSize: '40px', marginBottom: '20px' }}>⏳</div>
        <p>Cargando panel de administración...</p>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <AdminSidebar
        isCollapsed={isSidebarCollapsed}
        activeSection={activeSection}
        onSectionChange={onSectionChange}
        onLogout={handleLogout}
      />

      <main className={`admin-main ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <AdminHeader
          adminUser={adminUser}
          activeSection={activeSection}
          onToggleSidebar={toggleSidebar}
        />

        <div className="admin-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;