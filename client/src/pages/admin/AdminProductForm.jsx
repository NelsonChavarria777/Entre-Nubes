import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import './AdminProductForm.css';

const CATEGORIES = [
  'Pipas',
  'Molinillos', 
  'Papeles',
  'Vaporizadores',
  'Almacenamiento',
  'Encendedores',
  'Accesorios'
];

const BADGES = [
  { value: '', label: 'Sin badge' },
  { value: 'Nuevo', label: 'Nuevo' },
  { value: 'OFERTA', label: 'Oferta' },
  { value: 'Popular', label: 'Popular' },
  { value: 'Premium', label: 'Premium' },
  { value: 'Pack x3', label: 'Pack x3' },
  { value: 'Pack x5', label: 'Pack x5' },
  { value: 'Pack x10', label: 'Pack x10' }
];

function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    discount: '',
    amount: '',
    category: CATEGORIES[0],
    description: '',
    badge: '',
    badgeBg: '#8DC63F',
    badgeColor: '#fff',
    image: '/images/producto_gen.webp',
    image2: '',
    image3: '',
    variants: ['Standard']
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [variantInput, setVariantInput] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'https://entre-nubes-ten.vercel.app';

  useEffect(() => {
    if (isEditing) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/productos/${id}`);
      if (!response.ok) throw new Error('Producto no encontrado');
      const product = await response.json();
      
      setFormData({
        ...product,
        price: product.price.toString(),
        discount: product.discount?.toString() || '',
        amount: product.amount.toString()
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBadgeChange = (e) => {
    const badge = e.target.value;
    let badgeBg = '#8DC63F';
    let badgeColor = '#fff';

    // Configurar colores automáticamente según el badge
    switch (badge) {
      case 'Nuevo':
        badgeBg = '#D3FF0B';
        badgeColor = '#000';
        break;
      case 'OFERTA':
      case 'Oferta':
        badgeBg = '#FF3913';
        badgeColor = '#fff';
        break;
      case 'Popular':
        badgeBg = '#8DC63F';
        badgeColor = '#fff';
        break;
      case 'Premium':
        badgeBg = '#000';
        badgeColor = '#D3FF0B';
        break;
      default:
        badgeBg = '#8DC63F';
        badgeColor = '#fff';
    }

    setFormData(prev => ({
      ...prev,
      badge,
      badgeBg,
      badgeColor
    }));
  };

  const addVariant = () => {
    if (variantInput.trim() && !formData.variants.includes(variantInput.trim())) {
      setFormData(prev => ({
        ...prev,
        variants: [...prev.variants, variantInput.trim()]
      }));
      setVariantInput('');
    }
  };

  const removeVariant = (variant) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter(v => v !== variant)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      // Preparar datos para enviar
      const productData = {
        ...formData,
        price: Number(formData.price),
        discount: formData.discount ? Number(formData.discount) : null,
        amount: Number(formData.amount)
      };

      const url = isEditing 
        ? `${API_URL}/api/productos/${id}`
        : `${API_URL}/api/productos`;

      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al guardar el producto');
      }

      navigate('/administracion/productos');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title={isEditing ? 'Editar Producto' : 'Nuevo Producto'}>
        <div className="admin-loading">
          <div className="admin-spinner-large"></div>
          <p>Cargando producto...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={isEditing ? 'Editar Producto' : 'Nuevo Producto'}>
      <div className="admin-product-form-container">
        {/* Breadcrumb */}
        <nav className="admin-breadcrumb">
          <Link to="/administracion/productos">Productos</Link>
          <span>/</span>
          <span>{isEditing ? 'Editar' : 'Nuevo'}</span>
        </nav>

        {error && (
          <div className="admin-form-error">
            <span>⚠️</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-product-form">
          <div className="admin-form-grid">
            {/* Left Column - Basic Info */}
            <div className="admin-form-section">
              <h3 className="admin-form-section-title">Información básica</h3>
              
              <div className="admin-form-group">
                <label htmlFor="name">Nombre del producto *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Ej: Glass Pipe Premium"
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="category">Categoría *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="admin-form-group">
                <label htmlFor="description">Descripción *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="4"
                  placeholder="Describe las características del producto..."
                />
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label htmlFor="price">Precio (CRC) *</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    placeholder="10000"
                  />
                </div>

                <div className="admin-form-group">
                  <label htmlFor="amount">Stock *</label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                    min="0"
                    placeholder="10"
                  />
                </div>

                <div className="admin-form-group">
                  <label htmlFor="discount">Descuento (%)</label>
                  <input
                    type="number"
                    id="discount"
                    name="discount"
                    value={formData.discount}
                    onChange={handleChange}
                    min="0"
                    max="99"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Images & Badge */}
            <div className="admin-form-section">
              <h3 className="admin-form-section-title">Imágenes y Badge</h3>

              <div className="admin-form-group">
                <label htmlFor="image">URL Imagen principal *</label>
                <input
                  type="text"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  required
                  placeholder="/images/producto_gen.webp"
                />
                {formData.image && (
                  <img 
                    src={formData.image} 
                    alt="Preview" 
                    className="admin-image-preview"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                )}
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label htmlFor="badge">Badge</label>
                  <select
                    id="badge"
                    name="badge"
                    value={formData.badge}
                    onChange={handleBadgeChange}
                  >
                    {BADGES.map(badge => (
                      <option key={badge.value} value={badge.value}>{badge.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Variants */}
              <div className="admin-form-group">
                <label>Variantes disponibles</label>
                <div className="admin-variants-list">
                  {formData.variants.map((variant, index) => (
                    <span key={index} className="admin-variant-tag">
                      {variant}
                      <button
                        type="button"
                        onClick={() => removeVariant(variant)}
                        className="admin-variant-remove"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="admin-variants-add">
                  <input
                    type="text"
                    value={variantInput}
                    onChange={(e) => setVariantInput(e.target.value)}
                    placeholder="Nueva variante"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addVariant())}
                  />
                  <button
                    type="button"
                    onClick={addVariant}
                    className="admin-btn admin-btn-secondary"
                  >
                    Agregar
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="admin-form-actions">
            <Link to="/administracion/productos" className="admin-btn admin-btn-secondary">
              Cancelar
            </Link>
            <button
              type="submit"
              className="admin-btn admin-btn-primary"
              disabled={saving}
            >
              {saving ? (
                <>
                  <span className="admin-spinner-small"></span>
                  Guardando...
                </>
              ) : (
                isEditing ? '💾 Guardar cambios' : '➕ Crear producto'
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

export default AdminProductForm;
