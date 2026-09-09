import NavBar from '../components/NavBar'
import HeroBanner from '../components/HeroBannerInicio'
import ProductGridInicio from '../components/ProductGridInicio'
import ProductGridProductos from '../components/ProductGridProductos'
import ContactSection from '../components/ContactSection'
import Footer from '../components/Footer'

function Inicio() {
  return (
    <div>
      <NavBar />
      <HeroBanner />
      <ProductGridProductos />
      <ContactSection />
      <Footer />
    </div>
  )
}

export default Inicio