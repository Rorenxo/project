import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    coupons: {
      'DISCOUNT20': { discount: 0.2, used: false },
      'DISCOUNT50': { discount: 0.5, used: false },
    },
    appliedCoupon: null,
  }),
  actions: {
    addItem(item) {
      const existingItem = this.items.find(i => i.id === item.id && i.storeId === item.storeId)
      if (existingItem) {
        existingItem.quantity = item.quantity
      } else {
        this.items.push({ ...item })
      }
    },
    removeItem(itemId, storeId) {
      this.items = this.items.filter(item => !(item.id === itemId && item.storeId === storeId))
    },
    clearCart() {
      this.items = [];
      this.removeCoupon();
    },
    applyCoupon(code) {
      const coupon = this.coupons[code];
      if (coupon && !coupon.used) {
        this.appliedCoupon = code;
        coupon.used = true;
        return true;
      }
      return false;
    },
    removeCoupon() {
      if (this.appliedCoupon) {
        this.coupons[this.appliedCoupon].used = false;
        this.appliedCoupon = null;
      }
    },
  },
  getters: {
    totalItems: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: (state) => state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    itemsByStore: (state) => {
      const itemsByStore = {}
      state.items.forEach(item => {
        if (!itemsByStore[item.storeId]) {
          itemsByStore[item.storeId] = []
        }
        itemsByStore[item.storeId].push(item)
      })
      return itemsByStore
    },
    discountedTotalPrice: (state) => {
      const total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      if (state.appliedCoupon) {
        const discount = state.coupons[state.appliedCoupon].discount;
        return total * (1 - discount);
      }
      return total;
    }
  }
})

