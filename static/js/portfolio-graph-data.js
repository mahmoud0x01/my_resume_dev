/* ============================================================
   PORTFOLIO CONSTELLATION — Data Model (Software Developer Edition)
   All nodes (me, skills, experience, education, courses,
   certificates, awards, writing) and their connections.
   ============================================================ */

var PORTFOLIO_DATA = (function () {
    'use strict';

    // ---- Coarse category groups (prototype color system) ----
    // Kept identical to the design-system --cg-* tokens so category accents match.
    var GROUP_COLORS = {
        me:             { light: '#1a1a1a', dark: '#ffffff' }, // neutral ink/white for the hub
        development:    { light: '#3b82f6', dark: '#60a5fa' },
        infrastructure: { light: '#6b7280', dark: '#9ca3af' },
        experience:     { light: '#8b5cf6', dark: '#a78bfa' },
        recognition:    { light: '#f59e0b', dark: '#fbbf24' },
    };

    // Maps a fine-grained `cat` to a coarse group
    var GROUP_MAP = {
        frontend:     'development',
        backend:      'development',
        language:     'development',
        cloud:        'infrastructure',
        container:    'infrastructure',
        cicd:         'infrastructure',
        database:     'infrastructure',
        experience:   'experience',
        education:    'experience',
        certificate:  'recognition',
        award:        'recognition',
        blog:         'recognition',
        me:           'me',
    };

    // Per-cat palette (mirrors the design system)
    var CAT_COLORS = {
        me:          GROUP_COLORS.me,
        frontend:    { light: '#3b82f6', dark: '#60a5fa' },
        backend:     { light: '#6366f1', dark: '#818cf8' },
        language:    { light: '#10b981', dark: '#34d399' },
        cloud:       { light: '#14b8a6', dark: '#2dd4bf' },
        container:   { light: '#8b5cf6', dark: '#a78bfa' },
        cicd:        { light: '#f59e0b', dark: '#fbbf24' },
        database:    { light: '#0ea5e9', dark: '#38bdf8' },
        experience:  GROUP_COLORS.experience,
        education:   { light: '#db2777', dark: '#f472b6' },
        certificate: GROUP_COLORS.recognition,
        award:       GROUP_COLORS.recognition,
        blog:        { light: '#0ea5e9', dark: '#38bdf8' },
    };

    // ---- Skill -> subgroup mapping (hierarchy) ----
    var SKILL_PARENT = {
        // Frontend
        htmlcss: 'sg-frontend', javascript: 'sg-frontend', typescript: 'sg-frontend', react: 'sg-frontend',
        vue: 'sg-frontend', nextjs: 'sg-frontend', tailwind: 'sg-frontend',
        // Backend
        nodejs: 'sg-backend', python: 'sg-backend', django: 'sg-backend', fastapi: 'sg-backend',
        aspnet: 'sg-backend', restapi: 'sg-backend', graphql: 'sg-backend', websockets: 'sg-backend',
        // Languages
        go: 'sg-langs', csharp: 'sg-langs', sql: 'sg-langs', bash: 'sg-langs',
        // Cloud
        aws: 'sg-cloud', gcp: 'sg-cloud', nginx: 'sg-cloud', linux: 'sg-cloud',
        // Containers
        docker: 'sg-containers', kubernetes: 'sg-containers',
        // CI/CD
        cicd: 'sg-cicd', githubactions: 'sg-cicd', git: 'sg-cicd',
        // Databases
        postgresql: 'sg-databases', mongodb: 'sg-databases', redis: 'sg-databases', sqlalchemy: 'sg-databases',
    };

    // ---- Main category (tier-1) nodes ----
    var categories = [
        { id: 'cat-development', name: 'Development',        group: 'development',    cat: 'backend',  icon: 'fas fa-laptop-code', content: 'Frontend, backend and language work across the full web stack — from interfaces to APIs.' },
        { id: 'cat-devops',     name: 'DevOps & Cloud',     group: 'infrastructure', cat: 'cloud',    icon: 'fas fa-cloud',       content: 'Containers, orchestration, CI/CD and cloud infrastructure that ships and scales software.' },
        { id: 'cat-experience', name: 'Experience',         group: 'experience',     cat: 'experience',icon: 'fas fa-briefcase',   content: 'Professional roles, internships and academic background.' },
        { id: 'cat-recognition',name: 'Recognition',        group: 'recognition',    cat: 'award',     icon: 'fas fa-award',       content: 'Certifications, courses, competition results and published writing.' }
    ].map(function (c) { c.type = 'category'; c.parent = 'me'; return c; });

    // ---- Sub-group (tier-2) nodes ----
    var subgroups = [
        // Development
        { id: 'sg-frontend', name: 'Frontend',      group: 'development',    cat: 'frontend',     parent: 'cat-development', icon: 'fas fa-palette' },
        { id: 'sg-backend',  name: 'Backend',       group: 'development',    cat: 'backend',      parent: 'cat-development', icon: 'fas fa-server' },
        { id: 'sg-langs',    name: 'Languages',     group: 'development',    cat: 'language',     parent: 'cat-development', icon: 'fas fa-code' },
        // DevOps & Cloud
        { id: 'sg-cloud',      name: 'Cloud',           group: 'infrastructure', cat: 'cloud',      parent: 'cat-devops', icon: 'fas fa-cloud' },
        { id: 'sg-containers', name: 'Containers',      group: 'infrastructure', cat: 'container',  parent: 'cat-devops', icon: 'fab fa-docker' },
        { id: 'sg-cicd',       name: 'CI/CD',           group: 'infrastructure', cat: 'cicd',       parent: 'cat-devops', icon: 'fas fa-infinity' },
        { id: 'sg-databases',  name: 'Databases',       group: 'infrastructure', cat: 'database',   parent: 'cat-devops', icon: 'fas fa-database' },
        // Experience
        { id: 'sg-work', name: 'Work',     group: 'experience', cat: 'experience', parent: 'cat-experience', icon: 'fas fa-building' },
        { id: 'sg-edu',  name: 'Education', group: 'experience', cat: 'education',  parent: 'cat-experience', icon: 'fas fa-school' },
        // Recognition
        { id: 'sg-certs',  name: 'Certifications', group: 'recognition', cat: 'certificate', parent: 'cat-recognition', icon: 'fas fa-certificate' },
        { id: 'sg-awards', name: 'Awards',         group: 'recognition', cat: 'award',      parent: 'cat-recognition', icon: 'fas fa-trophy' },
        { id: 'sg-writing',name: 'Writing',        group: 'recognition', cat: 'blog',       parent: 'cat-recognition', icon: 'fas fa-pen-nib' }
    ].map(function (s) { s.type = 'subgroup'; return s; });

    // ============================================================
    //  NODES
    // ============================================================

    // ---- Central node ----
    var meNode = {
        id: 'me', type: 'me', name: 'Mahmoud Adel', cat: 'me',
        roles: ['Full Stack Developer', 'DevOps Engineer', 'Software Engineering Student'],
        subtitle: 'Full Stack Developer · DevOps Engineer · Software Engineering Student',
        terminalTitle: 'zsh — mahmoud@portfolio',
        image: '/images/me-avatar.png',
        icon: '',
        content: "Full Stack Developer & DevOps Engineer building end-to-end web applications and scalable infrastructure. I transform ideas into production-ready solutions using Python, Django, FastAPI, modern frontend, and DevOps practices. Recognized as a Top 5 / 100 finalist in Bastion's internal engineering competition, and pursuing a Bachelor's in Software Engineering at Tomsk State University.",
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

        // Cloud
        { id: 'aws',   name: 'AWS',          icon: 'fab fa-aws',          cat: 'cloud' },
        { id: 'gcp',   name: 'Google Cloud', icon: 'fab fa-google',       cat: 'cloud' },
        { id: 'nginx', name: 'Nginx',        icon: 'fas fa-network-wired',cat: 'cloud' },
        { id: 'linux', name: 'Linux',        icon: 'fab fa-linux',        cat: 'cloud' },

        // Containers
        { id: 'docker',     name: 'Docker',     icon: 'fab fa-docker',   cat: 'container' },
        { id: 'kubernetes', name: 'Kubernetes', icon: 'fas fa-cubes',    cat: 'container' },

        // CI/CD
        { id: 'cicd',          name: 'CI/CD',           icon: 'fas fa-infinity',  cat: 'cicd' },
        { id: 'githubactions', name: 'GitHub Actions',  icon: 'fab fa-github',   cat: 'cicd' },
        { id: 'git',           name: 'Git',             icon: 'fab fa-git-alt',  cat: 'cicd' },

        // Databases
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
        n.group = GROUP_MAP[n.cat] || 'development';
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
