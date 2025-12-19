
import React from 'react';
import {
  Cpu,
  Monitor,
  Sparkles,
  Globe,
  Gamepad2,
  Zap,
  Clock,
  Layers,
  Calculator,
  Box,
  FileText
} from 'lucide-react';

export const PROJECTS = [
  {
    id: 'typesim',
    name: 'TypeSim',
    desc: 'ai-powered python tool simulating human typing patterns to bypass typing detectors.',
    stack: ['Python', 'AI/ML', 'Automation'],
    link: 'https://typesim.pcstyle.dev',
    github: 'https://github.com/pc-style/typesim',
    status: 'active',
    icon: <Cpu className="w-5 h-5" />
  },
  {
    id: 'messenger',
    name: 'Messenger Unleashed',
    desc: 'supercharged messenger client with read receipt blocking, 17+ themes, and power-user tools.',
    stack: ['Electron', 'React', 'TypeScript'],
    link: 'https://unleashed.pcstyle.dev',
    github: 'https://github.com/pcstyleorg/messenger-desktop',
    status: 'active',
    icon: <Monitor className="w-5 h-5" />
  },
  {
    id: 'pixelforge',
    name: 'PixelForge (PixLab)',
    desc: 'ai-powered image editing studio: point-and-edit, style transfer, and object removal.',
    stack: ['PyTorch', 'React', 'FastAPI'],
    link: 'https://pixlab.pcstyle.dev',
    status: 'maintenance',
    icon: <Sparkles className="w-5 h-5" />
  },
  {
    id: 'cosmic',
    name: 'Cosmic Cinema',
    desc: 'procedural documentaries generated in real time using pure math and glsl shaders.',
    stack: ['Three.js', 'GLSL', 'Procedural'],
    link: 'https://cosmos.pcstyle.dev',
    status: 'experimental',
    icon: <Globe className="w-5 h-5" />
  },
  {
    id: 'sen',
    name: 'Sen – The Card Game',
    desc: 'real-time multiplayer card game focused on high-end ui polish and state sync.',
    stack: ['Socket.io', 'Node.js', 'Canvas'],
    link: 'https://dreamcats.pcstyle.dev',
    status: 'active',
    icon: <Gamepad2 className="w-5 h-5" />
  },
  {
    id: 'aimdrift',
    name: 'AimDrift (Driftfield)',
    desc: 'precision aim trainer focusing on rhythm, flow, and evolving generative visuals.',
    stack: ['WebGL', 'Vanilla JS'],
    link: null,
    github: null,
    status: 'disabled',
    icon: <Zap className="w-5 h-5" />
  },
  {
    id: 'clocks',
    name: 'Clock Gallery',
    desc: 'interactive gallery of animated clocks using mycelium and particle physics models.',
    stack: ['p5.js', 'Generative Art'],
    link: 'https://clock.pcstyle.dev',
    status: 'experimental',
    icon: <Clock className="w-5 h-5" />
  },
  {
    id: 'math',
    name: 'Math Canvas',
    desc: 'interactive workspace for solving and visualizing complex mathematical exercises.',
    stack: ['KaTeX', 'React-Canvas'],
    link: 'https://math.pcstyle.dev',
    status: 'prototype',
    icon: <Layers className="w-5 h-5" />
  },
  {
    id: 'policalc',
    name: 'PoliCalc (Kalkulator PCz)',
    desc: 'specialized grade calculators for politechnika częstochowska students.',
    stack: ['React', 'PWA'],
    link: 'https://kalkulator.pcstyle.dev',
    status: 'active',
    icon: <Calculator className="w-5 h-5" />
  },
  {
    id: 'brosos',
    name: 'BrosOS',
    desc: 'browser-based experimental operating system ui and window management.',
    stack: ['Custom Kernel', 'UI Kit'],
    link: 'https://os.pcstyle.dev',
    status: 'experimental',
    icon: <Box className="w-5 h-5" />
  },
  {
    id: 'paste',
    name: 'Paste',
    desc: 'fast pastebin with raw output. visit a url and get raw data instantly.',
    stack: ['Next.js', 'Convex', 'TypeScript'],
    link: 'https://paste.pcstyle.dev',
    status: 'active',
    icon: <FileText className="w-5 h-5" />
  }
];

export const BOOT_MESSAGES = [
  "establishing secure connection to pcstyle.dev...",
  "checking ssl certificate integrity...",
  "authenticating developer: adam_krupa@tuta.io",
  "bypassing typing detectors (typesim v2.4)... [ok]",
  "mounting procedural cosmos... [ok]",
  "loading pixel_forge_modules...",
  "DRIFT_FIELDS_DEACTIVATED [ERR_DISABLED]",
  "initializing neural cursor interface...",
  "kernel: 6.12.0-pcstyle-optimized",
  "system ready. welcome home."
];
