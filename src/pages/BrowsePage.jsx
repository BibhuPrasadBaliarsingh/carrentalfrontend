import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FiSearch, FiFilter, FiX } from 'react-icons/fi'
import CarCard from '../components/CarCard'
import { CarCardSkeleton, EmptyState } from '../components/UI'
import { carsAPI } from '../services/api'
import { MOCK_CARS } from '../data/mockData'

const BRANDS = ['Ferrari', 'Mercedes', 'Land Rover', 'Porsche', 'BMW', 'Tesla', 'Lamborghini', 'Audi', 'McLaren']
const CATEGORIES = ['Sports', 'Luxury', 'SUV', 'Electric', 'Supercar']
const FUELS = ['Petrol', 'Hybrid', 'Electric', 'Diesel']

export default function BrowsePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('price-asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [filtersOpen, setFiltersOpen] = useState(() => window.innerWidth >= 768)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [isTablet, setIsTablet] = useState(window.innerWidth < 1024)
  const [filters, setFilters] = useState({
    brand: '',
    category: searchParams.get('category') || '',
    fuel: '',
    minPrice: 0,
    maxPrice: 2000,
    transmission: '',
    available: true,
  })
  const PER_PAGE = 9

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
      setIsTablet(window.innerWidth < 1024)
      if (window.innerWidth < 768) setFiltersOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true)
      try {
        const res = await carsAPI.getAll()
        setCars(res.data.cars || res.data)
      } catch {
        setCars(MOCK_CARS)
      } finally {
        setLoading(false)
      }
    }
    fetchCars()
  }, [])

  const resetFilters = () => setFilters({ brand: '', category: '', fuel: '', minPrice: 0, maxPrice: 2000, transmission: '', available: true })

  const filtered = cars.filter(c => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.brand.toLowerCase().includes(search.toLowerCase())) return false
    if (filters.brand && c.brand !== filters.brand) return false
    if (filters.category && c.category !== filters.category) return false
    if (filters.fuel && (c.fuelType || c.fuel) !== filters.fuel) return false
    if (c.pricePerDay < filters.minPrice || c.pricePerDay > filters.maxPrice) return false
    if (filters.transmission && c.transmission !== filters.transmission) return false
    return true
  }).sort((a, b) => {
    if (sort === 'price-asc') return a.pricePerDay - b.pricePerDay
    if (sort === 'price-desc') return b.pricePerDay - a.pricePerDay
    if (sort === 'rating') return (b.rating || 0) - (a.rating || 0)
    if (sort === 'name') return a.name.localeCompare(b.name)
    return 0
  })

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE)

  const labelStyle = { display: 'block', color: '#9ca3af', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }
  const selectStyle = { width: '100%', background: '#1f2937', border: '1px solid #374151', borderRadius: 8, color: '#d1d5db', padding: '9px 12px', fontSize: 13, outline: 'none', cursor: 'pointer' }

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', padding: isMobile ? '20px 16px' : '40px 48px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ color: '#fff', fontSize: isMobile ? 26 : 34, fontWeight: 800, margin: '0 0 8px', letterSpacing: -1 }}>Browse Cars</h1>
          <p style={{ color: '#6b7280', fontSize: 15 }}>Find the perfect luxury car for your next journey</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile || !filtersOpen ? '1fr' : '260px 1fr', gap: isMobile ? 16 : filtersOpen ? 32 : 0, transition: 'all 0.3s' }}>

          {/* ── Sidebar ──────────────────────────────────────────────────────── */}
          {filtersOpen && (
            <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 12, padding: isMobile ? 18 : 24, height: 'fit-content', position: isMobile ? 'relative' : 'sticky', top: isMobile ? 'auto' : 80, width: '100%', minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <FiFilter size={16} color="#ef4444" />
                  <span style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>Filters</span>
                </div>
                <button onClick={resetFilters} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>Reset All</button>
              </div>

              {/* Car Type */}
              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle}>Car Type</label>
                {CATEGORIES.map(cat => (
                  <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, cursor: 'pointer' }}>
                    <input type="checkbox" checked={filters.category === cat} onChange={() => setFilters(f => ({ ...f, category: f.category === cat ? '' : cat }))} />
                    <span style={{ color: filters.category === cat ? '#ef4444' : '#d1d5db', fontSize: 14, transition: 'color 0.2s' }}>{cat}</span>
                    <span style={{ marginLeft: 'auto', color: '#4b5563', fontSize: 12 }}>{cars.filter(c => c.category === cat).length}</span>
                  </label>
                ))}
              </div>

              {/* Price */}
              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle}>Price Range</label>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ color: '#6b7280', fontSize: 12 }}>${filters.minPrice}</span>
                  <span style={{ color: '#ef4444', fontSize: 12, fontWeight: 700 }}>${filters.maxPrice}/day</span>
                </div>
                <input type="range" min={0} max={2000} step={50} value={filters.maxPrice} onChange={e => setFilters(f => ({ ...f, maxPrice: +e.target.value }))} style={{ width: '100%' }} />
              </div>

              {/* Brand */}
              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle}>Brand</label>
                <select value={filters.brand} onChange={e => setFilters(f => ({ ...f, brand: e.target.value }))} style={selectStyle}>
                  <option value="">All Brands</option>
                  {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              {/* Fuel */}
              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle}>Fuel Type</label>
                <select value={filters.fuel} onChange={e => setFilters(f => ({ ...f, fuel: e.target.value }))} style={selectStyle}>
                  <option value="">All Types</option>
                  {FUELS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>

              {/* Transmission */}
              <div>
                <label style={labelStyle}>Transmission</label>
                <select value={filters.transmission} onChange={e => setFilters(f => ({ ...f, transmission: e.target.value }))} style={selectStyle}>
                  <option value="">All</option>
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>
            </div>
          )}

          {/* ── Main Grid ──────────────────────────────────────────────────── */}
          <div style={{ minWidth: 0 }}>
            {/* Controls */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 24, alignItems: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => setFiltersOpen(!filtersOpen)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#111827', border: '1px solid #374151', color: '#9ca3af', padding: '9px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>
                {filtersOpen ? <FiX size={14} /> : <FiFilter size={14} />} {filtersOpen ? 'Hide' : 'Show'} Filters
              </button>

              <div style={{ flex: 1, position: 'relative', minWidth: 200 }}>
                <FiSearch size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
                <input placeholder="Search by name or brand..." value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1) }}
                  style={{ width: '100%', background: '#111827', border: '1px solid #374151', borderRadius: 8, color: '#fff', padding: '9px 12px 9px 34px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
              </div>

              <select value={sort} onChange={e => setSort(e.target.value)} style={{ background: '#111827', border: '1px solid #374151', borderRadius: 8, color: '#d1d5db', padding: '9px 14px', fontSize: 14, outline: 'none', cursor: 'pointer' }}>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
                <option value="rating">Top Rated</option>
                <option value="name">Name A-Z</option>
              </select>

              <span style={{ color: '#6b7280', fontSize: 13, whiteSpace: 'nowrap' }}>{filtered.length} cars found</span>
            </div>

            {/* Active filter chips */}
            {(filters.category || filters.brand || filters.fuel || filters.transmission) && (
              <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                {[filters.category, filters.brand, filters.fuel, filters.transmission].filter(Boolean).map(val => (
                  <span key={val} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#ef4444', padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                    {val}
                    <FiX size={11} style={{ cursor: 'pointer' }} onClick={() => setFilters(f => ({ ...f, category: f.category === val ? '' : f.category, brand: f.brand === val ? '' : f.brand, fuel: f.fuel === val ? '' : f.fuel, transmission: f.transmission === val ? '' : f.transmission }))} />
                  </span>
                ))}
              </div>
            )}

            {/* Grid */}
            {loading ? (
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: 20 }}>
                {Array(6).fill(0).map((_, i) => <CarCardSkeleton key={i} />)}
              </div>
            ) : paginated.length === 0 ? (
              <EmptyState icon="🚗" title="No cars found" message="Try adjusting your filters or search terms." action="Reset Filters" onAction={resetFilters} />
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: 20 }}>
                {paginated.map((car, i) => <CarCard key={car._id} car={car} index={i} />)}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 36 }}>
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                  style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #374151', background: 'none', color: currentPage === 1 ? '#4b5563' : '#9ca3af', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontSize: 14 }}>
                  ← Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button key={i} onClick={() => setCurrentPage(i + 1)}
                    style={{ width: 38, height: 38, borderRadius: 8, border: '1px solid', borderColor: currentPage === i + 1 ? '#ef4444' : '#374151', background: currentPage === i + 1 ? '#ef4444' : 'transparent', color: currentPage === i + 1 ? '#fff' : '#9ca3af', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
                    {i + 1}
                  </button>
                ))}
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                  style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #374151', background: 'none', color: currentPage === totalPages ? '#4b5563' : '#9ca3af', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', fontSize: 14 }}>
                  Next →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
