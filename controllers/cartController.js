import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

export const getCartDetails = async (req, res)=>{
    try {
        console.log('this is cart details');
        const ids = req.query['ids[]'];
        console.log(ids)
        const cartDetails = await Product.find({
            _id:{
                $in: ids
            }
        })

        return res.status(200).json({
            cartDetails,
            message:'Cart details fetched successfully'
        })
    } catch (error) {
        console.error('Fetching Cart Info Error:', error);
        return res.status(500).json({ error: error });
    }
}

export const saveCartDetails = async (req, res)=>{
    try {
        const {userId, cart} = req.body;

        //check first if user has a cart
        const userExists = await Cart.findOne({
            userId: userId
        })

        if(!userExists){
            await Cart.create({
                userId: userId,
                items: cart
            })
        }else{
            //iterate productData
            cart.forEach(async (product) => {
                let itemExists = await Cart.findOneAndUpdate(
                    {
                        "items.productId": product.productId,
                        "items.variant": product.variant
                    },
                    {
                        $inc: { 
                            "items.$.quantity": product.quantity
                        }
                    } 
                )
                
                // if item is not added yet, add the item to the cart
                if(!itemExists){
                    await Cart.findOneAndUpdate(
                        { 
                            userId: userId 
                        },
                        { 
                            $push: { 
                                items : product 
                            } 
                        },
                    )
                }
            });
        }
        
        return res.status(200).json({
            message: 'Items saved to cart successfully'
        })
        
    } catch (error) {
        console.error('Failed saving cart', error);
        return res.status(500).json({ error: error });
    }
}

export const getUserCart = async (req, res)=>{
    try {
        const {id} = req.params;
        console.log('id: ',id)

        const cart = await Cart.findOne({userId: id})
        
        return res.status(200).json({
            cart,
            message: "Cart successfully fetched."
        })
    } catch (error) {
        console.error('Failed getting cart', error);
        return res.status(500).json({ error: error });
    }
}

export const addItemToCart = async (req, res)=>{
    try {
        console.log('add',req.body)
        const {id, productData} = req.body;

        // check first if user exists
        const userExists = await Cart.findOne({
            userId: id
        })
        console.log(userExists)

        // if user does not exist, create cart
        if(!userExists){
            await Cart.create({
                userId: id,
                items: productData
            })
        }else{
            // check first if user already added the item, if already added, increase quantity
            const itemExists = await Cart.findOneAndUpdate(
                {
                    "items.productId": productData.productId,
                    "items.variant": productData.variant
                },
                {
                    $inc: { 
                        "items.$.quantity": productData.quantity
                    }
                } // The $ is a positional operator — it refers to the first array element that matched the condition.
            )
            

            // if item is not added yet, add the item to the cart
            if(!itemExists){
                await Cart.findOneAndUpdate(
                    { 
                        userId: id 
                    },
                    { 
                        $push: { 
                            items : productData 
                        } 
                    },
                )
            }
        }
        
        return res.status(200).json({
            message: 'Item added to cart successfully'
        })
    } catch (error) {
        console.error('Failed adding item to cart', error);
        return res.status(500).json({ error: error });
    }
}

// for decreasing quantity
export const removeItemFromCart = async (req, res)=>{
    try {
        console.log('body',req.body)
        const {id, productData} = req.body;

        // check first if user exists
        const userExists = await Cart.findOne({
            userId: id
        })

        if(userExists){
            // decrease
            await Cart.findOneAndUpdate(
                {
                    "items.productId": productData.productId, 
                    "items.variant": productData.variant, 
                    "items.quantity":{
                        $gt:1
                    }
                },
                {
                    $inc: { 
                        "items.$.quantity": -1
                    }
                } 
            )

            // remove
            await Cart.findOneAndUpdate(
                {
                  "items.productId": productData.productId,
                  "items.variant": productData.variant,
                  "items.quantity": 1
                },
                {
                  $pull: {
                    items: {
                      productId: productData.productId,
                      variant: productData.variant,
                      quantity: 1
                    }
                  }
                }
            );
        }

        return res.status(200).json({
            message: 'Item removed to cart successfully'
        })
    } catch (error) {
        console.error('Failed removing item to cart', error);
        return res.status(500).json({ error: error });
    }
}

//remove item completely
export const removeItem = async (req, res)=>{
    try {
        console.log('body',req.body)
        const {id, productId} = req.body;

        // check first if user exists
        const userExists = await Cart.findOne({
            userId: id
        })

        if(userExists){
            // remove
            await Cart.findOneAndUpdate(
                {
                  "items.productId": productId,
                },
                {
                  $pull: {
                    items: {
                      productId: productId,
                    }
                  }
                }
            );
        }

        return res.status(200).json({
            message: 'Item removed to cart successfully'
        })
    } catch (error) {
        console.error('Failed removing item to cart', error);
        return res.status(500).json({ error: error });
    }
}