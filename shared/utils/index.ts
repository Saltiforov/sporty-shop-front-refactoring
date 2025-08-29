export const calculateTotal = (items, currency = 'uah', useDiscount = true) => {
  if (!Array.isArray(items)) return 0;

  return items.reduce((total, item) => {
    const discountPrice = useDiscount && item.priceAfterDiscount && typeof item.priceAfterDiscount[currency] === 'number'
      ? item.priceAfterDiscount[currency]
      : null;

    const regularPrice = item.price && typeof item.price[currency] === 'number' ? item.price[currency] : 0;

    const priceToUse = discountPrice !== null ? discountPrice : regularPrice;

    return total + priceToUse * (item.quantity || 1);
  }, 0);
};


export function fullImageUrls(imagesRef, size = 'thumb') {
  return imagesRef.map(image => {
    const url = image.variants?.[size];

    if (!url) return null

    return /^https?:\/\//.test(url) ? url : "http://localhost:3000" + url;
  }).filter(Boolean);
}

export function formatDateToDMY(isoDate) {
  const date = new Date(isoDate)

  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  return `${day}.${month}.${year}`
}

const getOrderUserInfo = (order) => {
  const shipping = order.shippingAddress || {}
  const email =  order.user.email || '----'
  const description =  order.description || '----'
  const { telegramUsername, ...rest } = order.customerInfo || {};

  return {
    ...rest,
    email,
    address: formatAddress(shipping),
    description
  };
};



export function mapOrdersToSummaries(orders) {
  return orders.map(order => {

    const products = (order.products || []).map(item => {
      const product = item.product || {}

      return {
        images: product.images || [],
        name: product.name || '',
        quantity: item.quantity || 0,
        price: product.price || {},
        id: product._id || '',
        discount: product.discount || product.price || {},
        priceAfterDiscount: product.priceAfterDiscount || {},
        slug: product.slug || '',
      }
    })

    return {
      id: order._id || '',
      orderNumber: order.orderNumber || '',
      status: order.orderStatus || '',
      firstName: order.user.firstName || '',
      lastName: order.user.lastName || '',
      phone: order.user.phone || '',
      userInfo: getOrderUserInfo(order),
      pricing: order.pricing || '',
      currency: order.currency || '',
      createdAt: order.createdAt || '',
      products
    }
  })
}

function formatAddress(address) {
  const parts = [address?.street, address?.city, address?.country].filter(Boolean);
  return parts.join(', ');
}

export function capitalizeFirstLetter(str) {
  if (!str) return str;
  return str.charAt(0)?.toUpperCase() + str.slice(1);
}

export const formatRating = (rating) => {
  const num = Number(rating ?? 0);
  return Number.isInteger(num) ? String(num) : num.toFixed(1);
};

export const toInteger = (number) => {
  return Math.floor(number);
}

export function isEqual(a, b) {
  if (a === b) return true;

  if (a == null || b == null) return a === b;

  const typeA = typeof a;
  const typeB = typeof b;

  if (typeA !== typeB) return false;

  if (typeA !== 'object') {
    return a === b;
  }

  if (a instanceof Date) return b instanceof Date && a.getTime() === b.getTime();
  if (a instanceof RegExp) return b instanceof RegExp && a.source === b.source && a.flags === b.flags;

  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) return false;
    return a.every((item, index) => isEqual(item, b[index]));
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  const visited = new WeakMap();

  function checkCircular(objA, objB) {
    if (visited.has(objA)) return visited.get(objA) === objB;
    visited.set(objA, objB);

    for (const key of keysA) {
      if (!keysB.includes(key) || !isEqual(a[key], b[key])) return false;
    }

    return true;
  }

  return checkCircular(a, b);
}


export function matchPathPrefix(path, prefix) {
  return new RegExp(`^\/[a-z]{2}${prefix}`).test(path)
}
