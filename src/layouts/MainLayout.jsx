import { Outlet } from 'react-router-dom';
import SidebarLayout from './SidebarLayout';
import { FolderProvider } from '../context/FolderContext';

export default function MainLayout() {
  return (
    <FolderProvider>
      <div className="app-layout">
        <SidebarLayout />
        <main className="main-layout">
          <Outlet />
        </main>
      </div>
    </FolderProvider>
  );
}
