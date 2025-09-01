import express from 'express';
import { addItemToCart, getCartDetails, getUserCart, removeItem, removeItemFromCart, saveCartDetails } from '../controllers/cartController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();

router.get(
    '/details',
    getCartDetails
);
router.get(
    '/:id',
    authenticate,
    authorize('customer'),
    getUserCart
);
router.post(
    '/',
    authenticate,
    authorize('customer'),
    saveCartDetails
);
router.post(
    '/items',
    authenticate,
    authorize('customer'),
    addItemToCart
);
router.put(
    '/items/decrease',
    authenticate,
    authorize('customer'),
    removeItemFromCart
);
router.delete(
    '/items',
    authenticate,
    authorize('customer'),
    removeItem
);

export default router;