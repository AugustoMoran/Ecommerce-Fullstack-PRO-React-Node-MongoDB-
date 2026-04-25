import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import {
  addItem,
  removeItem,
  updateQuantity,
  toggleCart,
  setItems,
  selectCartItems,
  selectCartCount,
  selectCartTotal,
  selectCartIsOpen,
} from '../features/cart/cartSlice';
import { useAddToCartMutation } from '../services/cartApi';
import { selectCurrentUser } from '../features/auth/authSlice';

const useCart = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const items = useSelector(selectCartItems);
  const count = useSelector(selectCartCount);
  const total = useSelector(selectCartTotal);
  const isOpen = useSelector(selectCartIsOpen);
  const [addToCartApi] = useAddToCartMutation();

  const handleAddToCart = async (producto, cantidad = 1) => {
    if (user) {
      try {
        const result = await addToCartApi({ productoId: producto._id, cantidad }).unwrap();
        if (result?.items) dispatch(setItems(result.items));
        toast.success('Agregado al carrito');
      } catch (err) {
        toast.error(err?.data?.message || 'Error al agregar al carrito');
        return;
      }
    } else {
      dispatch(addItem({ producto, cantidad }));
      toast.success('Agregado al carrito');
    }
    dispatch(toggleCart());
  };

  const handleRemove = (productoId) => {
    dispatch(removeItem(productoId));
  };

  const handleUpdate = (productoId, cantidad) => {
    dispatch(updateQuantity({ productoId, cantidad }));
  };

  return {
    items,
    count,
    total,
    isOpen,
    addToCart: handleAddToCart,
    removeFromCart: handleRemove,
    updateQuantity: handleUpdate,
    toggleCart: () => dispatch(toggleCart()),
  };
};

export default useCart;
