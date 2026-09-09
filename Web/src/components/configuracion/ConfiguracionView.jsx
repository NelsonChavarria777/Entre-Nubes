import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { generateSQLScript } from '../../services/sqlExporter';
import { 
  Settings, 
  Database, 
  Download, 
  Upload, 
  RotateCcw, 
  Copy, 
  Check, 
  Plus, 
  CreditCard, 
  Tag, 
  Layers,
  FileCode,
  ShieldCheck,
  Trash2,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

export const ConfiguracionView = () => {
  const { 
    data, 
    addMetodoPago, 
    deleteMetodoPago,
    toggleMetodoPago,
    addCategoriaGasto, 
    deleteCategoriaGasto,
    toggleCategoriaGasto,
    handleReset, 
    handleExportJSON, 
    handleExportSQL, 
    handleImportJSON,
    showToast 
  } = useApp();

  const [copied, setCopied] = useState(false);
  const [showSqlModal, setShowSqlModal] = useState(false);
  const [newMetodo, setNewMetodo] = useState({ Metodo: '', Descripcion: '' });
  const [newCategoria, setNewCategoria] = useState({ Nombre: '', Descripcion: '' });

  const handleDeleteMetodo = async (id, nombre) => {
    if (!confirm(`¿Eliminar método de pago "${nombre}"?`)) return;
    await deleteMetodoPago(id);
  };

  const handleToggleMetodo = async (id, nombre, activo) => {
    await toggleMetodoPago(id);
  };

  const handleDeleteCategoria = async (id, nombre) => {
    if (!confirm(`¿Eliminar categoría "${nombre}"?`)) return;
    await deleteCategoriaGasto(id);
  };

  const handleToggleCategoria = async (id, nombre, activo) => {
    await toggleCategoriaGasto(id);
  };

  const generatedSQL = generateSQLScript(data);

  const handleCopySQL = () => {
    navigator.clipboard.writeText(generatedSQL);
    setCopied(true);
    showToast('Script T-SQL copiado al portapapeles');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      handleImportJSON(event.target.result);
    };
    reader.readAsText(file);
  };

  const handleAddMetodo = (e) => {
    e.preventDefault();
    if (!newMetodo.Metodo) return;
    addMetodoPago(newMetodo);
    setNewMetodo({ Metodo: '', Descripcion: '' });
  };

  const handleAddCategoria = (e) => {
    e.preventDefault();
    if (!newCategoria.Nombre) return;
    addCategoriaGasto(newCategoria);
    setNewCategoria({ Nombre: '', Descripcion: '' });
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Settings className="h-5 w-5 text-amber-400" />
            <span>Configuración del Sistema & Conexión SQL Server</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Gestión de catálogos maestros, respaldos y exportación directa de sentencias INSERT para SQL Server <code className="text-amber-300 font-mono">efluvio</code>.
          </p>
        </div>
      </div>

      {/* SQL SERVER SYNC BANNER */}
      <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-950/30 via-zinc-900 to-zinc-900 p-6 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Database className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">Sincronización con SQL Server</h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                  Esquema 11 Tablas
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
                Puedes generar en tiempo real el script completo con todas las tablas e instrucciones <code className="text-amber-300 font-mono">SET IDENTITY_INSERT</code> compatibles con Microsoft SQL Server Management Studio (SSMS) o Azure Data Studio.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportSQL}
              className="flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 px-4 py-2.5 text-xs font-bold shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Download className="h-4 w-4" />
              <span>Descargar Archivo .sql</span>
            </button>

            <button
              onClick={() => setShowSqlModal(true)}
              className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3.5 py-2.5 text-xs font-medium transition-all cursor-pointer"
            >
              <FileCode className="h-4 w-4 text-amber-400" />
              <span>Ver Script T-SQL</span>
            </button>

            <button
              onClick={handleCopySQL}
              className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3.5 py-2.5 text-xs font-medium transition-all cursor-pointer"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4 text-zinc-400" />}
              <span>{copied ? '¡Copiado!' : 'Copiar SQL'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Métodos de Pago & Categorías de Gasto */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Metodos de Pago */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-zinc-100">
              <CreditCard className="h-4 w-4 text-amber-400" />
              <span>Métodos de Pago (`MetodosPago`)</span>
            </div>
            <span className="text-xs text-zinc-500">{data.MetodosPago.length} configurados</span>
          </div>

          <div className="divide-y divide-zinc-800/80 max-h-48 overflow-y-auto pr-1">
            {data.MetodosPago.map(m => (
              <div key={m.MetodoPagoID} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-zinc-200">{m.Metodo}</div>
                  <div className="text-[10px] text-zinc-500">{m.Descripcion}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleMetodo(m.MetodoPagoID, m.Metodo, m.Activo)}
                    className={`p-1 rounded transition-colors cursor-pointer ${m.Activo ? 'text-emerald-400 hover:bg-emerald-950/40' : 'text-zinc-500 hover:text-amber-400 hover:bg-amber-950/40'}`}
                    title={m.Activo ? 'Inactivar método' : 'Activar método'}
                  >
                    {m.Activo ? <ToggleRight className="h-3.5 w-3.5" /> : <ToggleLeft className="h-3.5 w-3.5" />}
                  </button>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${m.Activo ? 'bg-emerald-950 text-emerald-300' : 'bg-zinc-800 text-zinc-500'}`}>
                    {m.Activo ? 'Activo' : 'Inactivo'}
                  </span>
                  <button
                    onClick={() => handleDeleteMetodo(m.MetodoPagoID, m.Metodo)}
                    className="p-1 rounded text-zinc-500 hover:text-rose-400 hover:bg-rose-950/40 cursor-pointer"
                    title="Eliminar método"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Add Metodo */}
          <form onSubmit={handleAddMetodo} className="pt-3 border-t border-zinc-800 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <input
              type="text"
              required
              placeholder="Nuevo método (ej: Cripto)"
              value={newMetodo.Metodo}
              onChange={(e) => setNewMetodo({ ...newMetodo, Metodo: e.target.value })}
              className="rounded-xl bg-zinc-950 border border-zinc-700 px-3 py-1.5 text-zinc-200 focus:border-amber-500 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Descripción breve..."
              value={newMetodo.Descripcion}
              onChange={(e) => setNewMetodo({ ...newMetodo, Descripcion: e.target.value })}
              className="rounded-xl bg-zinc-950 border border-zinc-700 px-3 py-1.5 text-zinc-200 focus:border-amber-500 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-xl bg-zinc-800 hover:bg-zinc-700 text-amber-300 font-semibold py-1.5 px-3 text-xs border border-zinc-700 flex items-center justify-center gap-1 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Añadir</span>
            </button>
          </form>
        </div>

        {/* Categorias de Gastos */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-zinc-100">
              <Tag className="h-4 w-4 text-rose-400" />
              <span>Categorías de Gastos (`CategoriasGastos`)</span>
            </div>
            <span className="text-xs text-zinc-500">{data.CategoriasGastos.length} categorías</span>
          </div>

          <div className="divide-y divide-zinc-800/80 max-h-48 overflow-y-auto pr-1">
            {data.CategoriasGastos.map(cat => (
              <div key={cat.CategoriaGastoID} className="py-2 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-zinc-200">{cat.Nombre}</div>
                  <div className="text-[10px] text-zinc-500">{cat.Descripcion}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-zinc-500 font-mono">#{cat.CategoriaGastoID}</span>
                  <button
                    onClick={() => handleToggleCategoria(cat.CategoriaGastoID, cat.Nombre, cat.Activo)}
                    className={`p-1 rounded transition-colors cursor-pointer ${cat.Activo ? 'text-emerald-400 hover:bg-emerald-950/40' : 'text-zinc-500 hover:text-amber-400 hover:bg-amber-950/40'}`}
                    title={cat.Activo ? 'Inactivar categoría' : 'Activar categoría'}
                  >
                    {cat.Activo ? <ToggleRight className="h-3.5 w-3.5" /> : <ToggleLeft className="h-3.5 w-3.5" />}
                  </button>
                  <button
                    onClick={() => handleDeleteCategoria(cat.CategoriaGastoID, cat.Nombre)}
                    className="p-1 rounded text-zinc-500 hover:text-rose-400 hover:bg-rose-950/40 cursor-pointer"
                    title="Eliminar categoría"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Add Categoria */}
          <form onSubmit={handleAddCategoria} className="pt-3 border-t border-zinc-800 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <input
              type="text"
              required
              placeholder="Nueva categoría (ej: Impuestos)"
              value={newCategoria.Nombre}
              onChange={(e) => setNewCategoria({ ...newCategoria, Nombre: e.target.value })}
              className="rounded-xl bg-zinc-950 border border-zinc-700 px-3 py-1.5 text-zinc-200 focus:border-rose-500 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Descripción breve..."
              value={newCategoria.Descripcion}
              onChange={(e) => setNewCategoria({ ...newCategoria, Descripcion: e.target.value })}
              className="rounded-xl bg-zinc-950 border border-zinc-700 px-3 py-1.5 text-zinc-200 focus:border-rose-500 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-xl bg-zinc-800 hover:bg-zinc-700 text-rose-300 font-semibold py-1.5 px-3 text-xs border border-zinc-700 flex items-center justify-center gap-1 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Añadir</span>
            </button>
          </form>
        </div>
      </div>

      {/* Backups & Restore Section */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-4">
        <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider">
          Copias de Seguridad & Restauración
        </h3>
        <p className="text-xs text-zinc-400">
          Descarga una copia completa de todos tus datos en JSON para respaldar tus registros o transferirlos a otro equipo.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-4 py-2.5 text-xs font-semibold text-zinc-200 transition-all cursor-pointer"
          >
            <Download className="h-4 w-4 text-cyan-400" />
            <span>Descargar Respaldo JSON</span>
          </button>

          <label className="flex items-center gap-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-4 py-2.5 text-xs font-semibold text-zinc-200 transition-all cursor-pointer">
            <Upload className="h-4 w-4 text-amber-400" />
            <span>Restaurar Archivo JSON</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          <button
            onClick={() => {
              if (confirm('¿Estás seguro de restablecer la base de datos a sus valores iniciales de demostración? Todos los cambios recientes se reiniciarán.')) {
                handleReset();
              }
            }}
            className="flex items-center gap-2 rounded-xl bg-rose-950/40 hover:bg-rose-900 border border-rose-800/80 px-4 py-2.5 text-xs font-semibold text-rose-300 transition-all cursor-pointer ml-auto"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reiniciar a Datos de Fábrica</span>
          </button>
        </div>
      </div>

      {/* SQL Script Viewer Modal */}
      {showSqlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-4xl max-h-[85vh] flex flex-col rounded-2xl border border-zinc-700 bg-[#10121a] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <FileCode className="h-5 w-5 text-amber-400" />
                <h2 className="text-base font-bold text-white">
                  Script T-SQL Generado para Base de Datos [efluvio]
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopySQL}
                  className="flex items-center gap-1.5 rounded-lg bg-amber-500 text-zinc-950 px-3 py-1 text-xs font-bold hover:bg-amber-400 cursor-pointer"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? 'Copiado' : 'Copiar'}</span>
                </button>
                <button
                  onClick={() => setShowSqlModal(false)}
                  className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto rounded-xl bg-zinc-950 p-4 border border-zinc-800">
              <pre className="text-[11px] font-mono text-amber-200/90 whitespace-pre-wrap leading-relaxed select-all">
                {generatedSQL}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
