'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { usePathname } from 'next/navigation';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsMenuOpen((v) => !v);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="fixed top-0 left-0 w-full z-40">
      <div className="backdrop-blur-xl bg-white/70 border-b border-blue-200/40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between h-16 relative">
          {/* Logo Centralizado */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex items-center space-x-2 group select-none">
            <div className="w-11 h-11 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform duration-300">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="font-extrabold text-lg text-transparent bg-clip-text bg-gradient-to-tr from-blue-600 to-purple-600 drop-shadow-sm">EduForm</span>
          </Link>

          {/* Navegação Desktop */}
          <nav className="hidden md:flex items-center gap-2 ml-auto">
            <Link href="/" className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-200 ${pathname === '/' ? 'bg-gradient-to-tr from-blue-500 to-purple-500 text-white shadow-lg scale-105' : 'text-blue-700 hover:bg-blue-100/60 hover:text-blue-900'}`}> 
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              Início
            </Link>
            <Link href="/admin" className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-200 ${pathname.startsWith('/admin') ? 'bg-gradient-to-tr from-purple-500 to-blue-500 text-white shadow-lg scale-105' : 'text-purple-700 hover:bg-purple-100/60 hover:text-purple-900'}`}> 
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              Admin
            </Link>
          </nav>

          {/* Menu Hamburguer Mobile - AGORA À DIREITA */}
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 ml-auto"
            onClick={toggleMenu}
            aria-label="Abrir menu"
          >
            <span className="sr-only">Abrir menu</span>
            <div className={`transition-all duration-300 ${isMenuOpen ? 'rotate-45' : ''}`}>
              <span className={`block w-6 h-0.5 bg-white mb-1 transition-all duration-300 ${isMenuOpen ? 'translate-y-1.5 rotate-45' : ''}`}></span>
              <span className={`block w-6 h-0.5 bg-white mb-1 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? '-translate-y-1.5 -rotate-45' : ''}`}></span>
            </div>
          </button>
        </div>
      </div>
      {/* Overlay e menu mobile */}
      <div className={`fixed inset-0 z-40 transition-all duration-300 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        {/* Overlay escuro */}
        <div className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-all duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`} onClick={closeMenu}></div>
        {/* Menu mobile flutuante */}
        <div className={`absolute top-0 right-0 w-4/5 max-w-xs h-full bg-white/90 shadow-2xl rounded-l-3xl p-6 flex flex-col gap-4 transform transition-all duration-300 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`} style={{backdropFilter: 'blur(16px)'}}>
          {/* Botão de fechar (X) */}
          <button
            onClick={closeMenu}
            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors duration-200 text-3xl font-bold focus:outline-none"
            aria-label="Fechar menu"
          >
            &times;
          </button>
          <Link href="/" onClick={closeMenu} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${pathname === '/' ? 'bg-gradient-to-tr from-blue-500 to-purple-500 text-white shadow-lg scale-105' : 'text-blue-700 hover:bg-blue-100/60 hover:text-blue-900'}`}> 
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            Início
          </Link>
          <Link href="/admin" onClick={closeMenu} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${pathname.startsWith('/admin') ? 'bg-gradient-to-tr from-purple-500 to-blue-500 text-white shadow-lg scale-105' : 'text-purple-700 hover:bg-purple-100/60 hover:text-purple-900'}`}> 
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            Admin
          </Link>
        </div>
      </div>
    </header>
  );
}; 