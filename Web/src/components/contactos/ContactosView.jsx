import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  Building2, 
  UserCheck, 
  Plus, 
  Phone, 
  Mail, 
  MapPin, 
  Edit3, 
  Trash2, 
  Search,
  X,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

export const ContactosView = () => {
  const { 
    data, 
    addCliente, 
    deleteCliente,
    toggleCliente,
    updateCliente, 
    addProveedor, 
    deleteProveedor,
    toggleProveedor,
    updateProveedor 
  } = useApp();

  const [activeTab, setActiveTab] = useState('clientes'); // 'clientes' | 'proveedores'
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form states
  const [form, setForm] = useState({
    Nombre: '',
    Telefono: '',
    Email: '',
    Direccion: '',
    TipoProveedor: 'Distribuidor Mayorista',
    Notas: ''
  });

  const openCreateModal = () => {
    setEditingItem(null);
    setForm({
      Nombre: '',
      Telefono: '',
      Email: '',
      Direccion: '',
      TipoProveedor: 'Distribuidor Mayorista',
      Notas: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setForm({
      Nombre: item.Nombre,
      Telefono: item.Telefono || '',
      Email: item.Email || '',
      Direccion: item.Direccion || '',
      TipoProveedor: item.TipoProveedor || 'Distribuidor Mayorista',
      Notas: item.Notas || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.Nombre) {
      alert('El nombre es obligatorio.');
      return;
    }

    if (activeTab === 'clientes') {
      if (editingItem) {
        updateCliente(editingItem.ClienteID, form);
      } else {
        addCliente(form);
      }
    } else {
      if (editingItem) {
        updateProveedor(editingItem.ProveedorID, form);
      } else {
        addProveedor(form);
      }
    }

    setIsModalOpen(false);
  };

  const handleDeleteCliente = async (id, nombre) => {
    if (!confirm(`¿Eliminar cliente "${nombre}"?`)) return;
    await deleteCliente(id);
  };

  const handleDeleteProveedor = async (id, nombre) => {
    if (!confirm(`¿Eliminar proveedor "${nombre}"?`)) return;
    await deleteProveedor(id);
  };

  const filteredClientes = data.Clientes.filter(c => 
    c.Nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.Telefono && c.Telefono.includes(searchTerm)) ||
    (c.Email && c.Email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredProveedores = data.Proveedores.filter(p => 
    p.Nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.TipoProveedor && p.TipoProveedor.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 text-left">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Users className="h-5 w-5 text-amber-400" />
            <span>Directorio de Clientes y Proveedores</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Agenda de contactos, importadores de fragancias y clientes recurrentes de decants.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-xl bg-zinc-900 border border-zinc-800 p-1">
            <button
              onClick={() => { setActiveTab('clientes'); setSearchTerm(''); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${activeTab === 'clientes' ? 'bg-amber-500 text-zinc-950 shadow-md' : 'text-zinc-400 hover:text-white'}`}
            >
              Clientes ({data.Clientes.length})
            </button>
            <button
              onClick={() => { setActiveTab('proveedores'); setSearchTerm(''); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${activeTab === 'proveedores' ? 'bg-amber-500 text-zinc-950 shadow-md' : 'text-zinc-400 hover:text-white'}`}
            >
              Proveedores ({data.Proveedores.length})
            </button>
          </div>

          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 px-4 py-2 text-xs font-bold shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>{activeTab === 'clientes' ? 'Nuevo Cliente' : 'Nuevo Proveedor'}</span>
          </button>
        </div>
      </div>

      {/* Search Filter */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={`Buscar en ${activeTab === 'clientes' ? 'clientes' : 'proveedores'}...`}
          className="w-full rounded-xl bg-zinc-900 border border-zinc-700/80 pl-10 pr-4 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
        />
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(activeTab === 'clientes' ? filteredClientes : filteredProveedores).map(item => {
          const id = item.ClienteID || item.ProveedorID;
          return (
            <div
              key={id}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-3 flex flex-col justify-between hover:border-amber-500/40 transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono text-zinc-500">#{id}</span>
                    <h3 className="text-sm font-bold text-zinc-100">{item.Nombre}</h3>
                    {item.TipoProveedor && (
                      <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-800 text-[10px] font-semibold">
                        {item.TipoProveedor}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer"
                      title="Editar"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    {activeTab === 'clientes' ? (
                      <button
                        onClick={() => handleDeleteCliente(id, item.Nombre)}
                        className="p-1 rounded text-zinc-500 hover:text-rose-400 hover:bg-rose-950/40 cursor-pointer"
                        title="Eliminar cliente"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleDeleteProveedor(id, item.Nombre)}
                        className="p-1 rounded text-zinc-500 hover:text-rose-400 hover:bg-rose-950/40 cursor-pointer"
                        title="Eliminar proveedor"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-3 space-y-1.5 text-xs text-zinc-300">
                  {item.Telefono && (
                    <div className="flex items-center gap-2 text-zinc-400">
                      <Phone className="h-3.5 w-3.5 text-amber-400" />
                      <span>{item.Telefono}</span>
                    </div>
                  )}
                  {item.Email && (
                    <div className="flex items-center gap-2 text-zinc-400 truncate">
                      <Mail className="h-3.5 w-3.5 text-cyan-400" />
                      <span>{item.Email}</span>
                    </div>
                  )}
                  {item.Direccion && (
                    <div className="flex items-start gap-2 text-zinc-400 text-[11px]">
                      <MapPin className="h-3.5 w-3.5 text-rose-400 mt-0.5 flex-shrink-0" />
                      <span>{item.Direccion}</span>
                    </div>
                  )}
                </div>
              </div>

              {item.Notas && (
                <div className="pt-2 border-t border-zinc-800/80 text-[11px] text-zinc-500 italic line-clamp-2">
                  "{item.Notas}"
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-2xl border border-zinc-700 bg-[#12141c] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="h-4 w-4 text-amber-400" />
                <span>
                  {editingItem ? 'Editar' : 'Registrar'} {activeTab === 'clientes' ? 'Cliente' : 'Proveedor'}
                </span>
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-300 font-medium mb-1">Nombre Completo / Razón Social *</label>
                <input
                  type="text"
                  required
                  value={form.Nombre}
                  onChange={(e) => setForm({ ...form, Nombre: e.target.value })}
                  placeholder="Ej: Alejandro Morales Mora"
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3 py-2 text-zinc-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              {activeTab === 'proveedores' && (
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Tipo de Proveedor</label>
                  <input
                    type="text"
                    value={form.TipoProveedor}
                    onChange={(e) => setForm({ ...form, TipoProveedor: e.target.value })}
                    placeholder="Ej: Distribuidor Mayorista, Insumos Decant..."
                    className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3 py-2 text-zinc-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Teléfono / WhatsApp</label>
                  <input
                    type="text"
                    value={form.Telefono}
                    onChange={(e) => setForm({ ...form, Telefono: e.target.value })}
                    placeholder="+506 8888-9999"
                    className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3 py-2 text-zinc-100 focus:border-amber-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    value={form.Email}
                    onChange={(e) => setForm({ ...form, Email: e.target.value })}
                    placeholder="cliente@ejemplo.com"
                    className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3 py-2 text-zinc-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">Dirección Física / Entregas</label>
                <input
                  type="text"
                  value={form.Direccion}
                  onChange={(e) => setForm({ ...form, Direccion: e.target.value })}
                  placeholder="Ej: San José, Curridabat, Residencial..."
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3 py-2 text-zinc-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">Notas / Preferencias</label>
                <textarea
                  rows="2"
                  value={form.Notas}
                  onChange={(e) => setForm({ ...form, Notas: e.target.value })}
                  placeholder="Fragancias favoritas, decants preferidos..."
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3 py-2 text-zinc-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2 text-xs font-semibold text-zinc-300 hover:bg-zinc-700 hover:text-white cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-amber-500 hover:bg-amber-400 px-5 py-2 text-xs font-bold text-zinc-950 shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  Guardar Contacto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
