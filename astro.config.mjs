<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ITC Consultance LLC - AI-Powered Credit Repair & Financial Education | itc24.org</title>
    <style>
        /* General Styles */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }

        /* Header */
        header {
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            color: white;
            padding: 1rem 0;
            position: fixed;
            width: 100%;
            top: 0;
            z-index: 1000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .logo {
            font-size: 1.5rem;
            font-weight: bold;
        }

        .nav-links {
            display: flex;
            list-style: none;
            gap: 1.5rem;
        }

        .nav-links a {
            color: white;
            text-decoration: none;
            transition: color 0.3s ease;
            font-weight: 500;
        }

        .nav-links a:hover {
            color: #ffd700;
        }

        .nav-tools {
            display: flex;
            gap: 1rem;
            align-items: center;
        }

        .tool-icon {
            background: rgba(255,255,255,0.1);
            padding: 8px;
            border-radius: 50%;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .tool-icon:hover {
            background: rgba(255,255,255,0.2);
            transform: scale(1.1);
        }

        .cta-nav {
            background: #e74c3c;
            padding: 8px 16px;
            border-radius: 20px;
            text-decoration: none;
            color: white;
            font-weight: bold;
            transition: all 0.3s ease;
        }

        .cta-nav:hover {
            background: #c0392b;
            transform: translateY(-1px);
        }

        .mobile-menu-toggle {
            display: none;
            cursor: pointer;
            font-size: 1.5rem;
            color: white;
        }

        /* Hero with Integrated Tools */
        .hero {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 120px 0 60px;
            text-align: center;
            position: relative;
        }

        .hero::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="circuit" width="100" height="100" patternUnits="userSpaceOnUse"><path d="M10,10 L90,10 L90,90 L10,90 Z" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/><circle cx="25" cy="25" r="3" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="3" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23circuit)"/></svg>');
            opacity: 0.3;
        }

        .hero-content {
            position: relative;
            z-index: 2;
        }

        .hero h1 {
            font-size: 2.8rem;
            margin-bottom: 1rem;
            font-weight: 700;
        }

        .hero p {
            font-size: 1.2rem;
            margin-bottom: 2rem;
            opacity: 0.9;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
        }

        .hero-buttons {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
            margin-bottom: 3rem;
        }

        .btn-primary {
            background: linear-gradient(45deg, #e74c3c, #c0392b);
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 50px;
            font-weight: bold;
            transition: all 0.3s ease;
            display: inline-block;
        }

        .btn-secondary {
            background: rgba(255,255,255,0.2);
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 50px;
            font-weight: bold;
            border: 2px solid rgba(255,255,255,0.3);
            transition: all 0.3s ease;
        }

        .btn-primary:hover, .btn-secondary:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 20px rgba(0,0,0,0.3);
        }

        /* Integrated Tools Dashboard */
        .tools-dashboard {
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            padding: 2rem;
            margin-top: 2rem;
            position: relative;
            z-index: 2;
        }

        .tools-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
        }

        .tool-card {
            background: rgba(255,255,255,0.1);
            padding: 1.5rem;
            border-radius: 10px;
            text-align: center;
            transition: all 0.3s ease;
            cursor: pointer;
        }

        .tool-card:hover {
            background: rgba(255,255,255,0.2);
            transform: translateY(-5px);
        }

        .tool-card .icon {
            font-size: 2rem;
            margin-bottom: 1rem;
        }

        .tool-card h4 {
            font-size: 1.1rem;
            margin-bottom: 0.5rem;
        }

        .tool-card p {
            font-size: 0.9rem;
            opacity: 0.8;
        }

        /* Stats Section */
        .stats {
            background: #2c3e50;
            color: white;
            padding: 60px 0;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 2rem;
            text-align: center;
        }

        .stat-item {
            padding: 1rem;
        }

        .stat-item h3 {
            font-size: 2.5rem;
            color: #e74c3c;
            margin-bottom: 0.5rem;
        }

        .stat-item p {
            font-size: 1rem;
            opacity: 0.9;
        }

        /* Services Section */
        .services {
            padding: 80px 0;
            background: #f8f9fa;
        }

        .section-title {
            text-align: center;
            font-size: 2.2rem;
            margin-bottom: 3rem;
            color: #2c3e50;
        }

        .services-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
        }

        .service-card {
            background: white;
            padding: 2rem;
            border-radius: 15px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
            border-top: 4px solid #3498db;
            text-align: center;
            position: relative;
        }

        .service-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 15px 30px rgba(0,0,0,0.15);
        }

        .service-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
        }

        .service-card h3 {
            font-size: 1.4rem;
            margin-bottom: 1rem;
            color: #2c3e50;
        }

        .service-card p {
            color: #666;
            margin-bottom: 1.5rem;
        }

        .service-tools {
            background: #f8f9fa;
            padding: 1rem;
            border-radius: 8px;
            margin: 1rem 0;
            font-size: 0.9rem;
        }

        .service-tools strong {
            color: #3498db;
        }

        .service-btn {
            background: #3498db;
            color: white;
            padding: 12px 25px;
            text-decoration: none;
            border-radius: 25px;
            font-weight: bold;
            transition: all 0.3s ease;
            display: inline-block;
        }

        .service-btn:hover {
            background: #2980b9;
            transform: translateY(-2px);
        }

        /* Courses with AI Integration */
        .courses {
            padding: 80px 0;
            background: white;
        }

        .courses-tabs {
            display: flex;
            justify-content: center;
            margin-bottom: 3rem;
            flex-wrap: wrap;
            gap: 1rem;
        }

        .tab-btn {
            background: #ecf0f1;
            border: none;
            padding: 12px 24px;
            border-radius: 25px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s ease;
        }

        .tab-btn.active {
            background: #3498db;
            color: white;
        }

        .course-content {
            display: none;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: 2rem;
        }

        .course-content.active {
            display: grid;
        }

        .course-card {
            background: white;
            border: 1px solid #e0e0e0;
            padding: 2rem;
            border-radius: 15px;
            transition: all 0.3s ease;
            position: relative;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .course-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        }

        .course-badge {
            position: absolute;
            top: 15px;
            right: 15px;
            background: #e74c3c;
            color: white;
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: bold;
        }

        .ai-badge {
            background: #9b59b6;
        }

        .course-card h4 {
            font-size: 1.3rem;
            margin-bottom: 1rem;
            color: #2c3e50;
        }

        .course-card p {
            color: #666;
            margin-bottom: 1rem;
            line-height: 1.6;
        }

        .course-features {
            background: #f8f9fa;
            padding: 1rem;
            border-radius: 8px;
            margin: 1rem 0;
            font-size: 0.9rem;
        }

        .course-price {
            color: #e74c3c;
            font-weight: bold;
            font-size: 1.2rem;
            margin-bottom: 1rem;
        }

        .course-btn {
            background: #3498db;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 25px;
            font-weight: bold;
            transition: all 0.3s ease;
            display: inline-block;
            width: 100%;
            text-align: center;
        }

        .course-btn:hover {
            background: #2980b9;
            transform: translateY(-2px);
        }

        /* AI Tools Integration Section */
        .ai-tools {
            padding: 80px 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }

        .ai-tools-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 3rem;
        }

        .ai-tool-card {
            background: rgba(255,255,255,0.1);
            padding: 2rem;
            border-radius: 15px;
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
        }

        .ai-tool-card:hover {
            background: rgba(255,255,255,0.2);
            transform: translateY(-5px);
        }

        .ai-tool-card .icon {
            font-size: 2.5rem;
            margin-bottom: 1rem;
        }

        .ai-tool-card h4 {
            font-size: 1.3rem;
            margin-bottom: 1rem;
        }

        .ai-tool-card p {
            opacity: 0.9;
            margin-bottom: 1.5rem;
        }

        .tool-status {
            background: rgba(46, 204, 113, 0.2);
            color: #2ecc71;
            padding: 5px 10px;
            border-radius: 15px;
            font-size: 0.8rem;
            display: inline-block;
        }

        /* Contact Section with Tool Integration */
        .contact {
            padding: 80px 0;
            background: #2c3e50;
            color: white;
        }

        .contact-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 3rem;
            align-items: start;
        }

        .contact-info h3 {
            font-size: 1.8rem;
            margin-bottom: 2rem;
        }

        .contact-item {
            display: flex;
            align-items: center;
            margin-bottom: 1.5rem;
            padding: 1rem;
            background: rgba(255,255,255,0.1);
            border-radius: 10px;
        }

        .contact-item .icon {
            font-size: 1.5rem;
            margin-right: 15px;
            width: 40px;
            text-align: center;
        }

        .contact-form {
            background: rgba(255,255,255,0.1);
            padding: 2rem;
            border-radius: 15px;
            backdrop-filter: blur(10px);
        }

        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
        }

        .form-group {
            margin-bottom: 1.5rem;
        }

        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
            width: 100%;
            padding: 12px;
            border: none;
            border-radius: 8px;
            background: rgba(255,255,255,0.9);
            color: #333;
            font-size: 1rem;
        }

        .form-group textarea {
            height: 120px;
            resize: vertical;
        }

        .submit-btn {
            background: linear-gradient(45deg, #e74c3c, #c0392b);
            color: white;
            padding: 15px 30px;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s ease;
            width: 100%;
            font-size: 1.1rem;
        }

        .submit-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }

        /* Footer */
        .footer {
            background: #1a252f;
            color: white;
            padding: 3rem 0 1rem;
        }

        .footer-content {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
            margin-bottom: 2rem;
        }

        .footer-section h4 {
            margin-bottom: 1rem;
            color: #e74c3c;
            font-size: 1.2rem;
        }

        .footer-section a {
            color: #bdc3c7;
            text-decoration: none;
            display: block;
            margin-bottom: 0.8rem;
            transition: color 0.3s ease;
        }

        .footer-section a:hover {
            color: #e74c3c;
        }

        .footer-bottom {
            border-top: 1px solid rgba(255,255,255,0.1);
            padding-top: 2rem;
            text-align: center;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            .nav-links, .nav-tools {
                display: none;
            }

            .nav-links.active {
                display: flex;
                flex-direction: column;
                position: absolute;
                top: 100%;
                left: 0;
                width: 100%;
                background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
                padding: 1rem 0;
                box-shadow: 0 5px 10px rgba(0,0,0,0.1);
                z-index: 999;
            }

            .nav-links.active li {
                text-align: center;
                padding: 0.5rem 0;
            }

            .nav-links.active a {
                display: block;
                padding: 0.5rem;
            }

            .mobile-menu-toggle {
                display: block;
            }

            .hero h1 {
                font-size: 2rem;
            }

            .hero-buttons {
                flex-direction: column;
                align-items: center;
            }

            .contact-grid {
                grid-template-columns: 1fr;
            }

            .form-row {
                grid-template-columns: 1fr;
            }

            .stats-grid {
                grid-template-columns: repeat(2, 1fr);
            }

            .courses-tabs {
                justify-content: flex-start;
                overflow-x: auto;
                padding-bottom: 1rem;
            }

            .tools-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }

        /* Animations */
        .fade-in {
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.6s ease;
        }

        .fade-in.visible {
            opacity: 1;
            transform: translateY(0);
        }

        /* Modals */
        .modal {
            display: none;
            position: fixed;
            z-index: 2000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            justify-content: center;
            align-items: center;
            padding: 20px;
        }

        .modal-content {
            background: white;
            padding: 2rem;
            border-radius: 15px;
            width: 90%;
            max-width: 600px;
            position: relative;
            animation: fadeInModal 0.3s ease-out;
        }

        .close-modal {
            position: absolute;
            right: 1rem;
            top: 0.5rem;
            font-size: 2rem;
            cursor: pointer;
            color: #999;
            line-height: 1;
        }

        .close-modal:hover {
            color: #333;
        }

        @keyframes fadeInModal {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
        }
    </style>
</head>
<body>
    <header>
        <nav class="container">
            <div class="logo">ITC Consultance</div>
            <ul class="nav-links">
                <li><a href="#services">Services</a></li>
                <li><a href="#courses">Courses</a></li>
                <li><a href="#ai-tools">AI Tools</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
            <div class="nav-tools">
                <div class="tool-icon" data-modal="tool-gmail" title="Gmail">📧</div>
                <div class="tool-icon" data-modal="tool-calendar" title="Calendar">📅</div>
                <div class="tool-icon" data-modal="tool-notebook" title="NotebookLM">📚</div>
                <div class="tool-icon" data-modal="tool-drive" title="Google Drive">💾</div>
            </div>
            <a href="#contact-modal" class="cta-nav open-modal">Get Started</a>
            <div class="mobile-menu-toggle" aria-label="Toggle navigation menu">☰</div>
        </nav>
    </header>

    <main>
        <section class="hero">
            <div class="container">
                <div class="hero-content">
                    <h1>AI-Powered Credit Repair & Wealth Building</h1>
                    <p>Philadelphia's most advanced financial education platform with integrated AI tools and automation</p>
                    <div class="hero-buttons">
                        <a href="#contact-modal" class="btn-primary open-modal">Free AI Consultation</a>
                        <a href="#courses" class="btn-secondary">Explore AI Courses</a>
                    </div>
                    
                    <div class="tools-dashboard">
                        <h3 style="text-align: center; margin-bottom: 1.5rem;">Integrated Business Tools</h3>
                        <div class="tools-grid">
                            <div class="tool-card" data-modal="tool-notebook">
                                <div class="icon">🤖</div>
                                <h4>NotebookLM</h4>
                                <p>AI-powered knowledge base</p>
                            </div>
                            <div class="tool-card" data-modal="tool-gmail">
                                <div class="icon">📧</div>
                                <h4>Business Gmail</h4>
                                <p>wkchase@itc24.org</p>
                            </div>
                            <div class="tool-card" data-modal="tool-calendar">
                                <div class="icon">📅</div>
                                <h4>Smart Calendar</h4>
                                <p>Automated booking</p>
                            </div>
                            <div class="tool-card" data-modal="tool-monitoring">
                                <div class="icon">🔍</div>
                                <h4>Credit Monitoring</h4>
                                <p>Beast Credit partner</p>
                            </div>
                            <div class="tool-card" data-modal="tool-analytics">
                                <div class="icon">📊</div>
                                <h4>Analytics</h4>
                                <p>Performance tracking</p>
                            </div>
                            <div class="tool-card" data-modal="tool-automation">
                                <div class="icon">⚡</div>
                                <h4>Automation</h4>
                                <p>Workflow systems</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="stats">
            <div class="container">
                <div class="stats-grid">
                    <div class="stat-item">
                        <h3>650+</h3>
                        <p>Average Credit Score Increase</p>
                    </div>
                    <div class="stat-item">
                        <h3>85%</h3>
                        <p>AI-Assisted Success Rate</p>
                    </div>
                    <div class="stat-item">
                        <h3>12+</h3>
                        <p>AI-Enhanced Courses</p>
                    </div>
                    <div class="stat-item">
                        <h3>24/7</h3>
                        <p>Automated Support</p>
                    </div>
                </div>
            </div>
        </section>

        <section id="services" class="services">
            <div class="container">
                <h2 class="section-title">AI-Enhanced Services</h2>
                <div class="services-grid">
                    <article class="service-card">
                        <div class="service-icon">🤖</div>
                        <h3>AI-Powered Credit Repair</h3>
                        <p>Advanced algorithms analyze your credit reports and create personalized dispute strategies for maximum impact.</p>
                        <div class="service-tools">
                            <strong>Tools:</strong> NotebookLM analysis, automated dispute generation, progress tracking
                        </div>
                        <a href="#contact-modal" class="service-btn open-modal">Start AI Repair</a>
                    </article>
                    <article class="service-card">
                        <div class="service-icon">📊</div>
                        <h3>Smart Credit Monitoring</h3>
                        <p>Real-time monitoring with AI alerts and predictive analysis of credit changes and opportunities.</p>
                        <div class="service-tools">
                            <strong>Tools:</strong> Beast Credit integration, Gmail notifications, calendar reminders
                        </div>
                        <a href="https://beastcreditmonitoring.com/redirect" class="service-btn">Get Monitoring</a>
                    </article>
                    <article class="service-card">
                        <div class="service-icon">🏠</div>
                        <h3>Automated Real Estate Education</h3>
                        <p>AI-curated courses and automated systems for building wealth through real estate investing.</p>
                        <div class="service-tools">
                            <strong>Tools:</strong> NotebookLM research, automated content delivery, progress tracking
                        </div>
                        <a href="#courses" class="service-btn">Explore Courses</a>
                    </article>
                </div>
            </div>
        </section>

        <section id="courses" class="courses">
            <div class="container">
                <h2 class="section-title">AI-Enhanced Training Programs</h2>
                
                <div class="courses-tabs">
                    <button class="tab-btn active" data-tab="credit">Credit Mastery</button>
                    <button class="tab-btn" data-tab="beginner">Real Estate Basics</button>
                    <button class="tab-btn" data-tab="advanced">Advanced Strategies</button>
                    <button class="tab-btn" data-tab="community">AI Community</button>
                </div>

                <div id="credit" class="course-content active">
                    <article class="course-card">
                        <div class="course-badge">AI-POWERED</div>
                        <h4>Credit Repair Blueprint</h4>
                        <p>AI-enhanced credit repair strategies with automated dispute generation and progress tracking</p>
                        <div class="course-features">
                            ✓ NotebookLM knowledge base<br>
                            ✓ Automated dispute letters<br>
                            ✓ AI progress analysis<br>
                            ✓ Smart monitoring integration
                        </div>
                        <div class="course-price">Featured Course</div>
                        <a href="#contact-modal" class="course-btn open-modal">Access Now</a>
                    </article>
                    <article class="course-card">
                        <h4>Credit Hacker Crash Course</h4>
                        <p>Rapid credit improvement with AI-assisted strategies and automated workflows</p>
                        <div class="course-features">
                            ✓ AI-powered credit analysis<br>
                            ✓ Automated action plans<br>
                            ✓ Smart calendar scheduling
                        </div>
                        <div class="course-price">$197</div>
                        <a href="#contact-modal" class="course-btn open-modal">Get Started</a>
                    </article>
                </div>

                <div id="beginner" class="course-content">
                    <article class="course-card">
                        <div class="course-badge ai-badge">AI-ENHANCED</div>
                        <h4>Fast-Track to Your First Rental</h4>
                        <p>AI-guided property analysis and market research for new investors</p>
                        <div class="course-features">
                            ✓ NotebookLM market research<br>
                            ✓ Automated property analysis<br>
                            ✓ AI deal evaluation tools
                        </div>
                        <div class="course-price">$297</div>
                        <a href="#contact-modal" class="course-btn open-modal">Start Learning</a>
                    </article>
                    <article class="course-card">
                        <h4>No-Money-Down Playbook</h4>
                        <p>Creative financing strategies with AI-powered deal structuring</p>
                        <div class="course-features">
                            ✓ AI financing calculators<br>
                            ✓ Automated deal packaging<br>
                            ✓ Smart lender matching
                        </div>
                        <div class="course-price">$397</div>
                        <a href="#contact-modal" class="course-btn open-modal">Get Access</a>
                    </article>
                    <article class="course-card">
                        <h4>Off-Market Deal Finder</h4>
                        <p>AI-powered lead generation and market analysis systems</p>
                        <div class="course-features">
                            ✓ Automated lead generation<br>
                            ✓ AI market analysis<br>
                            ✓ Smart deal alerts
                        </div>
                        <div class="course-price">$497</div>
                        <a href="#contact-modal" class="course-btn open-modal">Find Deals</a>
                    </article>
                </div>

                <div id="advanced" class="course-content">
                    <article class="course-card">
                        <h4>Advanced AI Real Estate Investing</h4>
                        <p>Complex real estate strategies with advanced AI support for analytics and portfolio management.</p>
                        <div class="course-features">
                            ✓ AI-driven portfolio management<br>
                            ✓ Automated market prediction<br>
                            ✓ Advanced deal flow systems
                        </div>
                        <div class="course-price">$597</div>
                        <a href="#contact-modal" class="course-btn open-modal">Enroll Now</a>
                    </article>
                </div>

                <div id="community" class="course-content">
                    <article class="course-card">
                        <h4>ITC AI Community</h4>
                        <p>Join our exclusive community for continuous learning, networking, and AI tool access.</p>
                        <div class="course-features">
                            ✓ Private Discord channel<br>
                            ✓ Monthly AI tool workshops<br>
                            ✓ Expert Q&A sessions
                        </div>
                        <div class="course-price">Free for students</div>
                        <a href="#contact-modal" class="course-btn open-modal">Join Today</a>
                    </article>
                </div>
            </div>
        </section>

        <section id="ai-tools" class="ai-tools">
            <div class="container">
                <h2 class="section-title">Exclusive AI Tools</h2>
                <div class="ai-tools-grid">
                    <article class="ai-tool-card">
                        <div class="icon">🤖</div>
                        <h4>AI Credit Analyzer</h4>
                        <p>Upload your credit report for an instant, AI-powered analysis of strengths, weaknesses, and opportunities.</p>
                        <a href="#tool-analyzer-modal" class="tool-status open-modal">Available Now</a>
                    </article>
                    <article class="ai-tool-card">
                        <div class="icon">✍️</div>
                        <h4>Dispute Letter Automator</h4>
                        <p>Our AI drafts and sends customized dispute letters to credit bureaus based on your analysis results.</p>
                        <a href="#tool-automator-modal" class="tool-status open-modal">In Development</a>
                    </article>
                    <article class="ai-tool-card">
                        <div class="icon">📈</div>
                        <h4>Predictive Score Simulator</h4>
                        <p>See how different financial actions will impact your credit score before you make them.</p>
                        <a href="#tool-simulator-modal" class="tool-status open-modal">Coming Soon</a>
                    </article>
                </div>
            </div>
        </section>

        <section id="contact" class="contact">
            <div class="container">
                <h2 class="section-title">Contact Us</h2>
                <div class="contact-grid">
                    <div class="contact-info">
                        <h3>Get in Touch</h3>
                        <p>Our team and AI assistants are ready to help you on your financial journey. Reach out to schedule a consultation or ask a question.</p>
                        <div class="contact-item">
                            <div class="icon">📍</div>
                            <div>
                                <strong>Office Address</strong><br>
                                123 AI Boulevard, Philadelphia, PA 19104
                            </div>
                        </div>
                        <div class="contact-item">
                            <div class="icon">📧</div>
                            <div>
                                <strong>Email</strong><br>
                                <a href="mailto:info@itc24.org" style="color:white; text-decoration: none;">info@itc24.org</a>
                            </div>
                        </div>
                        <div class="contact-item">
                            <div class="icon">📞</div>
                            <div>
                                <strong>Phone</strong><br>
                                <a href="tel:+12155551234" style="color:white; text-decoration: none;">(215) 555-1234</a>
                            </div>
                        </div>
                    </div>
                    <form class="contact-form">
                        <h3>Schedule a Consultation</h3>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="first-name">First Name</label>
                                <input type="text" id="first-name" name="first-name" required>
                            </div>
                            <div class="form-group">
                                <label for="last-name">Last Name</label>
                                <input type="text" id="last-name" name="last-name" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" id="email" name="email" required>
                        </div>
                        <div class="form-group">
                            <label for="service">Interested Service</label>
                            <select id="service" name="service">
                                <option value="credit-repair">AI-Powered Credit Repair</option>
                                <option value="real-estate">Real Estate Education</option>
                                <option value="general">General Inquiry</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="message">Message</label>
                            <textarea id="message" name="message"></textarea>
                        </div>
                        <button type="submit" class="submit-btn">Submit Inquiry</button>
                    </form>
                </div>
            </div>
        </section>
    </main>

    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h4>ITC Consultance LLC</h4>
                    <p>AI-Powered Financial Education</p>
                </div>
                <div class="footer-section">
                    <h4>Quick Links</h4>
                    <a href="#services">Services</a>
                    <a href="#courses">Courses</a>
                    <a href="#ai-tools">AI Tools</a>
                    <a href="#contact">Contact</a>
                </div>
                <div class="footer-section">
                    <h4>Legal</h4>
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms of Service</a>
                </div>
            </div>
            <div class="footer-bottom">
                &copy; 2025 ITC Consultance LLC. All rights reserved.
            </div>
        </div>
    </footer>

    <div id="contact-modal" class="modal">
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <form class="contact-form" onsubmit="event.preventDefault(); alert('Form submitted! Thank you!');">
                <h3>Schedule a Consultation</h3>
                <div class="form-row">
                    <div class="form-group">
                        <label for="modal-first-name">First Name</label>
                        <input type="text" id="modal-first-name" name="first-name" required>
                    </div>
                    <div class="form-group">
                        <label for="modal-last-name">Last Name</label>
                        <input type="text" id="modal-last-name" name="last-name" required>
                    </div>
                </div>
                <div class="form-group">
                    <label for="modal-email">Email</label>
                    <input type="email" id="modal-email" name="email" required>
                </div>
                <div class="form-group">
                    <label for="modal-service">Interested Service</label>
                    <select id="modal-service" name="service">
                        <option value="credit-repair">AI-Powered Credit Repair</option>
                        <option value="real-estate">Real Estate Education</option>
                        <option value="general">General Inquiry</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="modal-message">Message</label>
                    <textarea id="modal-message" name="message"></textarea>
                </div>
                <button type="submit" class="submit-btn">Submit Inquiry</button>
            </form>
        </div>
    </div>

    <div id="tool-gmail" class="modal">
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h3>Business Gmail Access</h3>
            <p>Our business email is **wkchase@itc24.org**. Please reach out to us here for direct inquiries.</p>
            <p>This modal can be customized to show a live form or a link to a mailto link.</p>
        </div>
    </div>

    <div id="tool-calendar" class="modal">
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h3>Automated Booking</h3>
            <p>Use our smart calendar to automatically book a consultation with our team at a time that works for you.</p>
            <p>This modal could contain a link to a Calendly or similar booking page.</p>
        </div>
    </div>

    <div id="tool-notebook" class="modal">
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h3>NotebookLM AI Knowledge Base</h3>
            <p>Our proprietary knowledge base, powered by NotebookLM, helps us provide rapid and accurate information.</p>
            <p>This is a tool used internally to assist our clients.</p>
        </div>
    </div>

    <div id="tool-drive" class="modal">
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h3>Google Drive Integration</h3>
            <p>We use Google Drive for secure, organized file sharing and collaboration on client documents.</p>
        </div>
    </div>

    <div id="tool-monitoring" class="modal">
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h3>Credit Monitoring via Beast Credit</h3>
            <p>We partner with Beast Credit Monitoring to provide real-time updates and alerts on your credit file.</p>
        </div>
    </div>

    <div id="tool-analytics" class="modal">
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h3>Performance Analytics</h3>
            <p>Our internal analytics tools track the performance of your credit repair and financial education journey.</p>
        </div>
    </div>

    <div id="tool-automation" class="modal">
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h3>Workflow Automation</h3>
            <p>We use smart automation to streamline our processes, from dispute letter generation to client communication.</p>
        </div>
    </div>
    
    <div id="tool-analyzer-modal" class="modal">
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h3>AI Credit Analyzer</h3>
            <p>This tool will be available soon! It will allow you to upload your credit report and get an instant AI-powered analysis.</p>
        </div>
    </div>

    <div id="tool-automator-modal" class="modal">
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h3>Dispute Letter Automator</h3>
            <p>This tool is currently in development. It will use AI to draft and send personalized dispute letters to credit bureaus.</p>
        </div>
    </div>

    <div id="tool-simulator-modal" class="modal">
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h3>Predictive Score Simulator</h3>
            <p>Coming soon! This tool will help you understand the impact of different financial actions on your credit score.</p>
        </div>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Mobile Menu Toggle
            const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
            const navLinks = document.querySelector('.nav-links');
            mobileMenuToggle.addEventListener('click', function() {
                navLinks.classList.toggle('active');
            });

            // Tab Functionality
            const tabButtons = document.querySelectorAll('.tab-btn');
            const courseContents = document.querySelectorAll('.course-content');

            tabButtons.forEach(button => {
                button.addEventListener('click', () => {
                    // Remove active class from all buttons and content
                    tabButtons.forEach(btn => btn.classList.remove('active'));
                    courseContents.forEach(content => content.classList.remove('active'));

                    // Add active class to the clicked button and its corresponding content
                    const tabId = button.getAttribute('data-tab');
                    const targetContent = document.getElementById(tabId);

                    button.classList.add('active');
                    if (targetContent) {
                        targetContent.classList.add('active');
                    }
                });
            });

            // Modal Functionality
            const modalOpeners = document.querySelectorAll('[data-modal], .open-modal');
            const modals = document.querySelectorAll('.modal');
            const closeButtons = document.querySelectorAll('.close-modal');

            modalOpeners.forEach(opener => {
                opener.addEventListener('click', function(e) {
                    e.preventDefault();
                    const modalId = opener.getAttribute('data-modal') || opener.getAttribute('href').substring(1);
                    const targetModal = document.getElementById(modalId);
                    if (targetModal) {
                        targetModal.style.display = 'flex';
                    }
                });
            });

            closeButtons.forEach(closer => {
                closer.addEventListener('click', function() {
                    const modal = closer.closest('.modal');
                    if (modal) {
                        modal.style.display = 'none';
                    }
                });
            });

            // Close modal when clicking outside of the content
            modals.forEach(modal => {
                modal.addEventListener('click', function(e) {
                    if (e.target === this) {
                        this.style.display = 'none';
                    }
                });
            });
        });
    </script>
</body>
</html>
