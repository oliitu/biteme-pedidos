import { useState, useEffect, useMemo } from 'react'
import Cookie from './components/Cookie'
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header'
import{db} from './data/db'
import './App.css'

function App() {
  const [toast, setToast] = useState('');
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(''), 2000);
      return () => clearTimeout(timer);
    }
  }, [toast]);
    const initialCart= () => {
      const localStorageCart= localStorage.getItem('cart')
      return localStorageCart ? JSON.parse(localStorageCart):[]
    }
  
    const[data,]=useState(db)
    const[cart,setCart]=useState(initialCart)
  
    useEffect(()=>{
      localStorage.setItem('cart',JSON.stringify(cart))
    }, [cart])
  
    const MAX_ITEMS=10
  
    function addToCart(item){
      const itemExists= cart.findIndex(cookie => cookie.id === item.id)
      if(itemExists>= 0) {//exisate en el carrito
        if(cart[itemExists].quantity>= MAX_ITEMS)return
      const updatedCart = [...cart]
      updatedCart[itemExists].quantity++
      setCart(updatedCart)
    } else {
      item.quantity=1
      setCart([...cart,item])
    }
    setToast(`${item.name} agregado al carrito`);
    saveLocalStorage()
    }
  
  function removeFromCart(id) {
    setCart(prevCart => prevCart.filter(guitar=> guitar.id !== id))
    
  }
  
  function increaseQuantity(id){
    const updatedCart=cart.map(item => {
      if(item.id===id && item.quantity < MAX_ITEMS){
        return{
          ...item,
          quantity:item.quantity + 1
        }
      }
      return item
    })
    setCart(updatedCart)
  }
  
  function decreaseQuantity(id) {
    const updatedCart = cart
      .map(item => {
        if (item.id === id) {
          if (item.quantity > 1) {
            return { ...item, quantity: item.quantity - 1 };
          } else {
            return null; 
          }
        }
        return item;
      })
      .filter(item => item !== null); 
    setCart(updatedCart);
  }
  
  function clearCart(){
    setCart([])
  }
  
  function saveLocalStorage(){
    localStorage.setItem('cart', JSON.stringify(cart))
  }

  const [mostrarModal, setMostrarModal] = useState(false);
  const cartTotal = useMemo(() => cart.reduce((total, item) => total + item.quantity * item.price, 0), [cart]);
useEffect(() => {
  document.body.style.overflow = mostrarModal ? 'hidden' : 'auto';
}, [mostrarModal]);

  return (
    <>
    <Header 
  cart={cart} 
  removeFromCart={removeFromCart}
  decreaseQuantity={decreaseQuantity}
  increaseQuantity={increaseQuantity}
  clearCart={clearCart}
  setMostrarModal={setMostrarModal}
/>

      <main>
        
      <section id="productos" className="align-items-center pt-10 lg:pt-20 pb-4 lg:pb-16 px-6">
  <div className="max-w-6xl mx-auto text-center mb-7 lg:mb-10">
    <h2 className="text-3xl md:text-4xl lg:text-6xl font-pacifico text-orange-950 mb-2 lg:mb-4">Nuestras Cookies</h2>
    <p className="text-lg font-poppins text-orange-950">Elegí tu favorita y llevate 5 por $4000</p>
  </div>

  <div className="grid grid-cols-2  md:grid-cols-3 lg:grid-cols-3  lg:gap-y-10 lg:gap-x-8 gap-2  sm:gap-y-3 md:m-1 sm:mx-4 justify-items-center lg:mx-12">
    {data.map((cookie) => (
      <Cookie
        key={cookie.id}
        cookie={cookie}
        setCart={setCart}
        addToCart={addToCart}
      />
    ))}
  </div>
</section>

{mostrarModal && (
  <div className="fixed inset-0 z-50 backdrop-blur-sm bg-yellow-950/35 flex items-center justify-center">
    <div className="bg-amber-100 rounded-xl p-6 w-11/12 max-w-md text-center shadow-lg relative">
      <h2 className="text-xl font-bold text-orange-950 mb-1 lg:mb-2">Total a pagar: ${cartTotal}</h2>
      <p className="text-orange-950 text-lg mb-4">
        mmm
      </p>
      <p className="text-orange-950 text-lg mb-4">
        alias: biteme.vcp
      </p>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setMostrarModal(false)}
        className="bg-[#fcb9c6] text-black px-4 py-2 rounded hover:bg-orange-800 transition"
      >
        Cerrar
      </motion.button>
    </div>
  </div>
)}

      </main>
   

      <AnimatePresence>
      
  {toast && (
    <motion.div
      key="toast"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-5 right-5 bg-[#4b2300] text-white px-4 py-2 rounded shadow-lg z-50"
    >
      {toast}
    </motion.div>
  )}
</AnimatePresence>
<footer className="w-full bg-[#51290e] mt-10 pt-6 lg:pt-10 px-4">
  <div className="text-center">
    <p className="text-white font-poppins text-lg">Nuestras redes sociales</p>

    <div className="pb-4 pt-2 flex items-center justify-center gap-6">
      <motion.a
        whileTap={{ scale: 0.95 }}
        href="https://www.instagram.com/biteme_vcp"
        target="_blank"
      >
        <img src="/img/ig.png" className="h-10 sm:h-12" alt="Instagram" />
      </motion.a>

      <motion.a
        whileTap={{ scale: 0.95 }}
        href="https://www.tiktok.com/@biteme.vcp"
        target="_blank"
      >
        <img src="/img/tt.png" className="h-10 sm:h-12" alt="TikTok" />
      </motion.a>
    </div>

    <p className="font-poppins text-sm sm:text-base text-white mt-2 pb-8">
      Iturrusgarai, Cisneros y Espósito
    </p>
  </div>
</footer>
    </>
  )
}

export default App
