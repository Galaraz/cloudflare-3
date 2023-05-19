import '../styles/globals.css'
import AuthProvider from '../context';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../components/Header';
import Footer from '../components/Footer';



export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      
      <Component {...pageProps} />
      
    </AuthProvider>
  )
}
