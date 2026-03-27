const CartManager = require('../cartManager');

describe('CartManager', () => {
  let cart;

  beforeEach(() => {
    cart = new CartManager();
  });

  describe('addItem()' , () => {
    
    describe('success', () => {
        it('should add 1 new item to the cart ', () => {
            const name = "RAM-DDR5-3200MHz-16GB";
            const price = 79.99;
            
            cart.addItem(name, price);
            
            expect(cart.items).toHaveLength(1);
            expect(cart.items[0]).toEqual({ name : "RAM-DDR5-3200MHz-16GB", price : 79.99, quantity: 1 });
            
        });
        
        it('Should add a new item to the cart with a specific quantity', () => {
            cart.addItem("Rambo-tome-1", 12.99, 3);
            
            expect(cart.items[0].quantity).toBe(3);
        });
        
        it('should increase the quantity if the produt is already in the cart', () => {
            cart.addItem("Aladin-et-les-40-voleurs", 22.67, 1);
            cart.addItem("Aladin-et-les-40-voleurs", 22.67, 3);
            
            expect(cart.items).toHaveLength(1);
            expect(cart.items[0].quantity).toBe(4);
        });
        
    });
    
        describe('error handling', () => {
            
            const invalidName = "Invalid item name";
            const invalidPrice = "Invalid price";
            const invalidQuantity = "Invalid quantity";
            
            it(`should throw an "${invalidName}" if the name is empty or not a string`, () => {
                expect(() => cart.addItem('', 12)).toThrow(invalidName);
                expect(() => cart.addItem(null, 10)).toThrow(invalidName);
                expect(() => cart.addItem(123, 10)).toThrow(invalidName); 
            });
            
            it(`should throw an "${invalidPrice}" if price is not a number, zero or negative`, () => {
                expect(() => cart.addItem('Jouet Moulin Roty', 'gratuit')).toThrow(invalidPrice);
                expect(() => cart.addItem('Jouet Moulin Roty', 0)).toThrow(invalidPrice);
                expect(() => cart.addItem('Jouet Moulin Roty', -5)).toThrow(invalidPrice);
            });
        
            it(`should throw an "${invalidQuantity}" if quantity is not an integer or <= 0`, () => {
                expect(() => cart.addItem('Patate chaude', 6767, 1.5)).toThrow(invalidQuantity);
                expect(() => cart.addItem('Patate chaude', 6767, 0)).toThrow(invalidQuantity);
                expect(() => cart.addItem('Patate chaude', 6767, -1)).toThrow(invalidQuantity);
            });            
        });
    });

  describe('removeItem()', () => {

    it('should remove an item by name', () => {
      cart.addItem('Cars Crocs', 1.5);
      cart.removeItem('Cars Crocs');
      expect(cart.items).toHaveLength(0);
    });

    it('should throw error if item does not exist', () => {
      expect(() => cart.removeItem('Cars Crocs')).toThrow("Item not found");
    });
  });

  describe('getTotal()', () => {

    it('should calculate total with an empty cart', () => {
        expect(cart.getTotal()).toBe(0);
    });
    
    it('should calculate total without discount', () => {
      cart.addItem('Minecraft', 1.5, 2);
      cart.addItem('AmongUs', 2.0, 1); 
      expect(cart.getTotal()).toBe(5.0);
    });

    it('should calculate total with discount applied', () => {
        cart.addItem('Call of duty Modern warfare', 20.0, 1);
        cart.applyDiscount('HALF');
        expect(cart.getTotal()).toBe(10.0);
    });

    it('should handle floating point rounding correctly', () => {
        cart.addItem('Autonauts', 10.123, 1);
        expect(cart.getTotal()).toBe(10.12);
    });
  });

  describe('applyDiscount()', () => {
    it('should set discount for 10%', () => {
        cart.applyDiscount('SAVE10');
        expect(cart.discount).toBe(10);
    });

    it('should set discount for 20%', () => {
        cart.applyDiscount('SAVE20');
        expect(cart.discount).toBe(20);
    });

    it('should set discount for Half', () => {
        cart.applyDiscount('HALF');
        expect(cart.discount).toBe(50);
    });

    it('should apply last discount code applied', () => {
        cart.applyDiscount('SAVE10');
        cart.applyDiscount('SAVE20');
        expect(cart.discount).toBe(20);
    });

    it('should throw error for invalid codes', () => {
        expect(() => cart.applyDiscount('FAKECODE')).toThrow("Invalid discount code");
    });
  });

  describe('validateCart()', () => {
    it('should return invalid if cart is empty', () => {
        const result = cart.validateCart();
        expect(result.valid).toBe(false);
        expect(result.reason).toBe("Cart is empty");
    });

    it('should return valid for a normal cart', () => {
        cart.addItem('Apple', 1.0);
        const result = cart.validateCart();
        expect(result.valid).toBe(true);
        expect(result.reason).toBeNull();
    });
  });

  describe('getItemCount()', () => {

    it('should return 0 for an empty cart', () => {
        expect(cart.getItemCount()).toBe(0);
    });

    it('should return the total sum of all item quantities', () => {
      cart.addItem('Apple', 1.0, 5);
      cart.addItem('Orange', 2.0, 3);
      expect(cart.getItemCount()).toBe(8);
    });
  });

  describe('clear()', () => {
    it('should clear discount even with no items ', () => {
        cart.applyDiscount('SAVE10');
        cart.clear();
        expect(cart.discount).toBe(0);
    });

    it('should clear items even with no discount', () => {
        cart.addItem('Apple', 1.0);
        cart.clear();
        expect(cart.items).toHaveLength(0);
    });

    it('should reset items and discount', () => {
      cart.addItem('Apple', 1.0);
      cart.applyDiscount('SAVE10');
      cart.clear();
      expect(cart.items).toHaveLength(0);
      expect(cart.discount).toBe(0);
    });
  });
});