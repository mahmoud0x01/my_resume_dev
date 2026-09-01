/* ============================================================
   PORTFOLIO CONSTELLATION — Data Model (Engineering Evidence Map)
   BUILD → AUTOMATE → OPERATE → SECURE
   All nodes (me, skills, experience, education, courses,
   certificates, awards, writing) and their connections.
   ============================================================ */

var PORTFOLIO_DATA = (function () {
    'use strict';

    // ---- Coarse category groups (evidence map) ----
    // Design-system aligned: BUILD blue, AUTOMATE amber, OPERATE gray, SECURE green
    var GROUP_COLORS = {
        me:       { light: '#1a1a1a', dark: '#ffffff' },
        build:    { light: '#3b82f6', dark: '#60a5fa' },
        automate: { light: '#f59e0b', dark: '#fbbf24' },
        operate:  { light: '#6b7280', dark: '#9ca3af' },
        secure:   { light: '#10b981', dark: '#34d399' },
    };

    // Maps a fine-grained `cat` to a coarse group
    var GROUP_MAP = {
        frontend:     'build',
        backend:      'build',
        language:     'build',
        database:     'build',
        container:    'automate',
        cicd:         'automate',
        cloud:        'operate',
        experience:   'operate',
        education:    'operate',
        certificate:  'secure',
        award:        'secure',
        blog:         'secure',
        course:       'secure',
        me:           'me',
    };

    // Per-cat palette (mirrors the design system, grouped by evidence map)
    var CAT_COLORS = {
        me:          GROUP_COLORS.me,
        frontend:    GROUP_COLORS.build,
        backend:     { light: '#6366f1', dark: '#818cf8' },
        language:    { light: '#0ea5e9', dark: '#38bdf8' },
        database:    { light: '#14b8a6', dark: '#2dd4bf' },
        container:   GROUP_COLORS.automate,
        cicd:        { light: '#f97316', dark: '#fb923c' },
        cloud:       GROUP_COLORS.operate,
        experience:  GROUP_COLORS.operate,
        education:   { light: '#64748b', dark: '#94a3b8' },
        certificate: GROUP_COLORS.secure,
        award:       { light: '#8b5cf6', dark: '#a78bfa' },
        blog:        GROUP_COLORS.secure,
        course:      GROUP_COLORS.secure,
    };

    // ---- Skill -> subgroup mapping (hierarchy) ----
    var SKILL_PARENT = {
        // Frontend (BUILD)
        htmlcss: 'sg-frontend', javascript: 'sg-frontend', typescript: 'sg-frontend', react: 'sg-frontend',
        vue: 'sg-frontend', nextjs: 'sg-frontend', tailwind: 'sg-frontend',
        // Backend (BUILD)
        nodejs: 'sg-backend', python: 'sg-backend', django: 'sg-backend', fastapi: 'sg-backend',
        aspnet: 'sg-backend', restapi: 'sg-backend', graphql: 'sg-backend', websockets: 'sg-backend',
        // Languages (BUILD)
        go: 'sg-langs', csharp: 'sg-langs', sql: 'sg-langs', bash: 'sg-langs',
        // Cloud / Infra (OPERATE)
        aws: 'sg-cloud', gcp: 'sg-cloud', nginx: 'sg-cloud', linux: 'sg-cloud',
        // Containers (AUTOMATE)
        docker: 'sg-containers', kubernetes: 'sg-containers',
        // CI/CD (AUTOMATE)
        cicd: 'sg-cicd', githubactions: 'sg-cicd', git: 'sg-cicd',
        // Databases (BUILD)
        postgresql: 'sg-databases', mongodb: 'sg-databases', redis: 'sg-databases', sqlalchemy: 'sg-databases',
    };

    // ---- Main category (tier-1) nodes — Evidence Map ----
    var categories = [
        { id: 'cat-build',    name: 'BUILD',    group: 'build',    cat: 'backend',     icon: 'fas fa-code',          content: 'Code, APIs and data — Python, Django, FastAPI, REST, WebSockets, PostgreSQL, JavaScript, C#/.NET.' },
        { id: 'cat-automate', name: 'AUTOMATE', group: 'automate', cat: 'cicd',        icon: 'fas fa-infinity',      content: 'Shipping and repeatability — Git, GitHub Actions, CI/CD pipelines and Docker.' },
        { id: 'cat-operate',  name: 'OPERATE',  group: 'operate',  cat: 'cloud',       icon: 'fas fa-server',        content: 'Running systems — Linux, Nginx, networking and self-hosted services.' },
        { id: 'cat-secure',   name: 'SECURE',   group: 'secure',   cat: 'certificate', icon: 'fas fa-shield-halved', content: 'Understanding how systems fail — application security, testing, hardening and secure development.' }
    ].map(function (c) { c.type = 'category'; c.parent = 'me'; return c; });

    // ---- Sub-group (tier-2) nodes ----
    var subgroups = [
        // BUILD
        { id: 'sg-frontend',  name: 'Frontend',       group: 'build',    cat: 'frontend',  parent: 'cat-build',    icon: 'fas fa-palette' },
        { id: 'sg-backend',   name: 'Backend',        group: 'build',    cat: 'backend',   parent: 'cat-build',    icon: 'fas fa-server' },
        { id: 'sg-langs',     name: 'Languages',      group: 'build',    cat: 'language',  parent: 'cat-build',    icon: 'fas fa-code' },
        { id: 'sg-databases', name: 'Databases',      group: 'build',    cat: 'database',  parent: 'cat-build',    icon: 'fas fa-database' },
        // AUTOMATE
        { id: 'sg-containers', name: 'Containers',    group: 'automate', cat: 'container', parent: 'cat-automate', icon: 'fab fa-docker' },
        { id: 'sg-cicd',       name: 'CI/CD',         group: 'automate', cat: 'cicd',      parent: 'cat-automate', icon: 'fas fa-infinity' },
        // OPERATE
        { id: 'sg-cloud',      name: 'Cloud',         group: 'operate',  cat: 'cloud',     parent: 'cat-operate',  icon: 'fas fa-cloud' },
        { id: 'sg-work',       name: 'Work',          group: 'operate',  cat: 'experience',parent: 'cat-operate',  icon: 'fas fa-building' },
        { id: 'sg-edu',        name: 'Education',     group: 'operate',  cat: 'education', parent: 'cat-operate',  icon: 'fas fa-school' },
        // SECURE
        { id: 'sg-certs',   name: 'Certifications', group: 'secure', cat: 'certificate', parent: 'cat-secure', icon: 'fas fa-certificate' },
        { id: 'sg-awards',  name: 'Awards',         group: 'secure', cat: 'award',       parent: 'cat-secure', icon: 'fas fa-trophy' },
        { id: 'sg-writing', name: 'Writing',        group: 'secure', cat: 'blog',        parent: 'cat-secure', icon: 'fas fa-pen-nib' }
    ].map(function (s) { s.type = 'subgroup'; return s; });

    // ============================================================
    //  NODES
    // ============================================================

    // ---- Central node ----
    var meNode = {
        id: 'me', type: 'me', name: 'Mahmoud Adel', cat: 'me',
        roles: ['Security-minded Software Engineer','DevOps \u00b7 Infrastructure \u00b7 Application Security','Software Engineering Student'],
        subtitle: 'Security-minded Software Engineer \u00b7 DevOps \u00b7 Infrastructure \u00b7 Application Security \u00b7 Software Engineering Student',
        terminalTitle: 'zsh \u2014 mahmoud@portfolio',
        image: '/images/me-avatar.png',
        icon: '',
        content: "Security-minded Software Engineer with an evidence map of BUILD \u2192 AUTOMATE \u2192 OPERATE \u2192 SECURE \u2014 from building services with Python, Django, FastAPI and modern frontend, through automating delivery with Git, GitHub Actions, Docker and CI/CD, to operating Linux, Nginx and self-hosted systems, and understanding how those systems fail. Background spans software engineering, Linux infrastructure and hands-on application security. Recognized as Top 5 / 100 in Bastion\u2019s internal engineering competition and pursuing a BSc in Software Engineering at Tomsk State University. Every node here links to shipped work or documented practice.",
        links: {
            github: 'https://github.com/mahmoud0x01',
            linkedin: 'https://www.linkedin.com/in/mahmoudadelOx01/',
            email: 'mailto:contact@mahmoudouf.com',
        },
    };

    // ---- Skills ----
    var skills = [
        // Frontend
        { id: 'htmlcss',    name: 'HTML/CSS',     icon: 'fab fa-html5',       cat: 'frontend' },
        { id: 'javascript', name: 'JavaScript',   icon: 'fab fa-js',          cat: 'frontend' },
        { id: 'typescript', name: 'TypeScript',   icon: 'fas fa-code',        cat: 'frontend' },
        { id: 'react',      name: 'React',        icon: 'fab fa-react',       cat: 'frontend' },
        { id: 'vue',        name: 'Vue.js',       icon: 'fab fa-vuejs',      cat: 'frontend' },
        { id: 'nextjs',     name: 'Next.js',      icon: 'fas fa-cube',        cat: 'frontend' },
        { id: 'tailwind',   name: 'Tailwind CSS', icon: 'fas fa-wind',        cat: 'frontend' },

        // Backend
        { id: 'nodejs',     name: 'Node.js',          icon: 'fab fa-node-js',  cat: 'backend' },
        { id: 'python',     name: 'Python',           icon: 'fab fa-python',   cat: 'backend' },
        { id: 'django',     name: 'Django',           icon: 'fas fa-leaf',     cat: 'backend' },
        { id: 'fastapi',    name: 'FastAPI',          icon: 'fas fa-bolt',     cat: 'backend' },
        { id: 'aspnet',     name: 'ASP.NET Core',     icon: 'fas fa-server',   cat: 'backend' },
        { id: 'restapi',    name: 'REST API',         icon: 'fas fa-plug',     cat: 'backend' },
        { id: 'graphql',    name: 'GraphQL',          icon: 'fas fa-project-diagram', cat: 'backend' },
        { id: 'websockets', name: 'WebSockets',       icon: 'fas fa-satellite-dish', cat: 'backend' },

        // Languages
        { id: 'go',     name: 'Go',     icon: 'fab fa-golang',    cat: 'language' },
        { id: 'csharp', name: 'C#',     icon: 'fab fa-microsoft', cat: 'language' },
        { id: 'sql',    name: 'SQL',    icon: 'fas fa-table',     cat: 'language' },
        { id: 'bash',   name: 'Bash',   icon: 'fas fa-terminal',  cat: 'language' },

        // Cloud / Operate
        { id: 'aws',   name: 'AWS',          icon: 'fab fa-aws',          cat: 'cloud' },
        { id: 'gcp',   name: 'Google Cloud', icon: 'fab fa-google',       cat: 'cloud' },
        { id: 'nginx', name: 'Nginx',        icon: 'fas fa-network-wired',cat: 'cloud' },
        { id: 'linux', name: 'Linux',        icon: 'fab fa-linux',        cat: 'cloud' },

        // Containers (Automate)
        { id: 'docker',     name: 'Docker',     icon: 'fab fa-docker',   cat: 'container' },
        { id: 'kubernetes', name: 'Kubernetes', icon: 'fas fa-cubes',    cat: 'container' },

        // CI/CD (Automate)
        { id: 'cicd',          name: 'CI/CD',           icon: 'fas fa-infinity',  cat: 'cicd' },
        { id: 'githubactions', name: 'GitHub Actions',  icon: 'fab fa-github',   cat: 'cicd' },
        { id: 'git',           name: 'Git',             icon: 'fab fa-git-alt',  cat: 'cicd' },

        // Databases (Build)
        { id: 'postgresql', name: 'PostgreSQL', icon: 'fas fa-database',     cat: 'database' },
        { id: 'mongodb',    name: 'MongoDB',    icon: 'fas fa-database',     cat: 'database' },
        { id: 'redis',      name: 'Redis',      icon: 'fas fa-memory',       cat: 'database' },
        { id: 'sqlalchemy', name: 'SQLAlchemy', icon: 'fas fa-cogs',         cat: 'database' },
    ].map(function (s) { s.type = 'skill'; s.parent = SKILL_PARENT[s.id]; return s; });

    // ---- Awards ----
    var awards = [
        {
            id: 'award-ctf', type: 'award', cat: 'award',
            name: 'CTF Top 5 / 100', icon: 'fas fa-flag-checkered',
            subtitle: 'Bastion Cybersec Solutions',
            date: 'August 2024',
            content: 'Ranked Top 5 among 100 participants in the Bastion internal engineering competition, demonstrating strong problem-solving and technical skills.',
            relatedSkills: ['python', 'linux'],
        },
    ];

    // ---- Experience ----
    var experience = [
        {
            id: 'exp-tsu', type: 'experience', cat: 'experience',
            name: 'Software Engineer Intern', icon: 'fas fa-code-branch',
            subtitle: 'Tomsk State University',
            date: 'Feb 2025',
            companyUrl: 'https://www.tsu.ru',
            content: 'Software engineering work on university research projects spanning implementation, architecture, and documentation. Created UML, component, and activity diagrams and participated in the full software development lifecycle.',
            relatedSkills: ['python', 'django'],
        },
        {
            id: 'exp-bastion', type: 'experience', cat: 'experience',
            name: 'Application Security Intern', icon: 'fas fa-user-secret',
            subtitle: 'Bastion Cybersec Solutions',
            date: 'May 2024 - Sep 2024',
            companyUrl: '',
            content: 'Conducted authorized web application and API security assessments, performed code reviews, and collaborated with development teams to implement secure coding practices. Ranked Top 5 among 100 participants in Bastion\'s internal CTF.',
            relatedSkills: ['python', 'linux', 'restapi'],
        },
    ];

    // ---- Education ----
    var education = [
        {
            id: 'edu-bse', type: 'education', cat: 'education',
            name: "Bachelor's in Software Engineering", icon: 'fas fa-graduation-cap',
            subtitle: 'Tomsk State University',
            date: 'Sep 2022 - Jul 2026',
            schoolUrl: 'https://www.tsu.ru',
            content: "Bachelor of Software Engineering at Tomsk State University.",
        },
    ];

    // ---- Courses ----
    var courses = [
        { id: 'crs-dockerk8s', name: 'Docker & Kubernetes: The Complete Guide', icon: 'fab fa-docker',        provider: 'Udemy',            date: '2024', relatedSkills: ['docker', 'kubernetes'] },
        { id: 'crs-pydevops',  name: 'Python for DevOps',                       icon: 'fas fa-code',          provider: 'LinkedIn Learning',date: '2024', relatedSkills: ['python', 'cicd'] },
        { id: 'crs-devops101', name: 'DevOps 101',                              icon: 'fas fa-infinity',      provider: 'Udemy',            date: '2024', relatedSkills: ['docker', 'cicd'] },
        { id: 'crs-pg',        name: 'PostgreSQL: Advanced Queries',            icon: 'fas fa-table',         provider: 'Coursera',         date: '2024', relatedSkills: ['postgresql', 'sql'] },
        { id: 'crs-linuxadm',  name: 'Linux Administration & Shell Scripting',  icon: 'fab fa-linux',         provider: 'Udemy',            date: '2024', relatedSkills: ['linux', 'bash'] },
        { id: 'crs-restdjango',name: 'REST APIs with Django & Python',          icon: 'fas fa-plug',          provider: 'Udemy',            date: '2023', relatedSkills: ['django', 'restapi'] },
        { id: 'crs-git',       name: 'Git & GitHub Complete Masterclass',       icon: 'fab fa-git-alt',       provider: 'Udemy',            date: '2023', relatedSkills: ['git', 'githubactions'] },
        { id: 'crs-ccna',      name: 'CCNA',                                    icon: 'fas fa-route',          provider: 'Cisco',             date: '2020', relatedSkills: ['nginx', 'linux'] },
    ].map(function (c) { c.type = 'course'; c.cat = 'course'; c.parent = 'sg-certs'; return c; });

    // ---- Certificates ----
    var certificates = [
        { id: 'cert-ibmdevops', name: 'Introduction to DevOps',     icon: 'fas fa-ribbon', provider: 'IBM',     date: '2023', content: 'IBM certificate covering fundamental DevOps principles and practices.', relatedSkills: ['cicd', 'docker'] },
        { id: 'cert-gcp',       name: 'Google Cloud Fundamentals',  icon: 'fas fa-scroll', provider: 'Google',  date: '2023', content: 'Google Cloud certificate covering core infrastructure concepts and services.', relatedSkills: ['gcp', 'aws'] },
    ].map(function (c) { c.type = 'certificate'; c.cat = 'certificate'; c.parent = 'sg-certs'; return c; });

    // ---- Featured writing ----
    var blogs = [
        { id: 'blog-dockercompose', name: 'Using Docker Compose for Local Development', icon: 'fas fa-cube',   url: '/blogs/docker-compose-development/' },
        { id: 'blog-ghactions',     name: 'CI/CD with GitHub Actions',                   icon: 'fas fa-infinity',url: '/blogs/github-actions-python-cicd/' },
        { id: 'blog-linuxsec',      name: 'Linux Server Security',                       icon: 'fas fa-shield-halved', url: '/blogs/linux-server-security-basics/' },
    ].map(function (b) { b.type = 'blog'; b.cat = 'blog'; b.parent = 'sg-writing'; return b; });

    var blogMore = {
        id: 'blog-more', type: 'blog-more', cat: 'blog',
        name: '+more', icon: 'fas fa-ellipsis',
        url: '/blogs/',
    };
    blogMore.parent = 'sg-writing';

    // ============================================================
    //  EDGES (hierarchical tree: me -> category -> subgroup -> leaf)
    // ============================================================
    var edges = [];

    awards.forEach(function (a) { a.parent = 'sg-awards'; });
    experience.forEach(function (e) { e.parent = 'sg-work'; });
    education.forEach(function (e) { e.parent = 'sg-edu'; });

    categories.forEach(function (c) {
        edges.push({ from: 'me', to: c.id, type: 'me-cat' });
    });

    subgroups.forEach(function (s) {
        edges.push({ from: s.parent, to: s.id, type: 'cat-sub' });
    });

    [].concat(skills, awards, experience, education, courses, certificates, blogs, [blogMore]).forEach(function (n) {
        if (n.parent) edges.push({ from: n.parent, to: n.id, type: 'sub-leaf' });
    });

    // ============================================================
    //  RELATIONSHIP EDGES (shine on hover; excluded from physics)
    // ============================================================
    var relSkillEdges = [
        ['htmlcss', 'javascript'], ['htmlcss', 'tailwind'], ['javascript', 'typescript'],
        ['javascript', 'react'], ['javascript', 'vue'], ['javascript', 'nodejs'],
        ['typescript', 'react'], ['react', 'nextjs'], ['vue', 'tailwind'],
        ['nextjs', 'tailwind'], ['react', 'tailwind'],
        ['nodejs', 'restapi'], ['nodejs', 'python'], ['python', 'django'], ['python', 'fastapi'],
        ['django', 'restapi'], ['fastapi', 'restapi'], ['fastapi', 'graphql'],
        ['restapi', 'graphql'], ['django', 'websockets'], ['fastapi', 'websockets'],
        ['aspnet', 'restapi'], ['aspnet', 'csharp'], ['csharp', 'sql'], ['python', 'sql'],
        ['sql', 'postgresql'], ['sql', 'mongodb'], ['postgresql', 'sqlalchemy'],
        ['python', 'sqlalchemy'], ['sqlalchemy', 'mongodb'],
        ['python', 'bash'], ['bash', 'linux'], ['linux', 'nginx'], ['linux', 'docker'],
        ['docker', 'kubernetes'], ['kubernetes', 'linux'], ['aws', 'linux'], ['gcp', 'linux'],
        ['cicd', 'githubactions'], ['githubactions', 'git'], ['git', 'githubactions'],
        ['cicd', 'docker'], ['docker', 'nginx'], ['postgresql', 'redis'], ['mongodb', 'redis'],
        ['gcp', 'aws']
    ];
    relSkillEdges.forEach(function (e) { edges.push({ from: e[0], to: e[1], type: 'rel' }); });

    var blogRels = {
        'blog-dockercompose': ['docker', 'nginx', 'linux'],
        'blog-ghactions': ['githubactions', 'cicd', 'python', 'docker'],
        'blog-linuxsec': ['linux', 'nginx', 'bash']
    };
    Object.keys(blogRels).forEach(function (bid) {
        blogRels[bid].forEach(function (sid) {
            edges.push({ from: bid, to: sid, type: 'rel' });
        });
    });

    awards.forEach(function (aw) { (aw.relatedSkills || []).forEach(function (s) { edges.push({ from: aw.id, to: s, type: 'rel' }); }); });
    experience.forEach(function (ex) { (ex.relatedSkills || []).forEach(function (s) { edges.push({ from: ex.id, to: s, type: 'rel' }); }); });
    courses.forEach(function (c) { (c.relatedSkills || []).forEach(function (s) { edges.push({ from: c.id, to: s, type: 'rel' }); }); });
    certificates.forEach(function (c) { (c.relatedSkills || []).forEach(function (s) { edges.push({ from: c.id, to: s, type: 'rel' }); }); });

    var allNodes = [meNode].concat(categories, subgroups, skills, awards, experience, education, courses, certificates, blogs, [blogMore]);

    allNodes.forEach(function (n) {
        n.group = GROUP_MAP[n.cat] || 'build';
        if (n.type === 'category' || n.type === 'subgroup') {
            n.cluster = n.id;
        } else {
            n.cluster = n.parent || 'me';
        }
    });

    return {
        nodes: allNodes,
        edges: edges,
        CAT_COLORS: CAT_COLORS,
        GROUP_COLORS: GROUP_COLORS,
        GROUP_MAP: GROUP_MAP,
    };

})();
