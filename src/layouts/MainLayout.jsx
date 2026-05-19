import { Outlet } from 'react-router-dom';
import SidebarLayout from './SidebarLayout';
import { BookmarkProvider } from '../context/BookmarkContext';

export default function MainLayout() {
  return (
    <BookmarkProvider>
      <div className="app-layout">
        <SidebarLayout />
        <main className="main-layout">
          <Outlet />
        </main>
      </div>
    </BookmarkProvider>
  );
}