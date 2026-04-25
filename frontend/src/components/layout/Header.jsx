import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  HiOutlineShoppingCart,
  HiOutlineSearch,
  HiOutlineUser,
  HiOutlineHeart,
  HiX,
  HiMenu,
  HiChevronDown,
} from 'react-icons/hi';
import useAuth from '../../hooks/useAuth';
import useCart from '../../hooks/useCart';
import { toggleMenu, closeMenu } from '../../features/ui/uiSlice';
import { useGetCategoriesQuery } from '../../services/productsApi';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAdmin, isAuthenticated, logout } = useAuth();
  const { count, toggleCart } = useCart();
  const menuOpen = useSelector((s) => s.ui.menuOpen);
  const { data: categories = [] } = useGetCategoriesQuery();
  const [search, setSearch] = useState('');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/productos?search=${encodeURIComponent(search.trim())}`);
      setSearch('');
      dispatch(closeMenu());
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Hamburger + Logo */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => dispatch(toggleMenu())}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                aria-label="Menú"
              >
                {menuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
              </button>
              <Link to="/" className="flex items-center gap-2" onClick={() => dispatch(closeMenu())}>
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">T</span>
                </div>
                <span className="font-bold text-lg text-gray-900 hidden sm:block">
                  {import.meta.env.VITE_STORE_NAME || 'Mi Tienda'}
                </span>
              </Link>
            </div>

            {/* Desktop search */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-6">
              <div className="relative w-full">
                <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar productos..."
                  className="input-field pl-10 pr-4 py-2 text-sm"
                />
              </div>
            </form>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              {isAuthenticated ? (
                <div className="relative group">
                  <button className="flex items-center gap-1 p-2 rounded-xl hover:bg-gray-100 transition-colors">
                    <HiOutlineUser size={22} />
                    <span className="hidden sm:block text-sm font-medium max-w-[80px] truncate">
                      {user?.nombre}
                    </span>
                    <HiChevronDown size={14} className="hidden sm:block" />
                  </button>
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <Link to="/perfil" className="block px-4 py-2 text-sm hover:bg-gray-50">Mi perfil</Link>
                    <Link to="/mis-ordenes" className="block px-4 py-2 text-sm hover:bg-gray-50">Mis pedidos</Link>
                    <Link to="/favoritos" className="block px-4 py-2 text-sm hover:bg-gray-50">Favoritos</Link>
                    {isAdmin && (
                      <Link to="/admin" className="block px-4 py-2 text-sm text-primary-600 font-medium hover:bg-gray-50 border-t border-gray-100">
                        Panel Admin
                      </Link>
                    )}
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 border-t border-gray-100"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              ) : (
                <Link to="/login" className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                  <HiOutlineUser size={22} />
                </Link>
              )}

              {isAuthenticated && (
                <Link to="/favoritos" className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                  <HiOutlineHeart size={22} />
                </Link>
              )}

              <button
                onClick={toggleCart}
                className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <HiOutlineShoppingCart size={22} />
                {count > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {count > 9 ? '9+' : count}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile slide-in menu */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-300 ${
          menuOpen ? 'visible' : 'invisible'
        }`}
      >
        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
            menuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => dispatch(closeMenu())}
        />

        {/* Drawer */}
        <nav
          className={`absolute top-0 left-0 w-72 h-full bg-white shadow-2xl flex flex-col transition-transform duration-300 ${
            menuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <span className="font-bold text-lg">Menú</span>
            <button onClick={() => dispatch(closeMenu())} className="p-1 rounded-lg hover:bg-gray-100">
              <HiX size={22} />
            </button>
          </div>

          {/* Mobile search */}
          <form onSubmit={handleSearch} className="px-5 py-3 border-b border-gray-100">
            <div className="relative">
              <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar..."
                className="input-field pl-9 py-2 text-sm"
              />
            </div>
          </form>

          {/* Nav Links */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-1">
            <Link
              to="/"
              onClick={() => dispatch(closeMenu())}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 font-medium transition-colors"
            >
              Inicio
            </Link>
            <Link
              to="/productos"
              onClick={() => dispatch(closeMenu())}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 font-medium transition-colors"
            >
              Todos los productos
            </Link>

            {categories.length > 0 && (
              <div className="pt-2">
                <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Categorías
                </p>
                {categories.map((cat) => (
                  <Link
                    key={cat._id}
                    to={`/productos?categoria=${cat._id}`}
                    onClick={() => dispatch(closeMenu())}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 text-sm transition-colors"
                  >
                    {cat.nombre}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-5 py-4 border-t border-gray-100 space-y-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/perfil"
                  onClick={() => dispatch(closeMenu())}
                  className="block w-full text-center btn-secondary text-sm"
                >
                  Mi perfil
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => dispatch(closeMenu())}
                    className="block w-full text-center bg-primary-600 text-white font-semibold py-2 px-4 rounded-xl text-sm hover:bg-primary-700 transition-colors"
                  >
                    ⚙️ Panel Admin
                  </Link>
                )}
                <button onClick={() => { logout(); dispatch(closeMenu()); }} className="w-full btn-danger text-sm">
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => dispatch(closeMenu())} className="block w-full text-center btn-primary text-sm">
                  Iniciar sesión
                </Link>
                <Link to="/registro" onClick={() => dispatch(closeMenu())} className="block w-full text-center btn-secondary text-sm">
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </>
  );
};

export default Header;
