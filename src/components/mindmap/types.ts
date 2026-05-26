export type NodeId = 'home' | 'about' | 'skills' | 'projects' | 'contact' | 'timeline' | 'opensource'
export type Direction = 'up' | 'down' | 'left' | 'right'

export interface NodeDef {
  id: NodeId
  label: string
  subtitle: string
  pos: [number, number, number]
  color: string
  nav: Partial<Record<Direction, NodeId>>
}

export const NODES: Record<NodeId, NodeDef> = {
  home: {
    id: 'home',
    label: 'SHUBHANG',
    subtitle: 'Mobile Developer',
    pos: [0, 0, 0],
    color: '#00FF88',
    nav: { up: 'timeline', down: 'projects', left: 'about', right: 'skills' },
  },
  about: {
    id: 'about',
    label: 'About',
    subtitle: 'The Nerd Behind the Screen',
    pos: [-16, 0, -6],
    color: '#7C3AED',
    nav: { right: 'home', up: 'skills' },
  },
  skills: {
    id: 'skills',
    label: 'Skills',
    subtitle: 'Tech Arsenal',
    pos: [16, 5, -6],
    color: '#0EA5E9',
    nav: { left: 'home', down: 'projects', right: 'opensource' },
  },
  projects: {
    id: 'projects',
    label: 'Projects',
    subtitle: "What I've Shipped",
    pos: [7, -16, -10],
    color: '#FF6B35',
    nav: { up: 'home', left: 'contact', right: 'opensource' },
  },
  contact: {
    id: 'contact',
    label: 'Contact',
    subtitle: "Let's Build Together",
    pos: [-7, -16, -10],
    color: '#FEBC2E',
    nav: { right: 'projects', up: 'home' },
  },
  timeline: {
    id: 'timeline',
    label: 'Timeline',
    subtitle: 'My Journey',
    pos: [0, 16, -8],
    color: '#F472B6',
    nav: { down: 'home' },
  },
  opensource: {
    id: 'opensource',
    label: 'Open Source',
    subtitle: 'Giving Back to the Community',
    pos: [26, -5, -10],
    color: '#34D399',
    nav: { left: 'skills', down: 'projects' },
  },
}

export const EDGES: [NodeId, NodeId][] = [
  ['home', 'about'],
  ['home', 'skills'],
  ['home', 'projects'],
  ['home', 'timeline'],
  ['home', 'contact'],
  ['skills', 'projects'],
  ['projects', 'contact'],
  ['about', 'skills'],
  ['skills', 'opensource'],
  ['projects', 'opensource'],
]
