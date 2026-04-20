export const branches = [
  {
    id: "branch-1",
    name: "Dukkan 1",
    address: "Merkez Mah. Ataturk Cad. No: 18",
    hours: "09:00 - 19:00",
    managerLabel: "Admin: dukkan1admin",
  },
  {
    id: "branch-2",
    name: "Dukkan 2",
    address: "Carsi Mah. Cumhuriyet Sok. No: 7",
    hours: "09:00 - 19:00",
    managerLabel: "Admin: dukkan2admin",
  },
] as const;

export const categories = [
  "Deneme 1",
  "Deneme 2",
  "Baharat",
  "Bitki Cayi",
  "Kuruyemis",
] as const;

export const featuredProducts = [
  {
    id: "product-1",
    category: "Baharat",
    name: "Pul Biber",
    description:
      "Admin isterse gorsel ekler, istemezse sistem bu kart gorunumunu kullanir.",
    isAvailable: true,
    options: [
      { label: "Normal Paket", detail: "Gunluk kullanim icin", price: 50 },
      { label: "Buyuk Paket", detail: "Aile boyu secenek", price: 100 },
    ],
  },
  {
    id: "product-2",
    category: "Bitki Cayi",
    name: "Ihlamur",
    description:
      "Urun secenekleri gram yerine paket veya demet gibi farkli formatlarda tanimlanabilir.",
    isAvailable: true,
    options: [
      { label: "1 Demet", detail: "Klasik demet sunumu", price: 70 },
      { label: "Buyuk Paket", detail: "Yogun tuketim icin", price: 120 },
    ],
  },
  {
    id: "product-3",
    category: "Kuruyemis",
    name: "Cig Badem",
    description:
      "Ortak stok mantiginda urun var/yok seklinde panelden yonetilir.",
    isAvailable: false,
    options: [
      { label: "Standart Paket", detail: "Atistirmalik secenek", price: 90 },
      { label: "Buyuk Paket", detail: "Daha avantajli boy", price: 160 },
    ],
  },
] as const;

export const highlightedPolicies = [
  {
    eyebrow: "Uyelik",
    title: "Misafir siparis var, favoriler uye icin.",
    description:
      "Uyelik telefondan acilir. SMS dogrulama ilk surumde yoktur. Sifre iki kez istenir.",
  },
  {
    eyebrow: "Odeme",
    title: "Ilk surumde dukkanda odeme oncelikli.",
    description:
      "Sistem ticari olarak hemen kullanilmaya baslayabilir. Online odeme ikinci fazda eklenir.",
  },
  {
    eyebrow: "Takip",
    title: "Siparis no veya telefon ile sorgulama.",
    description:
      "Kullanici admin paneli beklemeden siparis durumunu kolayca gorebilir.",
  },
  {
    eyebrow: "Teslim",
    title: "Hazir oldugu en kisa sure mantigi.",
    description:
      "Musteri saat secmez. Dukkan ekibi siparisi hazirlayip panelden durumu gunceller.",
  },
] as const;

export const adminSummary = [
  { label: "Toplam urun", value: "128", detail: "Var / yok mantigi ile yonetilecek" },
  { label: "Aktif siparis", value: "14", detail: "Hazirlaniyor ve hazir durumlari" },
  { label: "Sube", value: "2", detail: "Iki admin hepsini gorur" },
  { label: "Odeme tipi", value: "2", detail: "Dukkanda odeme + online odeme" },
] as const;

export const recentOrders = [
  {
    orderNo: "DK-2026-000124",
    customer: "Ayse Yilmaz",
    branch: "Dukkan 1",
    paymentMethod: "Dukkanda odeme",
    status: "Hazirlaniyor",
    total: "150 TL",
  },
  {
    orderNo: "DK-2026-000125",
    customer: "Mehmet Kaya",
    branch: "Dukkan 2",
    paymentMethod: "Online odeme",
    status: "Hazir",
    total: "240 TL",
  },
  {
    orderNo: "DK-2026-000126",
    customer: "Zeynep Demir",
    branch: "Dukkan 1",
    paymentMethod: "Dukkanda odeme",
    status: "Teslim edildi",
    total: "95 TL",
  },
  {
    orderNo: "DK-2026-000127",
    customer: "Hasan Arslan",
    branch: "Dukkan 2",
    paymentMethod: "Dukkanda odeme",
    status: "Alindi",
    total: "80 TL",
  },
] as const;
