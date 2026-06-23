// All user-facing admin strings — Uzbek (Latin), warm respectful "siz" tone,
// ≤2 emoji (root CLAUDE.md iron rule 3). Strings live ONLY here, never inlined
// in components. Enum→label maps keep display text in one place; the enum keys
// stay in English (the contract).

import type { ItemFallback, ItemStatus, OrderStatus, Unit } from '../api/types';

export const text = {
  app: {
    title: 'Tezbozor',
    subtitle: 'Boshqaruv paneli',
    role: 'Administrator', // generic until RBAC (WS2) puts a real role on the identity
    menu: 'Menyu',
    themeTooltip: 'Mavzu — yorug‘ / qorong‘i',
  },
  nav: {
    dailyPrices: 'Kunlik narxlar',
    orders: 'Buyurtmalar',
    route: 'Yetkazish marshruti',
    shoppingList: "Bozorlik ro'yxati",
    products: 'Mahsulotlar',
    categories: 'Kategoriyalar',
    slots: 'Yetkazish oraliqlari',
    customers: 'Mijozlar',
    wishes: "So'rovlar",
    administration: 'Boshqaruv',
    admins: 'Adminlar',
    roles: 'Rollar',
  },
  auth: {
    usernameLabel: 'Foydalanuvchi nomi',
    usernameRequired: 'Foydalanuvchi nomini kiriting',
    passwordLabel: 'Parol',
    passwordRequired: 'Parolni kiriting',
    submit: 'Kirish',
    failedTitle: 'Kirib bo‘lmadi',
    failedMessage: 'Foydalanuvchi nomi yoki parol noto‘g‘ri',
  },
  common: {
    save: 'Saqlash',
    saved: 'Saqlandi',
    cancel: 'Bekor qilish',
    create: 'Qo‘shish',
    edit: 'Tahrirlash',
    delete: 'O‘chirish',
    deleteConfirm: 'Rostdan o‘chirilsinmi?',
    yes: 'Ha',
    no: 'Yo‘q',
    back: 'Orqaga',
    refresh: 'Yangilash',
    loading: 'Yuklanmoqda…',
    error: 'Xatolik yuz berdi',
    empty: 'Hozircha bo‘sh',
    date: 'Sana',
    actions: 'Amallar',
    none: '—',
  },
  prices: {
    title: 'Kunlik narxlar',
    hint: 'Bugungi bozor narxlarini kiriting. Tab yoki Enter bilan keyingi katakka o‘ting.',
    productCol: 'Mahsulot',
    priceCol: 'Narx (so‘m)',
    unfilled: 'narx kiritilmagan',
    saveAll: 'Hammasini saqlash',
    savedToast: 'Narxlar saqlandi',
    filledCount: (filled: number, total: number) => `${filled} / ${total} ta narx kiritilgan`,
    placeholder: 'narx',
  },
  orders: {
    title: 'Buyurtmalar',
    detailTitle: (id: number) => `Buyurtma #${id}`,
    filterDate: 'Yetkazish sanasi',
    filterStatus: 'Holat',
    filterSlot: 'Oraliq',
    allStatuses: 'Barchasi',
    customer: 'Mijoz',
    phone: 'Telefon',
    address: 'Manzil',
    slot: 'Oraliq',
    placedAt: 'Buyurtma vaqti',
    itemsCount: 'Mahsulotlar',
    asPlacedTotal: 'Buyurtmadagi summa',
    adjustedTotal: 'Yangilangan summa',
    cashToCollect: 'Yig‘iladigan naqd',
    refundDelta: 'Qaytariladigan farq',
    overageWarning: 'Diqqat: yangilangan summa kelishilgan summadan oshib ketdi — farqni mijozdan undirilmaydi.',
    note: 'Mijoz izohi',
    timeline: 'Holatlar tarixi',
    noEvents: 'Holat hali o‘zgartirilmagan',
    items: 'Mahsulotlar',
    itemName: 'Nomi',
    qty: 'Miqdor',
    snapshotPrice: 'Narx (1 birlik)',
    lineTotal: 'Summa',
    adjustedPrice: 'Yangi narx (1 birlik)',
    itemStatus: 'Holati',
    fallback: 'Almashtirish',
    itemNote: 'Izoh',
    effectiveTotal: 'Hisoblangan summa',
    statusUpdated: 'Holat yangilandi',
    itemUpdated: 'Mahsulot yangilandi',
  },
  route: {
    title: 'Yetkazish marshruti',
    hint: 'Bugungi yetkaziladigan buyurtmalar. Tartibni ⬆️⬇️ tugmalari bilan o‘zgartiring.',
    noOrders: 'Bu oraliqda buyurtma yo‘q',
    call: 'Qo‘ng‘iroq',
    deliver: 'Yetkazildi ✓',
    moveUp: 'Yuqoriga',
    moveDown: 'Pastga',
    cashLine: 'Naqd',
    delivered: 'Yetkazilgan',
    dayCashTotal: 'Kunlik naqd jami',
    note: 'Izoh',
    ordersInSlot: (n: number) => `${n} ta buyurtma`,
  },
  products: {
    title: 'Mahsulotlar',
    name: 'Nomi',
    category: 'Kategoriya',
    unit: 'Birlik',
    active: 'Faol',
    badge: 'Belgi',
    productOfDay: 'Kun mahsuloti',
    image: 'Rasm',
    uploadImage: 'Rasm yuklash',
    sortOrder: 'Tartib',
    noBadge: 'Belgisiz',
  },
  categories: {
    title: 'Kategoriyalar',
    slug: 'Slug (lotincha)',
    name: 'Nomi',
    sortOrder: 'Tartib',
  },
  slots: {
    title: 'Yetkazish oraliqlari',
    date: 'Sana',
    label: 'Oraliq',
    capacity: 'Sig‘imi',
    taken: 'Band',
    isOpen: 'Ochiq',
  },
  admins: {
    title: 'Adminlar',
    username: 'Login',
    password: 'Parol',
    newPassword: 'Yangi parol',
    role: 'Rol',
    status: 'Holat',
    active: 'Faol',
    inactive: 'Faol emas',
    createdAt: 'Qo‘shilgan',
    add: 'Admin qo‘shish',
    resetPassword: 'Parolni tiklash',
    resetPasswordCta: 'Parolni yangilash',
    resetPasswordOk: 'Parol yangilandi',
    you: 'Siz',
  },
  roles: {
    title: 'Rollar',
    name: 'Nomi',
    description: 'Tavsif',
    permissions: 'Ruxsatlar',
    permissionCount: (n: number) => `${n} ta ruxsat`,
    system: 'Tizim roli',
    add: 'Rol qo‘shish',
    superadminLocked: 'Superadmin roli o‘zgartirilmaydi.',
    systemDeleteHint: 'Tizim rollarini o‘chirib bo‘lmaydi.',
  },
  customers: {
    title: 'Mijozlar',
    name: 'Ism',
    phone: 'Telefon',
    ordersCount: 'Buyurtmalar',
    lastOrder: 'Oxirgi buyurtma',
    joined: 'Ro‘yxatdan o‘tgan',
    search: 'Ism yoki telefon bo‘yicha qidirish',
  },
  wishes: {
    title: "So'rovlar",
    text: "So'rov matni",
    customer: 'Mijoz',
    createdAt: 'Sana',
    hint: 'Mijozlar qidirib topa olmagan mahsulotlar — talab tahlili.',
  },
  shoppingList: {
    title: "Bozorlik ro'yxati",
    hint: 'Tanlangan kun uchun jami xaridlar. Olganingizdan keyin belgilang.',
    empty: 'Bu kun uchun buyurtma yo‘q.',
    total: 'jami',
    orders: (n: number) => `${n} ta buyurtma`,
    markBought: 'Olindi ✓',
    bought: 'Olingan',
    needsDecision: 'Tanlov kerak',
    openOrder: 'Buyurtmani ochish',
    dayCash: 'Kunlik naqd',
    print: 'Chop etish',
  },
} as const;

// ── Enum → Uzbek label maps ──────────────────────────────────────────────────

export const orderStatusLabel: Record<OrderStatus, string> = {
  accepted: 'Qabul qilindi',
  shopping: 'Bozorda xarid',
  on_the_way: 'Yo‘lda',
  delivered: 'Yetkazildi',
  cancelled: 'Bekor qilindi',
};

// The action button to MOVE an order INTO a status (next-state buttons).
export const orderTransitionLabel: Record<OrderStatus, string> = {
  accepted: 'Qabul qilindi',
  shopping: 'Xaridni boshlash',
  on_the_way: 'Yo‘lga chiqdi',
  delivered: 'Yetkazildi ✓',
  cancelled: 'Bekor qilish',
};

export const orderStatusColor: Record<OrderStatus, string> = {
  accepted: 'blue',
  shopping: 'gold',
  on_the_way: 'cyan',
  delivered: 'green',
  cancelled: 'red',
};

export const itemStatusLabel: Record<ItemStatus, string> = {
  pending: 'Kutilmoqda',
  bought: 'Olindi',
  substituted: 'Almashtirildi',
  skipped: 'Olinmadi',
};

export const itemFallbackLabel: Record<ItemFallback, string> = {
  substitute: 'Almashtirish',
  skip: 'Kerak emas',
  call: 'Qo‘ng‘iroq qiling',
};

export const unitLabel: Record<Unit, string> = {
  kg: 'kg',
  dona: 'dona',
};

export const productBadgeLabel: Record<string, string> = {
  yangi_keldi: 'Yangi keldi 🌿',
  narxi_barqaror: 'Narxi barqaror 🔒',
};

export const paymentMethodLabel: Record<string, string> = {
  cash: 'Naqd',
  click: 'Click',
  payme: 'Payme',
};

export const paymentStatusLabel: Record<string, string> = {
  pending: 'To‘lanmagan',
  paid: 'To‘langan',
  refunded: 'Qaytarildi',
  failed: 'Xato',
};

// Permission-code domain (prefix before the dot) → Uzbek group header for the
// role editor. Individual permission codes show their backend description.
export const permissionGroupLabel: Record<string, string> = {
  orders: 'Buyurtmalar',
  shopping_list: "Bozorlik ro'yxati",
  route: 'Marshrut',
  products: 'Mahsulotlar',
  categories: 'Kategoriyalar',
  prices: 'Narxlar',
  slots: 'Oraliqlar',
  customers: 'Mijozlar',
  wishes: "So'rovlar",
  dashboards: 'Dashboardlar',
  admins: 'Adminlar',
  roles: 'Rollar',
};
