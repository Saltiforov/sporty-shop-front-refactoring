const goods = [
  { cat: 'sport', name: 'protein', price: 25 },
  { cat: 'sport', name: 'creatine', price: 15 },
  { cat: 'vitamin', name: 'C', price: 10 },
];
// Результат: { sport: 40, vitamin: 10 }

const result = goods.reduce((acc, curr) => {
  if (!acc[curr.cat]) {
    acc[curr.cat] = curr.price;
  } else {
    acc[curr.cat] += curr.price;
  }

  return acc;
}, {});

console.log('result', result);

const nums = [1, 2, 3, 4];

const result1 = nums.reduce((acc, curr) => {
  acc += curr;
  return acc;
});

console.log('result1', result1);

const words = ['I', 'love', 'Vue'];
const result2 = words.reduce((acc, curr) => {
  acc += `${curr} `;
  return acc;
}, '');

console.log('result2', result2);

const nums1 = [1, 2, 3, 4, 5];
nums1.reduce((acc, curr) => {
  if (curr % 2 === 0) {
    acc.push(curr);
  }
  return acc;
}, []);
// [2, 4];

const users = [
  { id: 1, name: 'Anna' },
  { id: 2, name: 'Bob' },
];

const result3 = users.reduce((acc, curr) => {
  if (!acc[curr.id]) {
    acc[curr.id] = curr;
  }

  return acc;
}, {});

//RESult
// {
//   1: { id: 1, name: 'Anna' },
//   2: { id: 2, name: 'Bob' }
// }

const nums4 = [10, 25, 7, 99, 30];

const result4 = nums4.reduce((acc, curr) => {
  if (acc < curr) {
    acc = curr;
  }
  return acc;
}, 0);
console.log('result4', result4);
//RESULT  Результат: 99

const pairs = [
  ['name', 'John'],
  ['age', 30],
  ['city', 'Paris'],
];

const rs1 = pairs.reduce((acc, curr) => {
  if (!acc[curr[0]]) {
    acc[curr[0]] = curr[1];
  }
  return acc;
}, {});

console.log('rs1', rs1);

// 👉 Результат: { name: 'John', age: 30, city: 'Paris' }

const people = [
  { name: 'Alice', team: 'A' },
  { name: 'Bob', team: 'B' },
  { name: 'Eve', team: 'A' },
];

const rs2 = people.reduce((acc, curr) => {
  console.log('acc', acc);
  console.log('curr', curr);
  if (!acc[curr.team]) {
    acc[curr.team] = [curr.name];
  } else {
    acc[curr.team].push(curr.name);
  }

  return acc;
}, {});

// {
//   A: ['Alice', 'Eve'],
//   B: ['Bob']
// }

console.log('r2', rs2);

const sales = [
  { id: 1, product: 'Protein', category: 'Supplements', amount: 120 },
  { id: 2, product: 'Creatine', category: 'Supplements', amount: 90 },
  { id: 3, product: 'Gloves', category: 'Accessories', amount: 25 },
  { id: 4, product: 'Shaker', category: 'Accessories', amount: 15 },
  { id: 5, product: 'Vitamins', category: 'Supplements', amount: 110 },
];

const rs3 = sales.reduce((acc, curr) => {
  if (!acc[curr.category]) {
    acc[curr.category] = 0;
  }

  acc[curr.category] += curr.amount;

  return acc;
}, {});

// {
//   Supplements: 320, // 120 + 90 + 110
//     Accessories: 40   // 25 + 15
// }

console.log('rs3', rs3);

const items = [
  {
    id: 1,
    name: 'Protein',
    category: 'Supplements',
    brand: 'ON',
    price: 30,
    qty: 2,
    rating: 4.7,
  },
  {
    id: 2,
    name: 'Creatine',
    category: 'Supplements',
    brand: 'MP',
    price: 20,
    qty: 3,
    rating: 4.4,
  },
  {
    id: 3,
    name: 'Shaker',
    category: 'Accessories',
    brand: 'MP',
    price: 10,
    qty: 5,
    rating: 4.1,
  },
  {
    id: 4,
    name: 'Gloves',
    category: 'Accessories',
    brand: 'Generic',
    price: 15,
    qty: 1,
    rating: 3.9,
  },
  {
    id: 5,
    name: 'Vitamins',
    category: 'Supplements',
    brand: 'ON',
    price: 25,
    qty: 4,
    rating: 4.6,
  },
];

const rs4 = items.reduce((acc, curr, index, array) => {
  if (!acc[curr.category]) {
    acc[curr.category] = {
      count: 0,
      units: 0,
      revenue: 0,
      avgRating: 0,
      topBrand: '',
      generalRating: 0,
      generalQtv: 0,
      brandUsed: [],
    };
  }

  console.log('acc', acc);
  console.log('acc[curr.category].brandUsed', acc[curr.category].brandUsed);

  const getBrand = acc[curr.category].brandUsed.find(
    (el) => el.name === curr.brand,
  );

  if (!getBrand) {
    acc[curr.category].brandUsed.push({
      name: curr.brand,
      count: 0,
    });
  }



  const updatedBrand = acc[curr.category].brandUsed.find(
    (el) => el.name === curr.brand,
  );

  if (updatedBrand) {
    updatedBrand.count++;
  }

  console.log('acc[curr.category].brandUsed ===================', acc[curr.category].brandUsed);

  if (getBrand) {
    getBrand.count += 1;
  }
  // usedBrand && usedBrand.count += 1;

  console.log('acc[curr.category].brandUsed.reduce((acc, curr) => acc.count > curr.count)' );

  acc[curr.category].units += curr.qty;
  acc[curr.category].revenue += curr.price * curr.qty;
  acc[curr.category].topBrand = acc[curr.category].brandUsed.reduce((acc, curr) => {
    if (curr.count > acc.count) {
      acc = curr;
    }

    return acc;
  }).name;


  // const topBrand = array.find((el) => el.brand === acc[curr.category].topBrand);
  acc[curr.category].generalRating += curr.rating * curr.qty;
  acc[curr.category].generalQtv += curr.qty;
  acc[curr.category].avgRating = acc[curr.category].generalRating / acc[curr.category].generalQtv;

  return acc;
}, {});

console.log('rs4', rs4);

// RESULT {
//   Supplements: {
//     count: 3,
//       units: 9,
//       revenue: 220,
//       avgRating: 4.56,
//       topBrand: 'ON',
//   },
//   Accessories: {
//     count: 2,
//       units: 6,
//       revenue: 65,
//       avgRating: 4.07,
//       topBrand: 'MP',
//   },
// }

// •	count — число позиций,
// 	•	units — сумма qty,
// 	•	revenue — сумма price * qty,
// 	•	avgRating — средний rating (весить по qty, т.е. взвешенное среднее),
// •	topBrand — бренд с максимальным revenue внутри категории.
