import { missionSummaries, type MissionSummary } from './missionSummaries';

export interface MissionGalleryItem {
  image: string;
  caption: string;
}

interface MissionDetails {
  heroImage: string;
  tools: string[];
  details: {
    problem: string;
    strategy: string;
    process: string;
    solution: string;
    impact: string;
  };
  gallery: MissionGalleryItem[];
}

export interface MissionData extends MissionSummary, MissionDetails {}

const missionDetailsBySlug: Record<string, MissionDetails> = {
  'nexus-ai': {
    heroImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1920&auto=format&fit=crop',
    tools: ['Figma', 'React', 'D3.js', 'TensorFlow', 'Tailwind CSS'],
    details: {
      problem: 'Fortune 500 executives lacked a unified, real-time view of multi-departmental KPIs, leading to delayed decisions and siloed data interpretation across global teams.',
      strategy: 'Design an AI-augmented analytics layer that surfaces predictive insights alongside historical data, reducing cognitive load through progressive disclosure and smart defaults.',
      process: 'Conducted 24 stakeholder interviews across 6 departments, mapped decision-making journeys, built interactive prototypes tested with C-suite users over 3 sprint cycles.',
      solution: 'A modular analytics dashboard with AI-driven anomaly detection, natural language query interface, and executive briefing mode - all rendered in a tactical, dark-UI aesthetic.',
      impact: '45% increase in operational efficiency, 60% faster executive decision-making, and 3x reduction in report generation time across the organization.',
    },
    gallery: [
      { image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200', caption: 'Dashboard Overview - Real-time KPI synthesis' },
      { image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200', caption: 'AI Insight Panel - Predictive analytics layer' },
      { image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=1200', caption: 'Executive Briefing Mode - Simplified view' },
    ],
  },
  'vanguard-ops': {
    heroImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1920&auto=format&fit=crop',
    tools: ['Figma', 'React', 'WebSocket', 'Mapbox', 'Tailwind CSS'],
    details: {
      problem: 'Security teams operated on fragmented tooling with 8-12 second lag in threat detection visualization, putting critical assets at risk during active incidents.',
      strategy: 'Architect a real-time SOC interface with sub-second visual updates, threat prioritization engine, and one-click response protocols to minimize reaction time.',
      process: 'Embedded with security analysts for 2 weeks, mapped incident response workflows, designed real-time data streaming visualizations, and iterated through tabletop simulations.',
      solution: 'A tactical operations dashboard with live threat mapping, automated severity scoring, and rapid-response action panels - designed for high-stress, low-light environments.',
      impact: '0.2s threat visualization latency, 70% faster incident response time, and zero critical threats missed during the first quarter of deployment.',
    },
    gallery: [
      { image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200', caption: 'Threat Mapping - Live geospatial overview' },
      { image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200', caption: 'Incident Response Panel - One-click protocols' },
      { image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200', caption: 'Analytics Engine - Real-time metrics' },
    ],
  },
  cyberhealth: {
    heroImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1920&auto=format&fit=crop',
    tools: ['Figma', 'React', 'Python', 'TensorFlow', 'FHIR API'],
    details: {
      problem: 'Radiologists spent 45+ minutes per complex case reviewing scans manually, leading to backlogs, burnout, and delayed patient diagnoses in high-volume clinics.',
      strategy: 'Design an AI co-pilot interface that highlights areas of concern, provides confidence scores, and integrates seamlessly into existing PACS workflows without disrupting clinical routines.',
      process: 'Observed 30+ diagnostic sessions, designed AI overlay prototypes, validated with 12 radiologists across 3 hospitals, and refined the confidence visualization system.',
      solution: 'An intelligent diagnostic assistant with AI-powered scan analysis, heatmap overlays, structured reporting, and collaborative case review - all HIPAA compliant.',
      impact: '40% reduction in diagnostic analysis time, 99.9% system uptime, and significant improvement in early detection rates for critical conditions.',
    },
    gallery: [
      { image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=1200', caption: 'Diagnostic Interface - AI overlay system' },
      { image: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?q=80&w=1200', caption: 'Case Review - Collaborative annotation' },
      { image: 'https://images.unsplash.com/photo-1581093458791-9d42e3c7e117?q=80&w=1200', caption: 'Reporting Dashboard - Structured outputs' },
    ],
  },
  'aegis-system': {
    heroImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1920&auto=format&fit=crop',
    tools: ['Figma', 'React', 'D3.js', 'Node.js', 'PostgreSQL'],
    details: {
      problem: 'Financial analysts used a legacy rule-based system that missed 30% of sophisticated fraud patterns, resulting in $3.2M in annual losses and compliance risk.',
      strategy: 'Visualize neural network decision paths in an intuitive graph interface, enabling analysts to understand, trust, and refine AI-driven fraud detection models.',
      process: 'Partnered with data scientists to map neural network architectures, designed interactive graph visualizations, and tested with fraud analysts through progressive complexity reveals.',
      solution: 'A neural network visualization platform with interactive decision trees, real-time transaction monitoring, and explainable AI panels that demystify model reasoning.',
      impact: '$2M in annual savings from fraud prevention, 85% reduction in false positives, and full regulatory compliance across all monitored jurisdictions.',
    },
    gallery: [
      { image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1200', caption: 'Neural Network Graph - Decision path visualization' },
      { image: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?q=80&w=1200', caption: 'Transaction Monitor - Real-time fraud detection' },
      { image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200', caption: 'Compliance Dashboard - Regulatory reporting' },
    ],
  },
  'scale-master': {
    heroImage: 'https://images.unsplash.com/photo-1610913721979-b20ede600e63?q=80&w=1920&auto=format&fit=crop',
    tools: ['Figma', 'React', 'Tailwind CSS', 'Storybook', 'Analytics'],
    details: {
      problem: 'Complex omnichannel management led to user churn and low adoption rates. Users abandoned key workflows within the first 3 minutes.',
      strategy: 'Simplify the navigation hierarchy and unify the data visualization language across all channel management views.',
      process: 'Conducted user interviews, created journey maps, and iterated on high-fidelity prototypes with real users over 5 sprint cycles.',
      solution: 'A streamlined SaaS dashboard with intuitive workflow management, unified data visualization, and real-time analytics across all channels.',
      impact: '30% increase in user adoption, 45% reduction in support tickets, and 2x improvement in user task completion rates.',
    },
    gallery: [
      { image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200', caption: 'Dashboard Redesign - Unified channel view' },
      { image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200', caption: 'Workflow Builder - Simplified task flows' },
      { image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=1200', caption: 'Analytics Panel - Cross-channel metrics' },
    ],
  },
  'ai-healthcare-chatbot': {
    heroImage: 'https://images.unsplash.com/photo-1747224317356-6dd1a4a078fd?q=80&w=1920&auto=format&fit=crop',
    tools: ['Figma', 'Voiceflow', 'React Native', 'NLP Engine', 'FHIR'],
    details: {
      problem: 'Patients struggled to get quick answers to basic medical queries, overwhelming support staff and creating 45+ minute wait times for simple scheduling tasks.',
      strategy: 'Implement an NLP-driven chatbot with a compassionate, human-centric tone that handles triage, scheduling, and FAQ resolution without human intervention.',
      process: 'Mapped conversational flows, defined persona guidelines, created empathy-driven response templates, and tested with real patients across 3 clinical settings.',
      solution: 'An intelligent conversational agent that triages symptoms, schedules appointments, answers FAQs, and escalates complex cases - all with a warm, reassuring tone.',
      impact: '60% reduction in patient wait times, 80% of routine queries resolved without human intervention, and measurably improved patient satisfaction scores.',
    },
    gallery: [
      { image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1200', caption: 'Conversation Flow - Triage decision tree' },
      { image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=1200', caption: 'Patient Interface - Empathetic UI design' },
      { image: 'https://images.unsplash.com/photo-1581093458791-9d42e3c7e117?q=80&w=1200', caption: 'Admin Panel - Conversation analytics' },
    ],
  },
  'tamara-chatbot': {
    heroImage: 'https://images.unsplash.com/photo-1676272748285-2cee8e35db69?q=80&w=1920&auto=format&fit=crop',
    tools: ['Figma', 'React Native', 'Lottie', 'GPT-4 API', 'Firebase'],
    details: {
      problem: 'Low user retention in existing chatbot apps due to rigid, robotic interactions that felt impersonal and failed to adapt to conversation context.',
      strategy: 'Create a dynamic, adaptive UI that morphs based on conversation context - changing layouts, suggestion types, and interaction patterns in real-time.',
      process: 'Prototyped adaptive message bubbles and contextual action chips, conducted A/B tests across 500 users, and refined micro-interactions through 4 iteration cycles.',
      solution: 'A mobile-first chatbot with fluid animations, context-aware suggestion chips, adaptive layouts, and personality-driven responses that feel genuinely conversational.',
      impact: '40% improvement in user retention, 3x increase in daily active conversations, and significantly higher user satisfaction scores vs. baseline.',
    },
    gallery: [
      { image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1200', caption: 'Adaptive UI - Context-responsive layouts' },
      { image: 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?q=80&w=1200', caption: 'Conversation Flow - Dynamic suggestion chips' },
      { image: 'https://images.unsplash.com/photo-1559526324-593bc073d938?q=80&w=1200', caption: 'Micro-interactions - Fluid animation system' },
    ],
  },
  'enterprise-crm': {
    heroImage: 'https://images.unsplash.com/photo-1575388902449-6bca946ad549?q=80&w=1920&auto=format&fit=crop',
    tools: ['Figma', 'React', 'Material UI', 'GraphQL', 'Salesforce API'],
    details: {
      problem: 'Legacy CRM systems were slow, cluttered, and difficult to navigate on mobile. Sales teams lost 2+ hours daily to manual data entry and context switching.',
      strategy: 'Modularize the dashboard architecture to support custom widgets, drag-and-drop views, and progressive data loading for instant responsiveness.',
      process: 'Audited existing workflows with 18 sales reps, designed a responsive grid system, built a reusable component library, and validated through staged rollouts.',
      solution: 'A scalable, widget-based CRM dashboard with customizable views, real-time pipeline tracking, and seamless mobile experience - all built on a modular component system.',
      impact: '55% boost in sales team productivity, 70% reduction in data entry time, and successful adoption across 4 regional offices with zero training overhead.',
    },
    gallery: [
      { image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200', caption: 'Dashboard Grid - Modular widget system' },
      { image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200', caption: 'Pipeline View - Real-time sales tracking' },
      { image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=1200', caption: 'Mobile Experience - Responsive widget layout' },
    ],
  },
  'imagesbazaar-admin': {
    heroImage: 'https://images.unsplash.com/photo-1622645526171-32f4cec59deb?q=80&w=1920&auto=format&fit=crop',
    tools: ['Figma', 'Angular', 'Node.js', 'ElasticSearch', 'AWS S3'],
    details: {
      problem: 'Content managers faced bottlenecks due to a convoluted upload and tagging process. Bulk operations were unavailable, forcing one-by-one edits across 500K+ assets.',
      strategy: 'Optimize the content management workflow with bulk actions, AI-powered auto-tagging, and intelligent search that understands image context.',
      process: 'Shadowed admins for 40+ hours, identified 12 critical pain points, redesigned the upload flow with batch processing, and validated through phased rollout.',
      solution: 'A high-performance admin panel with bulk editing, AI auto-tagging, smart search, and real-time preview - handling 500K+ assets without performance degradation.',
      impact: '30% increase in administrator engagement, 5x faster content publishing, and 90% reduction in manual tagging effort through AI automation.',
    },
    gallery: [
      { image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=1200', caption: 'Bulk Editor - Multi-asset operations' },
      { image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200', caption: 'AI Tagging - Automated content classification' },
      { image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200', caption: 'Search Interface - Contextual asset discovery' },
    ],
  },
};

export const allMissions: MissionData[] = missionSummaries.map((summary) => {
  const details = missionDetailsBySlug[summary.slug];
  if (!details) {
    throw new Error(`Missing mission detail payload for slug: ${summary.slug}`);
  }

  return {
    ...summary,
    ...details,
  };
});

export const getMissionBySlug = (slug: string) => allMissions.find((mission) => mission.slug === slug);
