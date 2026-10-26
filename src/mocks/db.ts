// src/mocks/db.ts

export interface User {
  id: string
  name: string
  username: string
  email: string
  avatar: string
  walletAddress: string
  balanceETH: string // Sempre string decimal para preservar precisão
  favorites: string[] // IDs dos NFTs
}

export interface NFT {
  id: string
  name: string
  collection: string
  category: 'Arte digital' | 'Fotografia' | 'Música' | 'Arte 3D' | 'Colecionáveis' | 'Generativa' | 'Jogos' | 'Assinaturas' | 'Utilidade'
  network: 'Ethereum' | 'Polygon' | 'Solana'
  edition: '1/1' | '1/10' | '1/50'
  priceETH: string // ex: "2.45"
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

// 1. Fixtures Iniciais Exigidas no Teste
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

const INITIAL_NFTS: NFT[] = [
  {
    id: 'nft-1',
    name: 'Bored Ape #4021',
    collection: 'Bored Ape YC',
    category: 'Arte digital',
    network: 'Ethereum',
    edition: '1/1',
    priceETH: '1.8500',
    imageUrl: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=500',
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
    imageUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=500',
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
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500',
    creator: 'AudioLab',
    owner: '0x71C...39A2',
    description: 'Faixa exclusiva em áudio de alta fidelidade ligada a este token.',
    available: true,
  },
]

// 2. Chaves de Armazenamento
const STORAGE_KEYS = {
  USERS: 'greenmint_db_users',
  NFTS: 'greenmint_db_nfts',
  CART: 'greenmint_db_cart',
  AUTH: 'greenmint_db_auth',
}

// 3. Métodos de Leitura e Escrita Persistentes
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

// Inicializa o banco com os dados padrão se estiver vazio
if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
  db.reset()
}