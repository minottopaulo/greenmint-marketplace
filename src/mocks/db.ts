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

// Helper para gerar imagens SVG limpas com ícones/siglas centralizadas
const makeSvg = (initials: string, color = '#FF9000', bgColor = '%231E1916') =>
  `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="100%" height="100%" fill="${bgColor}"/><circle cx="300" cy="200" r="70" fill="%232A221E" stroke="${encodeURIComponent(color)}" stroke-width="4"/><text x="50%" y="52%" dominant-baseline="middle" text-anchor="middle" font-family="monospace" font-weight="bold" font-size="36" fill="${encodeURIComponent(color)}">${encodeURIComponent(initials)}</text></svg>`

const INITIAL_USERS: User[] = [
  {
    id: 'user-1',
    name: 'Satoshi Nakamoto',
    username: '@satoshi',
    email: 'satoshi@greenmint.io',
    avatar: makeSvg('SN', '#FF9000', '%232A1808'),
    walletAddress: '0x71C...39A2',
    balanceETH: '12.5000',
    favorites: ['nft-1'],
  },
  {
    id: 'user-2',
    name: 'Ada Lovelace',
    username: '@ada_nft',
    email: 'ada@greenmint.io',
    avatar: makeSvg('AL', '#8A2BE2', '%23140D0A'),
    walletAddress: '0x32B...99F1',
    balanceETH: '3.1200',
    favorites: [],
  },
]

const INITIAL_NFTS: NFT[] = [
  {
    id: 'nft-1',
    name: 'Bored Ape #4021',
    collection: 'Bored Ape YC',
    category: 'Arte digital',
    network: 'Ethereum',
    edition: '1/1',
    priceETH: '1.8500',
    imageUrl: makeSvg('BAYC', '#FF9000', '%231E1916'),
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
    imageUrl: makeSvg('CP', '#00F5D4', '%230A192F'),
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
    imageUrl: makeSvg('AS', '#E07D00', '%23251508'),
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

// Reseta o localStorage para carregar os novos SVGs limpos
db.reset()  