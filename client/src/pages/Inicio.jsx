import NavBar from '../components/NavBar'
import HeroBanner from '../components/HeroBannerInicio'
import ProductGridInicio from '../components/ProductGridInicio'
import ContactSection from '../components/ContactSection'
import Footer from '../components/Footer'

function Inicio() {
  return (
    <div>
      <NavBar />
      <HeroBanner />
      <ProductGridInicio />
      <ContactSection />
      <Footer />
    </div>
  )
}

export default Inicio