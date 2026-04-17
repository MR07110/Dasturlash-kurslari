// ============================================
// CSS KURSI - UMUMIY JAVASCRIPT
// Barcha 63 ta dars uchun
// Learncode.uz
// ============================================

'use strict';

// ==================== SAHIFA YUKLANGANDA ====================
document.addEventListener('DOMContentLoaded', function() {
    initTest();
    initPractice();
    initLessonConfig();
    initActiveLinks();
    initSmoothScroll();
    initCopyCode();
    initBackToTop();
});

// ==================== TEST FUNKSIYASI ====================
function initTest() {
    const checkBtn = document.getElementById('checkAnswers');
    if (!checkBtn) return;
    
    checkBtn.addEventListener('click', function() {
        const questions = document.querySelectorAll('.test-question');
        const resultDiv = document.getElementById('testResult');
        
        if (!resultDiv) return;
        
        // Dars ID sini olish
        const lessonId = window.LessonConfig?.lessonId || '1';
        
        // Darsga qarab to'g'ri javoblarni aniqlash
        let correctAnswers = {};
        
        // 1-5 darslar uchun to'g'ri javoblar (script da)
        const answersMap = {
            '1': { 'q1': 'b', 'q2': 'b', 'q3': 'c' },
            '2': { 'q1': 'c', 'q2': 'b', 'q3': 'b' },
            '3': { 'q1': 'c', 'q2': 'b', 'q3': 'c' },
            '4': { 'q1': 'b', 'q2': 'd', 'q3': 'b' },
            '5': { 'q1': 'b', 'q2': 'c', 'q3': 'b', 'q4': 'c', 'q5': 'd' }
        };
        
        // Agar dars 1-5 oralig'ida bo'lsa, tayyor javoblarni olish
        if (answersMap[lessonId]) {
            correctAnswers = answersMap[lessonId];
        } else {
            // 6-darsdan boshlab HTML dan o'qish
            const answerScript = document.getElementById('testAnswers');
            if (answerScript) {
                try {
                    correctAnswers = JSON.parse(answerScript.textContent);
                } catch (e) {
                    console.error('Test javoblarini o\'qishda xatolik:', e);
                }
            }
        }
        
        let answered = 0;
        let correct = 0;
        const total = questions.length;
        
        questions.forEach((question) => {
            const radioName = question.querySelector('input[type="radio"]')?.name;
            const selected = question.querySelector('input[type="radio"]:checked');
            
            if (selected) {
                answered++;
                
                // To'g'ri javobni tekshirish
                if (correctAnswers[radioName] && selected.value === correctAnswers[radioName]) {
                    correct++;
                }
            }
        });
        
        // Agar javoblar yetarli bo'lmasa
        if (answered < total) {
            resultDiv.textContent = `Iltimos, barcha ${total} ta savolga javob bering!`;
            resultDiv.className = 'test-result show failed';
            return;
        }
        
        // Natijani ko'rsatish
        if (correct === total) {
            resultDiv.textContent = `🎉 Ajoyib! ${correct}/${total} to'g'ri javob. Siz darsni yaxshi tushundingiz!`;
            resultDiv.className = 'test-result show passed';
        } else {
            resultDiv.textContent = `📝 Siz ${correct}/${total} to'g'ri javob berdingiz. Videoni qayta ko'rib chiqishni tavsiya qilamiz.`;
            resultDiv.className = 'test-result show failed';
        }
    });
}

// ==================== AMALIY MASHQ ====================
function initPractice() {
    const solutionBtn = document.getElementById('showSolution');
    if (!solutionBtn) return;
    
    const panel = document.getElementById('solutionPanel');
    
    solutionBtn.addEventListener('click', function() {
        if (panel.classList.contains('show')) {
            panel.classList.remove('show');
            solutionBtn.innerHTML = '<i class="fas fa-eye"></i> Yechimni ko\'rish';
        } else {
            panel.classList.add('show');
            solutionBtn.innerHTML = '<i class="fas fa-eye-slash"></i> Yechimni yashirish';
        }
    });
}

// ==================== DARS KONFIGURATSIYASI ====================
function initLessonConfig() {
    const configScript = document.getElementById('lessonConfig');
    if (!configScript) {
        if (window.LessonConfig) {
            console.log('✅ LessonConfig yuklandi:', window.LessonConfig);
        }
        return;
    }
    
    try {
        const config = JSON.parse(configScript.textContent);
        window.LessonConfig = config;
        console.log('✅ LessonConfig yuklandi:', config);
    } catch (e) {
        console.error('❌ Lesson config xatolik:', e);
    }
}

// ==================== ACTIVE SIDEBAR LINKS ====================
function initActiveLinks() {
    const sections = document.querySelectorAll(`
        section[id], 
        .test-block[id], 
        .practice-block[id], 
        .lesson-summary[id], 
        .comments-section[id]
    `);
    const navLinks = document.querySelectorAll('.sidebar-outline a');
    
    if (sections.length === 0 || navLinks.length === 0) return;
    
    function updateActiveLink() {
        let current = '';
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href && href.substring(1) === current) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink();
}

// ==================== SMOOTH SCROLL ====================
function initSmoothScroll() {
    document.querySelectorAll('.sidebar-outline a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ==================== KOD NUSXALASH ====================
function initCopyCode() {
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const codeBlock = this.closest('.code-block');
            if (!codeBlock) return;
            
            const code = codeBlock.querySelector('code')?.textContent || 
                        codeBlock.querySelector('pre')?.textContent || '';
            
            navigator.clipboard?.writeText(code).then(() => {
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i> Nusxalandi!';
                setTimeout(() => {
                    this.innerHTML = originalText;
                }, 2000);
            }).catch(() => {
                alert('Kodni nusxalashda xatolik yuz berdi');
            });
        });
    });
}

// ==================== BACK TO TOP ====================
function initBackToTop() {
    // Sahifa pastga tushganda ko'rinadigan tugma
    const backBtn = document.createElement('button');
    backBtn.className = 'back-to-top';
    backBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backBtn.setAttribute('aria-label', 'Yuqoriga qaytish');
    document.body.appendChild(backBtn);
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backBtn.classList.add('show');
        } else {
            backBtn.classList.remove('show');
        }
    });
    
    backBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ==================== CSS qo'shish (back-to-top uchun) ====================
const style = document.createElement('style');
style.textContent = `
    .back-to-top {
        position: fixed;
        bottom: 24px;
        right: 24px;
        width: 44px;
        height: 44px;
        background: var(--primary-gradient);
        color: white;
        border: none;
        border-radius: var(--radius-full);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transform: translateY(10px);
        transition: all var(--transition-base);
        box-shadow: var(--shadow-primary);
        z-index: 99;
    }
    
    .back-to-top.show {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
    }
    
    .back-to-top:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(59, 130, 246, 0.3);
    }
    
    /* Pros/Cons grid */
    .pros-cons-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--spacing-lg);
        margin: var(--spacing-lg) 0;
    }
    
    .pros-box, .cons-box {
        padding: var(--spacing-lg);
        border-radius: var(--radius-lg);
    }
    
    .pros-box {
        background: var(--success-bg);
        border-left: 4px solid var(--success);
    }
    
    .cons-box {
        background: var(--danger-bg);
        border-left: 4px solid var(--danger);
    }
    
    .pros-box h4, .cons-box h4 {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        margin-bottom: var(--spacing-md);
    }
    
    .pros-box h4 i { color: var(--success); }
    .cons-box h4 i { color: var(--danger); }
    
    .pros-box ul, .cons-box ul {
        margin: 0;
        padding-left: var(--spacing-lg);
    }
    
    /* Tips list */
    .tips-list {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-md);
        margin: var(--spacing-lg) 0;
    }
    
    .tip-item {
        display: flex;
        gap: var(--spacing-md);
        padding: var(--spacing-md);
        background: var(--glass-bg);
        border-radius: var(--radius-md);
        border: 1px solid var(--card-border);
    }
    
    .tip-icon {
        width: 32px;
        height: 32px;
        background: var(--primary);
        color: white;
        border-radius: var(--radius-full);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        flex-shrink: 0;
    }
    
    .tip-content {
        flex: 1;
    }
    
    .tip-content strong {
        display: block;
        margin-bottom: 4px;
    }
    
    .tip-content p {
        margin: 0;
        font-size: 0.9rem;
        color: var(--text-muted);
    }
    
    /* Responsive */
    @media (max-width: 768px) {
        .pros-cons-grid {
            grid-template-columns: 1fr;
        }
        
        .back-to-top {
            bottom: 16px;
            right: 16px;
            width: 40px;
            height: 40px;
        }
    }
`;
document.head.appendChild(style);

// ==================== KONSOL MA'LUMOTI ====================
console.log('%c🎨 CSS Kurs | Learncode.uz', 'color: #3b82f6; font-weight: bold; font-size: 14px;');
console.log('%c📚 Barcha darslar uchun umumiy script yuklandi', 'color: #64748b; font-size: 12px');
