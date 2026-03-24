import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import HeroBannerProductos from '../components/HeroBannerProductos'
import ProductGridProductos from '../components/ProductGridProductos'
import TrustBar from '../components/TrustBar'

function Productos() {
  return (
    <div>
      <NavBar />
      <HeroBannerProductos />
      <ProductGridProductos />
      <TrustBar />
      <Footer />
    </div>
  )
}
export default Productos