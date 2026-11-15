import os
import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SCREENSHOT_DIR = os.path.join(BASE_DIR, 'documentation', 'assets', 'screenshots')
FINAL_DIR = os.path.join(BASE_DIR, 'documentation', 'final')
PPTX_OUTPUT = os.path.join(FINAL_DIR, 'Mental_Wellness_Project_Presentation.pptx')

# Color palette: Soft Lavender, Deep Indigo, Purple, Off-White
COLOR_BG = RGBColor(250, 249, 253)         # #FAF9FD
COLOR_CARD = RGBColor(255, 255, 255)       # White
COLOR_PRIMARY = RGBColor(118, 65, 181)     # Deep Purple #7641B5
COLOR_PRIMARY_DARK = RGBColor(55, 30, 95)  # #371E5F
COLOR_ACCENT = RGBColor(79, 70, 229)       # Indigo #4F46E5
COLOR_TEXT_MAIN = RGBColor(30, 41, 59)     # Slate 800
COLOR_TEXT_MUTED = RGBColor(100, 116, 139) # Slate 500
COLOR_BORDER = RGBColor(226, 215, 243)     # Light Lavender border
COLOR_EMERALD = RGBColor(16, 185, 129)

def create_deck():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    def add_background(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = COLOR_BG
        bg.line.color.rgb = COLOR_BG

    def add_header(slide, title_text, category="CASE 59: MENTAL WELLNESS APPLICATION"):
        # Category Pill
        cat_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.7), Inches(0.4))
        tf_cat = cat_box.text_frame
        tf_cat.word_wrap = True
        p_cat = tf_cat.paragraphs[0]
        p_cat.text = category.upper()
        p_cat.font.size = Pt(11)
        p_cat.font.bold = True
        p_cat.font.color.rgb = COLOR_PRIMARY
        p_cat.font.name = "Arial"

        # Main Slide Title
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.75), Inches(11.7), Inches(0.7))
        tf_title = title_box.text_frame
        tf_title.word_wrap = True
        p_title = tf_title.paragraphs[0]
        p_title.text = title_text
        p_title.font.size = Pt(24)
        p_title.font.bold = True
        p_title.font.color.rgb = COLOR_PRIMARY_DARK
        p_title.font.name = "Arial"

        # Bottom accent line
        line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.45), Inches(11.733), Inches(0.02))
        line.fill.solid()
        line.fill.fore_color.rgb = COLOR_BORDER
        line.line.color.rgb = COLOR_BORDER

        # Footer
        footer = slide.shapes.add_textbox(Inches(0.8), Inches(7.1), Inches(11.7), Inches(0.3))
        tf_f = footer.text_frame
        p_f = tf_f.paragraphs[0]
        p_f.text = "MindCare • Maruthi Dapke (ENG24CS0127) • Dayananda Sagar University, School of Engineering"
        p_f.font.size = Pt(9)
        p_f.font.color.rgb = COLOR_TEXT_MUTED
        p_f.font.name = "Arial"

    # ==========================================
    # SLIDE 1: TITLE SLIDE
    # ==========================================
    slide1 = prs.slides.add_slide(blank_layout)
    add_background(slide1)

    # Hero card on left
    card1 = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.8), Inches(6.8), Inches(5.9))
    card1.fill.solid()
    card1.fill.fore_color.rgb = COLOR_PRIMARY_DARK
    card1.line.color.rgb = COLOR_PRIMARY_DARK

    tb1 = slide1.shapes.add_textbox(Inches(1.2), Inches(1.2), Inches(6.0), Inches(5.0))
    tf1 = tb1.text_frame
    tf1.word_wrap = True

    p = tf1.paragraphs[0]
    p.text = "ACADEMIC MINI-PROJECT PRESENTATION • CASE 59"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = RGBColor(216, 180, 254)

    p2 = tf1.add_paragraph()
    p2.text = "\nAI-Powered Mental\nWellness Platform"
    p2.font.size = Pt(32)
    p2.font.bold = True
    p2.font.color.rgb = RGBColor(255, 255, 255)

    p3 = tf1.add_paragraph()
    p3.text = "\nMindCare: A Secure, Privacy-First Digital Sanctuary for Mood Tracking, Private Journaling, Guided Breathing, and Empathetic AI Support."
    p3.font.size = Pt(13)
    p3.font.color.rgb = RGBColor(243, 232, 255)

    p4 = tf1.add_paragraph()
    p4.text = "\n\nDeveloped By: Maruthi Dapke\nUSN: ENG24CS0127\nDepartment: School of Engineering (CSE)\nInstitution: Dayananda Sagar University, Bengaluru"
    p4.font.size = Pt(12)
    p4.font.bold = True
    p4.font.color.rgb = RGBColor(255, 255, 255)

    # Right side: Screenshot of Landing Page
    img1_path = os.path.join(SCREENSHOT_DIR, '01_landing_page.png')
    if os.path.exists(img1_path):
        slide1.shapes.add_picture(img1_path, Inches(7.9), Inches(0.8), width=Inches(4.6))

    # ==========================================
    # SLIDE 2: INTRODUCTION
    # ==========================================
    slide2 = prs.slides.add_slide(blank_layout)
    add_background(slide2)
    add_header(slide2, "Introduction & Background Context")

    # 3 Cards
    cols = [
        ("What is Mental Wellness?", 
         "Mental wellness is a dynamic state of emotional balance, cognitive clarity, and psychological resilience that enables individuals to manage stress, realize abilities, and build fulfilling relationships without stigma.",
         Inches(0.8)),
        ("Why Does It Matter Today?", 
         "Rapidly accelerating university and workplace pressures have caused unprecedented spikes in stress, anxiety, and sleep fragmentation among young adults, with over 75% reporting academic burnout.",
         Inches(4.8)),
        ("The Role of Digital Platforms", 
         "Scalable, ubiquitous web platforms provide accessible, barrier-free first-line emotional self-care, daily habit formation, and early distress mitigation right in the user's daily digital workflow.",
         Inches(8.8))
    ]
    for title, text, left in cols:
        card = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, Inches(1.8), Inches(3.7), Inches(4.8))
        card.fill.solid()
        card.fill.fore_color.rgb = COLOR_CARD
        card.line.color.rgb = COLOR_BORDER
        
        tb = slide2.shapes.add_textbox(left + Inches(0.2), Inches(2.0), Inches(3.3), Inches(4.3))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(16)
        p.font.bold = True
        p.font.color.rgb = COLOR_PRIMARY_DARK
        
        p2 = tf.add_paragraph()
        p2.text = f"\n{text}"
        p2.font.size = Pt(13)
        p2.font.color.rgb = COLOR_TEXT_MAIN

    # ==========================================
    # SLIDE 3: PROBLEM STATEMENT
    # ==========================================
    slide3 = prs.slides.add_slide(blank_layout)
    add_background(slide3)
    add_header(slide3, "Problem Statement & Case Scenario (Case 59)")

    # Case 59 Scenario Box
    scenario_card = slide3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.7), Inches(11.733), Inches(1.4))
    scenario_card.fill.solid()
    scenario_card.fill.fore_color.rgb = RGBColor(243, 238, 251)
    scenario_card.line.color.rgb = COLOR_PRIMARY
    
    tb_sc = slide3.shapes.add_textbox(Inches(1.0), Inches(1.8), Inches(11.3), Inches(1.2))
    tf_sc = tb_sc.text_frame
    tf_sc.word_wrap = True
    p_sc = tf_sc.paragraphs[0]
    p_sc.text = "CASE 59 BENCHMARK SCENARIO"
    p_sc.font.size = Pt(11)
    p_sc.font.bold = True
    p_sc.font.color.rgb = COLOR_PRIMARY
    p_sc2 = tf_sc.add_paragraph()
    p_sc2.text = "A start-up offers mood tracking and guided breathing exercises to 20,000 users. Users are extremely sensitive about privacy and wrong advice. The system must eliminate dangerous diagnostic medical claims and provide fail-safe crisis routing."
    p_sc2.font.size = Pt(13)
    p_sc2.font.color.rgb = COLOR_PRIMARY_DARK

    # Problems Grid (2 large cards)
    p_cards = [
        ("Key Limitations of Traditional Approaches", [
            "• Social stigma and severe cost barriers associated with clinical consultations.",
            "• Fragmented tools: separate apps for breathing, journaling, and tracking.",
            "• Risk of user isolation during sudden emotional spirals or panic attacks."
        ], Inches(0.8)),
        ("Privacy & Algorithmic Ethics Risks", [
            "• Sensitive emotional thoughts sold to advertising trackers or shared publicly.",
            "• Untested chatbots fabricating hallucinated psychiatric prescriptions.",
            "• Absence of automatic detection for imminent self-harm or crisis emergencies."
        ], Inches(6.8))
    ]
    for title, items, left in p_cards:
        c = slide3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, Inches(3.4), Inches(5.7), Inches(3.3))
        c.fill.solid()
        c.fill.fore_color.rgb = COLOR_CARD
        c.line.color.rgb = COLOR_BORDER
        tb = slide3.shapes.add_textbox(left + Inches(0.3), Inches(3.6), Inches(5.1), Inches(2.9))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(15)
        p.font.bold = True
        p.font.color.rgb = COLOR_PRIMARY_DARK
        for item in items:
            pi = tf.add_paragraph()
            pi.text = f"\n{item}"
            pi.font.size = Pt(12)
            pi.font.color.rgb = COLOR_TEXT_MAIN

    # ==========================================
    # SLIDE 4: PROJECT OBJECTIVES
    # ==========================================
    slide4 = prs.slides.add_slide(blank_layout)
    add_background(slide4)
    add_header(slide4, "Project Objectives & Scope")

    objectives = [
        ("1. Daily Mood Tracking", "Enable frictionless check-ins with 6 calibrated emotional states (Very Happy to Anxious), contextual factor tags, and intensity scoring."),
        ("2. Private Journaling", "Provide a private, zero-leak digital sanctuary for daily reflections with full CRUD operations and tag-based search."),
        ("3. Guided Breathing Studio", "Offer interactive visual 4-7-8, Box (4-4-4-4), and Coherent breathing with countdown timers and synthesized Web Audio chimes."),
        ("4. AI Wellness Assistant", "Integrate an empathetic companion powered by Gemini / Smart Offline Engine with automated 24/7 crisis emergency helpline redirection."),
        ("5. Progress Analytics", "Visualize self-reported trajectories using Recharts Area and Donut charts while strictly adhering to non-diagnostic ethical standards.")
    ]
    top = Inches(1.8)
    for title, desc in objectives:
        c = slide4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), top, Inches(11.733), Inches(0.85))
        c.fill.solid()
        c.fill.fore_color.rgb = COLOR_CARD
        c.line.color.rgb = COLOR_BORDER
        tb = slide4.shapes.add_textbox(Inches(1.0), top + Inches(0.08), Inches(11.3), Inches(0.7))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = COLOR_PRIMARY
        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(11)
        p2.font.color.rgb = COLOR_TEXT_MAIN
        top += Inches(0.98)

    # ==========================================
    # SLIDE 5: PROPOSED SYSTEM (MINDCARE)
    # ==========================================
    slide5 = prs.slides.add_slide(blank_layout)
    add_background(slide5)
    add_header(slide5, "Proposed System: MindCare Platform")

    c_left = slide5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.8), Inches(5.6), Inches(4.9))
    c_left.fill.solid()
    c_left.fill.fore_color.rgb = COLOR_CARD
    c_left.line.color.rgb = COLOR_BORDER
    tb_l = slide5.shapes.add_textbox(Inches(1.1), Inches(2.0), Inches(5.0), Inches(4.4))
    tf_l = tb_l.text_frame
    tf_l.word_wrap = True
    p = tf_l.paragraphs[0]
    p.text = "Core Architectural Innovations"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = COLOR_PRIMARY_DARK

    features_list = [
        "• Unified Emotional Workflow: Seamless transition between check-ins, journals, breathing, and AI conversation.",
        "• Client-Side Sound Synthesis: In-browser Web Audio API oscillators producing 432Hz Tibetan singing bowls with 0 network latency.",
        "• Zero-Config Database Portability: Intelligent adapter supporting both MongoDB Mongoose and local JSON store fallback.",
        "• Ethical Guardrail Engine: Immediate regex pattern matching for self-harm intent with hardcoded 24/7 crisis numbers.",
        "• Strict User Isolation: Every query scoped strictly by validated JWT Bearer token."
    ]
    for feat in features_list:
        pf = tf_l.add_paragraph()
        pf.text = f"\n{feat}"
        pf.font.size = Pt(12)
        pf.font.color.rgb = COLOR_TEXT_MAIN

    img_dash = os.path.join(SCREENSHOT_DIR, '04_user_dashboard.png')
    if os.path.exists(img_dash):
        slide5.shapes.add_picture(img_dash, Inches(6.8), Inches(1.8), width=Inches(5.7))

    # ==========================================
    # SLIDE 6: TECHNOLOGY STACK
    # ==========================================
    slide6 = prs.slides.add_slide(blank_layout)
    add_background(slide6)
    add_header(slide6, "Verified Technology Stack")

    tech_categories = [
        ("Frontend Layer", [
            ("React 18", "Component-driven reactive UI architecture"),
            ("Vite 5", "Lightning-fast HMR and ESM build tool"),
            ("Tailwind CSS", "Modern pastel lavender styling & glassmorphism"),
            ("Lucide React", "Minimalist, accessible SVG iconography"),
            ("Recharts", "Declarative SVG charting for trends & distribution")
        ], Inches(0.8)),
        ("Backend & Security", [
            ("Node.js (v22)", "High-throughput asynchronous runtime"),
            ("Express.js", "RESTful API routing & middleware architecture"),
            ("JWT (jsonwebtoken)", "Stateless, cryptographically signed tokens"),
            ("Bcryptjs", "Salted password hashing with 10 salt rounds"),
            ("Morgan & CORS", "HTTP request telemetry & origin protection")
        ], Inches(4.8)),
        ("Database & Audio Engine", [
            ("MongoDB & Mongoose", "Document-oriented persistence schemas"),
            ("JSON Fallback Store", "Zero-dependency local database engine"),
            ("Web Audio API", "Real-time pink/brown noise & frequency synthesis"),
            ("Google Gemini API", "Empathetic conversational AI reasoning"),
            ("Canvas-Confetti", "Positive reinforcement micro-animations")
        ], Inches(8.8))
    ]
    for cat_title, items, left in tech_categories:
        c = slide6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, Inches(1.8), Inches(3.7), Inches(4.8))
        c.fill.solid()
        c.fill.fore_color.rgb = COLOR_CARD
        c.line.color.rgb = COLOR_BORDER
        tb = slide6.shapes.add_textbox(left + Inches(0.2), Inches(2.0), Inches(3.3), Inches(4.3))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = cat_title
        p.font.size = Pt(16)
        p.font.bold = True
        p.font.color.rgb = COLOR_PRIMARY_DARK
        for name, sub in items:
            pi = tf.add_paragraph()
            pi.text = f"\n• {name}: "
            pi.font.size = Pt(12)
            pi.font.bold = True
            pi.font.color.rgb = COLOR_PRIMARY
            run = pi.add_run()
            run.text = sub
            run.font.bold = False
            run.font.color.rgb = COLOR_TEXT_MAIN

    # ==========================================
    # SLIDE 7: SYSTEM ARCHITECTURE
    # ==========================================
    slide7 = prs.slides.add_slide(blank_layout)
    add_background(slide7)
    add_header(slide7, "System Architecture & End-to-End Data Flow")

    # Draw architecture blocks
    blocks = [
        ("Client Tier (Port 3000)", "Single Page Application (SPA)\nReact 18 + Tailwind CSS\nWeb Audio API (Synthesizers)\nRecharts Rendering Engine", Inches(0.8), Inches(2.0), Inches(3.4), Inches(4.2)),
        ("Application Tier (Port 5001)", "Node.js + Express.js API\n• Auth Middleware (JWT Token Guard)\n• RESTful Controllers (/moods, /journal)\n• Crisis Guardrail Pattern Matcher\n• Gemini 1.5 Flash Cloud Proxy", Inches(4.9), Inches(2.0), Inches(3.8), Inches(4.2)),
        ("Persistence & AI Tier", "Database Storage:\n• MongoDB Database (Mongoose)\n• Auto-Failover Local Store (db.json)\n\nAI Services:\n• Google Gemini API (Cloud)\n• Built-In Empathetic Rules Engine", Inches(9.3), Inches(2.0), Inches(3.2), Inches(4.2))
    ]
    for b_title, b_content, left, top, w, h in blocks:
        c = slide7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, w, h)
        c.fill.solid()
        c.fill.fore_color.rgb = COLOR_CARD
        c.line.color.rgb = COLOR_PRIMARY
        tb = slide7.shapes.add_textbox(left + Inches(0.2), top + Inches(0.2), w - Inches(0.4), h - Inches(0.4))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = b_title
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = COLOR_PRIMARY_DARK
        p2 = tf.add_paragraph()
        p2.text = f"\n{b_content}"
        p2.font.size = Pt(12)
        p2.font.color.rgb = COLOR_TEXT_MAIN

    # ==========================================
    # SLIDE 8: APPLICATION MODULES
    # ==========================================
    slide8 = prs.slides.add_slide(blank_layout)
    add_background(slide8)
    add_header(slide8, "Functional Modules Overview")

    modules = [
        ("Authentication & Security", "Registration, login, salted bcrypt hashing, JWT issuance, and instant 1-Click Demo Login for university evaluators."),
        ("User Dashboard", "Personalized time-based greeting, today's check-in status, 7-day mini-trajectory chart, and quick activity shortcuts."),
        ("Daily Mood Tracker", "6 calibrated mood levels, factor tags (Academics, Sleep, Health), timestamping, and Recharts area progression."),
        ("Personal Journal", "Private digital sanctuary with rich content, emotion tags, real-time search, editing, and deletion capabilities."),
        ("MindCare AI Companion", "Empathetic conversational assistant with automated self-harm crisis detection and 24/7 emergency helpline redirection."),
        ("Mindfulness Studio", "4-7-8, Box, and Coherent breathing with animated visual circle, countdown timers, and Web Audio acoustic chimes.")
    ]
    for i, (m_title, m_desc) in enumerate(modules):
        r = i // 2
        c_idx = i % 2
        left = Inches(0.8) if c_idx == 0 else Inches(6.8)
        top = Inches(1.8) + Inches(r * 1.6)
        
        c = slide8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, Inches(5.7), Inches(1.4))
        c.fill.solid()
        c.fill.fore_color.rgb = COLOR_CARD
        c.line.color.rgb = COLOR_BORDER
        tb = slide8.shapes.add_textbox(left + Inches(0.2), top + Inches(0.1), Inches(5.3), Inches(1.2))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = f"Module {i+1}: {m_title}"
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = COLOR_PRIMARY
        p2 = tf.add_paragraph()
        p2.text = m_desc
        p2.font.size = Pt(10.5)
        p2.font.color.rgb = COLOR_TEXT_MAIN

    # ==========================================
    # SLIDE 9: USER DASHBOARD AND MOOD TRACKER
    # ==========================================
    slide9 = prs.slides.add_slide(blank_layout)
    add_background(slide9)
    add_header(slide9, "User Dashboard & Daily Mood Tracker Implementation")

    # Left: Explanation
    tb9 = slide9.shapes.add_textbox(Inches(0.8), Inches(1.8), Inches(5.0), Inches(4.8))
    tf9 = tb9.text_frame
    tf9.word_wrap = True
    p = tf9.paragraphs[0]
    p.text = "Features & Interface Highlights"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = COLOR_PRIMARY_DARK

    bullets = [
        "• 1-Tap Quick Mood Check-In: Instant emoji selection directly from dashboard with micro-confetti reward.",
        "• 6 Scaled Emotional Options: Very Happy (6), Happy (5), Neutral (4), Sad (2), Stressed (2), Anxious (1).",
        "• Contextual Tagging: Link mood to real-life factors like Academics, Sleep, Work, and Health.",
        "• Real-Time Trend Synchronization: Dashboard immediately renders updated 7-day average scores using Recharts."
    ]
    for b in bullets:
        pb = tf9.add_paragraph()
        pb.text = f"\n{b}"
        pb.font.size = Pt(12)
        pb.font.color.rgb = COLOR_TEXT_MAIN

    img_mood = os.path.join(SCREENSHOT_DIR, '05_daily_mood_tracker.png')
    if os.path.exists(img_mood):
        slide9.shapes.add_picture(img_mood, Inches(6.2), Inches(1.8), width=Inches(6.3))

    # ==========================================
    # SLIDE 10: PERSONAL JOURNAL & AI ASSISTANT
    # ==========================================
    slide10 = prs.slides.add_slide(blank_layout)
    add_background(slide10)
    add_header(slide10, "Personal Journal & AI Wellness Companion")

    img_jour = os.path.join(SCREENSHOT_DIR, '07_personal_journal.png')
    if os.path.exists(img_jour):
        slide10.shapes.add_picture(img_jour, Inches(0.8), Inches(1.8), width=Inches(5.6))

    img_ai = os.path.join(SCREENSHOT_DIR, '10_ai_crisis_guardrail.png')
    if os.path.exists(img_ai):
        slide10.shapes.add_picture(img_ai, Inches(6.8), Inches(1.8), width=Inches(5.7))

    # Caption card below
    c_cap = slide10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(5.8), Inches(11.733), Inches(1.1))
    c_cap.fill.solid()
    c_cap.fill.fore_color.rgb = COLOR_CARD
    c_cap.line.color.rgb = COLOR_BORDER
    tb_c = slide10.shapes.add_textbox(Inches(1.0), Inches(5.9), Inches(11.3), Inches(0.9))
    tf_c = tb_c.text_frame
    tf_c.word_wrap = True
    p = tf_c.paragraphs[0]
    p.text = "Left: Private Personal Journal with search, tags, and zero-leak storage.  |  Right: AI Wellness Companion with Crisis Guardrail triggering Tele-MANAS (14416) & Vandrevala Foundation hotlines upon detecting self-harm intent."
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = COLOR_PRIMARY_DARK

    # ==========================================
    # SLIDE 11: MINDFULNESS & ANALYTICS
    # ==========================================
    slide11 = prs.slides.add_slide(blank_layout)
    add_background(slide11)
    add_header(slide11, "Mindfulness Studio & Progress Analytics")

    img_br = os.path.join(SCREENSHOT_DIR, '11_mindfulness_breathing.png')
    if os.path.exists(img_br):
        slide11.shapes.add_picture(img_br, Inches(0.8), Inches(1.8), width=Inches(5.6))

    img_an = os.path.join(SCREENSHOT_DIR, '13_progress_analytics.png')
    if os.path.exists(img_an):
        slide11.shapes.add_picture(img_an, Inches(6.8), Inches(1.8), width=Inches(5.7))

    c_cap11 = slide11.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(5.8), Inches(11.733), Inches(1.1))
    c_cap11.fill.solid()
    c_cap11.fill.fore_color.rgb = COLOR_CARD
    c_cap11.line.color.rgb = COLOR_BORDER
    tb_c11 = slide11.shapes.add_textbox(Inches(1.0), Inches(5.9), Inches(11.3), Inches(0.9))
    tf_c11 = tb_c11.text_frame
    tf_c11.word_wrap = True
    p = tf_c11.paragraphs[0]
    p.text = "Left: Interactive Guided Breathing Studio (4-7-8, Box, Coherent) with Web Audio chimes and cycle counters.  |  Right: Recharts Progress Analytics showing 7-day emotional trajectories, mood donut distributions, and activity participation."
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = COLOR_PRIMARY_DARK

    # ==========================================
    # SLIDE 12: DATABASE DESIGN & DATA FLOW
    # ==========================================
    slide12 = prs.slides.add_slide(blank_layout)
    add_background(slide12)
    add_header(slide12, "Database Design & Collection Schemas")

    schemas = [
        ("Users Collection", [
            "_id: ObjectId (Unique Primary Key)",
            "name: String (User's display name)",
            "email: String (Indexed, unique, lowercase)",
            "password: String (Salted bcrypt hash)",
            "bio: String (Personal wellness bio)",
            "preferences: Object (reminders, audio)"
        ], Inches(0.8)),
        ("Mood Entries Collection", [
            "_id: ObjectId (Entry Primary Key)",
            "userId: ObjectId (Foreign key ref User)",
            "mood: String (6-state enum)",
            "score: Number (1-6 scale)",
            "notes: String (Optional reflections)",
            "tags: Array of Strings",
            "timestamp: ISODate (Date of check-in)"
        ], Inches(3.8)),
        ("Journal Entries Collection", [
            "_id: ObjectId (Journal Primary Key)",
            "userId: ObjectId (Foreign key ref User)",
            "title: String (Entry title)",
            "content: String (Rich reflection text)",
            "moodTag: String (Emotional context)",
            "tags: Array of Strings",
            "createdAt / updatedAt: ISODate"
        ], Inches(6.8)),
        ("Wellness Activities", [
            "_id: ObjectId (Activity Primary Key)",
            "userId: ObjectId (Foreign key ref User)",
            "name: String (e.g. 4-7-8 Breath)",
            "type: String (breathing, meditation)",
            "duration: Number (in seconds)",
            "completed: Boolean (Status)",
            "completedAt: ISODate"
        ], Inches(9.8))
    ]
    for s_name, fields, left in schemas:
        c = slide12.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, Inches(1.8), Inches(2.8), Inches(4.8))
        c.fill.solid()
        c.fill.fore_color.rgb = COLOR_CARD
        c.line.color.rgb = COLOR_BORDER
        tb = slide12.shapes.add_textbox(left + Inches(0.15), Inches(2.0), Inches(2.5), Inches(4.4))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = s_name
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = COLOR_PRIMARY_DARK
        for f in fields:
            pf = tf.add_paragraph()
            pf.text = f"\n• {f}"
            pf.font.size = Pt(10)
            pf.font.color.rgb = COLOR_TEXT_MAIN

    # ==========================================
    # SLIDE 13: SOURCE CODE IMPLEMENTATION EXCERPTS
    # ==========================================
    slide13 = prs.slides.add_slide(blank_layout)
    add_background(slide13)
    add_header(slide13, "Key Code Implementations: Safety & Audio")

    # Code Box 1: Crisis Guardrail
    c_code1 = slide13.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.8), Inches(5.7), Inches(4.8))
    c_code1.fill.solid()
    c_code1.fill.fore_color.rgb = RGBColor(15, 23, 42) # Slate 900
    c_code1.line.color.rgb = COLOR_PRIMARY
    tb_c1 = slide13.shapes.add_textbox(Inches(1.0), Inches(1.9), Inches(5.3), Inches(4.5))
    tf_c1 = tb_c1.text_frame
    tf_c1.word_wrap = True
    p = tf_c1.paragraphs[0]
    p.text = "// chatRoutes.js: Crisis Guardrail Regex\n"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = RGBColor(167, 139, 250)
    p.font.name = "Courier New"
    
    code1 = """const CRISIS_PATTERNS = [
  /suicid/i,
  /kill(ing)?\\s+(my|one)?self/i,
  /want\\s+to\\s+die/i,
  /end\\s+(my|this)\\s+life/i,
  /self[- ]?harm/i,
  /hurt(ing)?\\s+(my|one)?self/i,
  /cutt(ing)?\\s+myself/i
];

if (CRISIS_PATTERNS.some(p => p.test(msg))) {
  return res.json({
    reply: CRISIS_RESPONSE.message,
    isCrisis: true,
    actionSuggestions: [
      { label: 'Call Tele-MANAS (14416)',
        action: 'tel:14416' }
    ]
  });
}"""
    p2 = tf_c1.add_paragraph()
    p2.text = code1
    p2.font.size = Pt(10)
    p2.font.color.rgb = RGBColor(226, 232, 240)
    p2.font.name = "Courier New"

    # Code Box 2: Web Audio Synthesizer
    c_code2 = slide13.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.8), Inches(5.7), Inches(4.8))
    c_code2.fill.solid()
    c_code2.fill.fore_color.rgb = RGBColor(15, 23, 42)
    c_code2.line.color.rgb = COLOR_PRIMARY
    tb_c2 = slide13.shapes.add_textbox(Inches(7.0), Inches(1.9), Inches(5.3), Inches(4.5))
    tf_c2 = tb_c2.text_frame
    tf_c2.word_wrap = True
    p = tf_c2.paragraphs[0]
    p.text = "// audio.js: Web Audio API Oscillator\n"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = RGBColor(167, 139, 250)
    p.font.name = "Courier New"
    
    code2 = """playChime(type = 'inhale') {
  this.initContext();
  const osc = this.ctx.createOscillator();
  const gain = this.ctx.createGain();

  const freqMap = {
    inhale: 432, // Healing frequency
    hold: 528,   // Transformation
    exhale: 396  // Calming frequency
  };

  osc.type = 'sine';
  osc.frequency.setValueAtTime(
    freqMap[type], this.ctx.currentTime
  );
  gain.gain.linearRampToValueAtTime(
    0.15, this.ctx.currentTime + 0.1
  );
  osc.connect(gain);
  gain.connect(this.ctx.destination);
  osc.start();
}"""
    p2 = tf_c2.add_paragraph()
    p2.text = code2
    p2.font.size = Pt(10)
    p2.font.color.rgb = RGBColor(226, 232, 240)
    p2.font.name = "Courier New"

    # ==========================================
    # SLIDE 14: TESTING STRATEGY & VERIFIED RESULTS
    # ==========================================
    slide14 = prs.slides.add_slide(blank_layout)
    add_background(slide14)
    add_header(slide14, "Testing Strategy & Verified Verification Results")

    tests = [
        ("TC-01", "User Authentication", "Submit valid email & password", "JWT token returned, /dashboard opened", "PASSED"),
        ("TC-02", "Password Validation", "Register with password < 6 chars", "Validation error 400 displayed", "PASSED"),
        ("TC-03", "Daily Mood Check-In", "Select 'Happy' + factor tag", "Entry saved, Recharts graph updated", "PASSED"),
        ("TC-04", "Journal CRUD", "Write, read, edit & delete entry", "Operations persist with zero leaks", "PASSED"),
        ("TC-05", "Crisis Guardrail", "Input 'I feel like hurting myself'", "Immediate Tele-MANAS 14416 triggered", "PASSED"),
        ("TC-06", "Breathing Timer", "Select 4-7-8 breathing", "Animation cycles & chimes trigger", "PASSED"),
        ("TC-07", "Web Audio API", "Toggle ambient soundscapes", "Pink/brown noise plays in browser", "PASSED"),
        ("TC-08", "JSON Data Export", "Click 'Export My Data'", "Complete user JSON downloaded", "PASSED")
    ]
    top = Inches(1.8)
    for tid, mod, inp, exp, stat in tests:
        c = slide14.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), top, Inches(11.733), Inches(0.55))
        c.fill.solid()
        c.fill.fore_color.rgb = COLOR_CARD
        c.line.color.rgb = COLOR_BORDER
        tb = slide14.shapes.add_textbox(Inches(1.0), top + Inches(0.05), Inches(11.3), Inches(0.45))
        tf = tb.text_frame
        p = tf.paragraphs[0]
        p.text = f"{tid} | {mod:20} | Input: {inp:28} | Expected: {exp:35} | Status: "
        p.font.size = Pt(10)
        p.font.color.rgb = COLOR_TEXT_MAIN
        run = p.add_run()
        run.text = stat
        run.font.bold = True
        run.font.color.rgb = COLOR_EMERALD
        top += Inches(0.62)

    # ==========================================
    # SLIDE 15: CONCLUSION & FUTURE SCOPE
    # ==========================================
    slide15 = prs.slides.add_slide(blank_layout)
    add_background(slide15)
    add_header(slide15, "Project Conclusion & Future Horizons")

    c_left15 = slide15.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.8), Inches(5.6), Inches(4.8))
    c_left15.fill.solid()
    c_left15.fill.fore_color.rgb = COLOR_CARD
    c_left15.line.color.rgb = COLOR_BORDER
    tb_l15 = slide15.shapes.add_textbox(Inches(1.1), Inches(2.0), Inches(5.0), Inches(4.4))
    tf_l15 = tb_l15.text_frame
    tf_l15.word_wrap = True
    p = tf_l15.paragraphs[0]
    p.text = "Key Project Achievements"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = COLOR_PRIMARY_DARK

    achievements = [
        "✔ Delivered a commercial-grade mental wellness web application (Case 59).",
        "✔ Implemented 100% working features: moods, private journals, AI companion, breathing, analytics.",
        "✔ Zero-latency in-browser sound synthesis using Web Audio API.",
        "✔ Ethical crisis guardrails protecting vulnerable users with verified helplines.",
        "✔ Robust dual-database engine enabling instant out-of-the-box local execution."
    ]
    for ach in achievements:
        pa = tf_l15.add_paragraph()
        pa.text = f"\n{ach}"
        pa.font.size = Pt(12)
        pa.font.color.rgb = COLOR_TEXT_MAIN

    # Right: Future Scope & Thank You
    c_r15 = slide15.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.8), Inches(5.7), Inches(4.8))
    c_r15.fill.solid()
    c_r15.fill.fore_color.rgb = COLOR_PRIMARY_DARK
    c_r15.line.color.rgb = COLOR_PRIMARY_DARK
    tb_r15 = slide15.shapes.add_textbox(Inches(7.1), Inches(2.0), Inches(5.1), Inches(4.4))
    tf_r15 = tb_r15.text_frame
    tf_r15.word_wrap = True
    p = tf_r15.paragraphs[0]
    p.text = "Future Scope & Roadmap"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = RGBColor(216, 180, 254)

    future = [
        "• Native Mobile App development with React Native & offline synchronization.",
        "• Wearable integration (Smartwatches for heart-rate variability & stress detection).",
        "• Multilingual crisis helpline routing based on user geolocation.",
        "• Opt-in encrypted counselor portal for voluntary therapist review."
    ]
    for fut in future:
        pf = tf_r15.add_paragraph()
        pf.text = f"\n{fut}"
        pf.font.size = Pt(11)
        pf.font.color.rgb = RGBColor(243, 232, 255)

    p_ty = tf_r15.add_paragraph()
    p_ty.text = "\n\nThank You!"
    p_ty.font.size = Pt(24)
    p_ty.font.bold = True
    p_ty.font.color.rgb = RGBColor(255, 255, 255)

    prs.save(PPTX_OUTPUT)
    print(f"✅ PowerPoint presentation generated at: {PPTX_OUTPUT}")

if __name__ == '__main__':
    create_deck()

