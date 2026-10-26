

export interface User {
  id: string
  name: string
  username: string
  email: string
  avatar: string
  walletAddress: string
  balanceETH: string
  favorites: string[]
}

export interface NFT {
  id: string
  name: string
  collection: string
  category: 'Arte digital' | 'Fotografia' | 'Música' | 'Arte 3D' | 'Colecionáveis' | 'Generativa' | 'Jogos' | 'Assinaturas' | 'Utilidade'
  network: 'Ethereum' | 'Polygon' | 'Solana'
  edition: '1/1' | '1/10' | '1/50'
  priceETH: string
  imageUrl: string
  creator: string
  owner: string
  description: string
  available: boolean
}

export interface CartItem {
  nftId: string
  quantity: number
}

const INITIAL_USERS: User[] = [
  {
    id: 'user-1',
    name: 'Satoshi Nakamoto',
    username: '@satoshi',
    email: 'satoshi@greenmint.io',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
    walletAddress: '0x71C...39A2',
    balanceETH: '12.5000',
    favorites: ['nft-1'],
  },
  {
      id: 'user-2',
      name: 'Ada Lovelace',
      username: '@ada_nft',
      email: 'ada@greenmint.io',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      walletAddress: '0x32B...99F1',
      balanceETH: '3.1200',
      favorites: [],
    },
]

const makeSvg = (title: string, color = '#FF9000') =>
  `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="100%" height="100%" fill="%231E1916"/><circle cx="300" cy="170" r="80" fill="%232A221E"/><text x="50%" y="330" font-family="monospace" font-weight="bold" font-size="28" fill="${encodeURIComponent(color)}" text-anchor="middle">${encodeURIComponent(title)}</text></svg>`

const INITIAL_NFTS: NFT[] = [
  {
    id: 'nft-1',
    name: 'Bored Ape #4021',
    collection: 'Bored Ape YC',
    category: 'Arte digital',
    network: 'Ethereum',
    edition: '1/1',
    priceETH: '1.8500',
    imageUrl: 'https://placehold.co/600x400/1e1e1e/FF9000?text=Bored+Ape+%234021',
    creator: 'YugaLabs',
    owner: '0x71C...39A2',
    description: 'Um colecionável único da série Bored Ape Yacht Club.',
    available: true,
  },
  {
    id: 'nft-2',
    name: 'Cyber Punk #2077',
    collection: 'Cyber Series',
    category: 'Arte 3D',
    network: 'Polygon',
    edition: '1/10',
    priceETH: '0.4500',
    imageUrl: 'https://placehold.co/600x400/1e1e1e/FF9000?text=Cyber+Punk+%232077',
    creator: 'NeonArt',
    owner: '0x32B...99F1',
    description: 'Ilustração 3D em estilo cyberpunk com iluminação neon.',
    available: true,
  },
  {
    id: 'nft-3',
    name: 'Acoustic Soul #05',
    collection: 'SoundWaves',
    category: 'Música',
    network: 'Solana',
    edition: '1/50',
    priceETH: '0.1200',
    imageUrl: 'https://placehold.co/600x400/1e1e1e/FF9000?text=Acoustic+Soul+%2305',
    creator: 'AudioLab',
    owner: '0x71C...39A2',
    description: 'Faixa exclusiva em áudio de alta fidelidade ligada a este token.',
    available: true,
  },
]

const STORAGE_KEYS = {
  USERS: 'greenmint_db_users',
  NFTS: 'greenmint_db_nfts',
  CART: 'greenmint_db_cart',
  AUTH: 'greenmint_db_auth',
}

export const db = {
  getUsers(): User[] {
    const data = localStorage.getItem(STORAGE_KEYS.USERS)
    return data ? JSON.parse(data) : INITIAL_USERS
  },

  getNFTs(): NFT[] {
    const data = localStorage.getItem(STORAGE_KEYS.NFTS)
    return data ? JSON.parse(data) : INITIAL_NFTS
  },

  getCart(): CartItem[] {
    const data = localStorage.getItem(STORAGE_KEYS.CART)
    return data ? JSON.parse(data) : []
  },

  saveUsers(users: User[]) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
  },

  saveNFTs(nfts: NFT[]) {
    localStorage.setItem(STORAGE_KEYS.NFTS, JSON.stringify(nfts))
  },

  saveCart(cart: CartItem[]) {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart))
  },

  reset() {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS))
    localStorage.setItem(STORAGE_KEYS.NFTS, JSON.stringify(INITIAL_NFTS))
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify([]))
    localStorage.removeItem(STORAGE_KEYS.AUTH)
  },
}
db.reset()