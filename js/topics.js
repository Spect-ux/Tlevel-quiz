/**
 * topics.js — Full T Level Digital Software Development spec
 * Pearson Specification Version 1.0 May 2025
 */

export const TOPICS = [

  // ── CORE PAPER 1 ──────────────────────────────────────────────────────────

  {
    id: 'comp_thinking',
    name: 'Computational Thinking',
    ref: '1.1',
    paper: 'Core Paper 1',
    desc: `Decomposition (breaking problems into manageable parts), pattern recognition (finding trends and similarities), abstraction (filtering unnecessary detail, identifying inputs/outputs/constants), algorithmic design. Benefits and drawbacks of each component. Interrelationships between components.`
  },
  {
    id: 'algo_design',
    name: 'Algorithmic Design',
    ref: '1.2',
    paper: 'Core Paper 1',
    desc: `Expressing algorithms in flowcharts (terminators, processes, sub-processes, decisions, I/O, arrows), written descriptions, and code. Sequence, selection, iteration. Determining purpose, output, errors in algorithms. Translating between notations. Designing algorithms.`
  },
  {
    id: 'strategies',
    name: 'Problem Solving Strategies',
    ref: '1.3',
    paper: 'Core Paper 1',
    desc: `Top-down, bottom-up, modularisation approaches — purpose, benefits, drawbacks. Root cause analysis: five whys, FMEA, ETA, logging/closing/escalating. High-level problem-solving strategy: define, gather, analyse, plan, implement, review.`
  },
  {
    id: 'data_types',
    name: 'Data Types & Variables',
    ref: '2.1–2.3',
    paper: 'Core Paper 1',
    desc: `Integer, float, string, Boolean — definitions, purpose, when used. Variables vs constants. Data type conversion functions. Scope: global vs local variables. Data structures: lists (indexing, slicing, methods), dictionaries (key-value pairs, methods), 2D lists.`
  },
  {
    id: 'operators',
    name: 'Operators & Expressions',
    ref: '2.4',
    paper: 'Core Paper 1',
    desc: `Arithmetic operators (+, -, *, /, //, %, **). Comparison operators (==, !=, <, >, <=, >=). Logical operators (and, or, not). Assignment operators (=, +=, -=, *=, /=). String concatenation and repetition. Operator precedence (BIDMAS/BODMAS).`
  },
  {
    id: 'io_actions',
    name: 'Input, Output & Actions',
    ref: '2.5–2.6',
    paper: 'Core Paper 1',
    desc: `Input/output functions (input(), print()). Formatting output (f-strings, format()). Sequence, selection (if/elif/else), iteration (for loops, while loops, nested loops, range()). Functions: defining, calling, parameters, arguments, return values, built-in functions.`
  },
  {
    id: 'validation',
    name: 'Validation & Robust Code',
    ref: '2.8 & 2.10',
    paper: 'Core Paper 1',
    desc: `Validation: presence check, type check, range check, length check, format check. Robust code: try/except (ValueError, TypeError, ZeroDivisionError, IndexError, KeyError), handling multiple exceptions, finally block. Defensive programming techniques.`
  },
  {
    id: 'algorithms',
    name: 'Common Algorithms',
    ref: '2.11',
    paper: 'Core Paper 1',
    desc: `Searching: linear search (purpose, process, efficiency O(n)), binary search (purpose, requires sorted data, process, efficiency O(log n)). Sorting: bubble sort (compare adjacent, swap, passes), merge sort (divide and conquer, merge sorted halves). When to use each.`
  },
  {
    id: 'testing_p1',
    name: 'Testing (Paper 1)',
    ref: '2.12',
    paper: 'Core Paper 1',
    desc: `Purpose of testing. Types of test data: valid (normal), invalid (erroneous/extreme), boundary. Black box vs white box testing. Unit testing, integration testing. Test tables: input, expected output, actual output. Debugging techniques.`
  },
  {
    id: 'emerging',
    name: 'Emerging Technologies & Impact',
    ref: '3.1–3.2',
    paper: 'Core Paper 1',
    desc: `Impact of digital technologies on society, economy, environment. Emerging tech: AI/ML, IoT, AR/VR, blockchain, quantum computing, robotics. Benefits and risks. Ethical implications. Environmental impact (e-waste, energy use, carbon footprint). Digital inclusion and accessibility.`
  },
  {
    id: 'legislation',
    name: 'Legislation & Regulatory Requirements',
    ref: '4.1',
    paper: 'Core Paper 1',
    desc: `Data Protection Act/GDPR (8 principles, rights of data subjects, ICO, 72-hour breach notification, fines up to £17.5m or 4% global turnover). Computer Misuse Act 1990 (3 offences: S1/S2/S3 and penalties). Health & Safety at Work Act / DSE regulations. Equality Act 2010 (9 protected characteristics, 4 discrimination types). Intellectual property (registered design, unregistered design, patent). International law and cyberspace. Impact on organisations/individuals/society.`
  },
  {
    id: 'codes_conduct',
    name: 'Codes of Conduct & Standards',
    ref: '4.2',
    paper: 'Core Paper 1',
    desc: `BCS Code of Conduct (public interest, competence, integrity, duty to employer/client). IAP and CIISec professional codes. Acceptable Use Policies (purpose, permitted/prohibited activities, sanctions). Industry standards: ISO, WCAG (Web Content Accessibility Guidelines), W3C, IETF, PCI SSC, IEEE.`
  },

  // ── CORE PAPER 2 ──────────────────────────────────────────────────────────

  {
    id: 'business',
    name: 'Business Context',
    ref: '5.1',
    paper: 'Core Paper 2',
    desc: `Business structures (sole trader, partnership, Ltd, PLC, charity). Stakeholders (internal/external). Organisational structures (hierarchical, flat, matrix). Business functions (HR, finance, marketing, IT). Agile vs waterfall project management. SDLC phases.`
  },
  {
    id: 'risk',
    name: 'Risk & Change Management',
    ref: '5.3–5.4',
    paper: 'Core Paper 2',
    desc: `Risks to organisations: data breaches, system failure, cyber attacks, reputational damage. Risk assessment (likelihood × impact). Risk mitigation strategies. Technical change management: change requests, version control (Git: commit, push, pull, branch, merge, clone), change logs, rollback.`
  },
  {
    id: 'data_knowledge',
    name: 'Data, Information & Knowledge',
    ref: '6.1–6.3',
    paper: 'Core Paper 2',
    desc: `Difference between data, information and knowledge. Data taxonomy: structured vs unstructured, primary vs secondary, quantitative vs qualitative. Methods of transforming data: aggregation, normalisation, data cleansing, validation, encryption, compression. Data quality characteristics (accuracy, completeness, consistency, timeliness).`
  },
  {
    id: 'data_formats',
    name: 'Data Formats & Structures',
    ref: '6.5–6.6',
    paper: 'Core Paper 2',
    desc: `Data formats: CSV, JSON, XML, plain text, binary. When and why each is used. Data structures: arrays, stacks (LIFO, push/pop), queues (FIFO, enqueue/dequeue), trees (nodes, root, leaf, parent, child, binary search trees), graphs (vertices, edges, directed/undirected, weighted). Hash tables.`
  },
  {
    id: 'databases',
    name: 'Data Systems & Databases',
    ref: '6.8 & 6.10',
    paper: 'Core Paper 2',
    desc: `Relational databases: tables, primary keys, foreign keys, relationships (one-to-one, one-to-many, many-to-many). SQL: SELECT, FROM, WHERE, ORDER BY, GROUP BY, JOIN (INNER, LEFT), INSERT, UPDATE, DELETE. Normalisation (1NF, 2NF, 3NF). Entity-relationship diagrams. NoSQL databases (purpose and use cases). Data models.`
  },
  {
    id: 'data_viz',
    name: 'Data Visualisation & Access',
    ref: '6.9 & 6.11',
    paper: 'Core Paper 2',
    desc: `Data visualisation types: bar charts, line graphs, pie charts, scatter plots, histograms — when to use each. Dashboards. Data access across platforms: APIs (REST, JSON responses, HTTP methods GET/POST/PUT/DELETE), web scraping, data streaming. Rate limiting and authentication in APIs.`
  },
  {
    id: 'hardware',
    name: 'Hardware & Digital Environments',
    ref: '7.1',
    paper: 'Core Paper 2',
    desc: `CPU (ALU, CU, registers, cache, cores, clock speed). Memory: RAM (volatile), ROM (non-volatile), cache levels, virtual memory. Storage: HDD vs SSD (speed, capacity, reliability, cost). Input/output devices. Embedded systems. Von Neumann architecture. Fetch-decode-execute cycle.`
  },
  {
    id: 'software_env',
    name: 'Software & Operating Systems',
    ref: '7.2',
    paper: 'Core Paper 2',
    desc: `Types of software: system software (OS, utilities, drivers), application software, open source vs proprietary. OS functions: process management, memory management, file management, device management, security. Types of OS: real-time, multi-user, multi-tasking, mobile. Software licensing.`
  },
  {
    id: 'networks',
    name: 'Networks',
    ref: '7.3',
    paper: 'Core Paper 2',
    desc: `Network types: LAN, WAN, MAN, PAN. Topologies: bus, star, ring, mesh. Network hardware: router, switch, hub, NIC, access point. Protocols: TCP/IP, HTTP/HTTPS, FTP, SMTP, DNS, DHCP. IP addressing (IPv4, IPv6, static vs dynamic). Subnetting basics. OSI model (7 layers). Packet switching.`
  },
  {
    id: 'cloud_virtual',
    name: 'Cloud & Virtual Environments',
    ref: '7.4–7.5',
    paper: 'Core Paper 2',
    desc: `Virtualisation: VMs, hypervisors (Type 1 and Type 2), containers (Docker), benefits. Cloud computing: IaaS, PaaS, SaaS — definitions and examples. Public, private, hybrid cloud. Benefits and risks of cloud (scalability, cost, availability vs security, vendor lock-in, latency). Edge computing.`
  },
  {
    id: 'security',
    name: 'Security',
    ref: '8.1 & 8.4',
    paper: 'Core Paper 2',
    desc: `Security threats: malware (virus, worm, trojan, ransomware, spyware), phishing, brute force, SQL injection, DDoS, man-in-the-middle, social engineering. Security measures: firewalls, encryption (symmetric/asymmetric, AES, RSA), hashing, digital certificates, two-factor authentication, penetration testing, backups. CIA triad (Confidentiality, Integrity, Availability). OWASP Top 10.`
  },

];

export default TOPICS;
