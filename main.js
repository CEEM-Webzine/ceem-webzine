// CEEM Webzine - Main JavaScript

// Smooth scroll functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('CEEM Webzine loaded successfully');

    // 1. [체크] 주소창에 ?issue=값이 있는지 먼저 확인합니다.
    const urlParams = new URLSearchParams(window.location.search);
    const selectedIssue = urlParams.get('issue');
    
    // 2. [결정] 값이 있으면 archives 폴더를 보고, 없으면 기본 data.json을 봅니다.
    const dataFile = selectedIssue ? `archives/${selectedIssue}.json` : 'data.json';
    
    console.log('불러올 파일 경로:', dataFile); // 브라우저 콘솔(F12)에서 확인용

    function formatBadgeText(slug) {
        const customLabels = {
            'editor': "Editor's Choice",
            'ems': "EMS",
            'digital-health': "Digital health & Informatics",
            'review': "Review article",
            'case': "Case report"
        };
        if (customLabels[slug]) return customLabels[slug];
        // 첫 단어만 대문자, 나머지는 소문자
        const words = slug.split('-').map(word => word.toLowerCase());
        words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
        return words.join(' ');
    }

    // 3. 단일 fetch로 통합 - dataFile 변수를 사용하여 현재호/과거호 모두 처리합니다.
    fetch(dataFile)
        .then(response => {
            if (!response.ok) throw new Error('파일을 찾을 수 없습니다.');
            return response.json();
        })
        .then(data => {
            // [A] 호수 정보 및 에디터 노트 업데이트
            if (data.issueInfo) {
                document.querySelector('.issue-number').textContent = `${data.issueInfo.vol} | ${data.issueInfo.issue}`;
                document.querySelector('.issue-date').textContent = data.issueInfo.date;
                const noteElement = document.getElementById('editors-note-text');
                if (noteElement && data.issueInfo.editorsNote) {
                    noteElement.textContent = data.issueInfo.editorsNote;
                }
            }

            // [B] 논문 리스트 생성
            const container = document.getElementById('papers-container');
            if (container && data.papers) {
                container.innerHTML = ''; // 초기화
                data.papers.forEach(paper => {
                    const paperHTML = `
                        <article class="paper-card">
                            <div class="paper-header">
                                <div class="badges">
                                    ${paper.badges.map(b => `<span class="badge badge-${b}">${formatBadgeText(b)}</span>`).join('')}
                                </div>
                                <div class="paper-meta">
                                    <span class="journal-name">${paper.journal || 'Clin Exp Emerg Med'}</span>
                                    <span class="separator">•</span>
                                    <span class="year">${paper.yearInfo}</span>
                                </div>
                            </div>
                            <div class="paper-content ${paper.reverse ? 'reverse' : ''}">
                                <div class="paper-text">
                                    <h3 class="paper-title">${paper.title}</h3>
                                    <p class="paper-authors">${paper.author}</p>
                                    <div class="paper-summary">
                                        <h4>Abstract</h4>
                                        <p>${paper.abstract}</p>
                                    </div>
                                    <div class="pearl-box">
                                        <span class="pearl-label">PEARL</span>
                                        <p>"${paper.pearl}"</p>
                                    </div>
                                    <div class="citation-tip">
                                        <span class="citation-tip-label">💬 Citation Tip</span>
                                        <p>${paper.author}. ${paper.title}. <em>${paper.journal || 'Clin Exp Emerg Med'}</em>. ${paper.yearInfo}. <a href="${paper.doiLink}" target="_blank">${paper.doiLink}</a></p>
                                    </div>
                                    <div class="paper-actions">
                                        <button class="btn btn-primary" onclick="window.open('${paper.doiLink}', '_blank')">Full Text</button>
                                        <button class="btn btn-secondary" onclick="window.open('${paper.doiLink}', '_blank')">View PDF</button>
                                    </div>
                                </div>
                                <div class="paper-visual">
                                    <img src="${paper.image}" alt="${paper.title}" class="paper-image">
                                    <br> <p class="visual-caption">${paper.caption}</p>
                                </div>
                            </div>
                        </article>`;
                    container.innerHTML += paperHTML;
                });

                // 데이터가 생성된 후 애니메이션 효과(Observer) 적용
                setupAnimations();
            }
        })
        .catch(error => console.error('Error loading webzine data:', error));

    // Add smooth scrolling to all links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Subscribe button functionality
    const subscribeBtn = document.querySelector('.btn-subscribe');
    if (subscribeBtn) {
        subscribeBtn.addEventListener('click', function() {
            const email = prompt('뉴스레터를 받으실 이메일 주소를 입력해주세요:');
            if (email && validateEmail(email)) {
                alert('구독 신청이 완료되었습니다! 감사합니다.');
                console.log('Subscription requested for:', email);
            } else if (email) {
                alert('올바른 이메일 주소를 입력해주세요.');
            }
        });
    }
    
    // Image placeholder click handler (for future image upload functionality)
    const imagePlaceholders = document.querySelectorAll('.image-placeholder');
    imagePlaceholders.forEach(placeholder => {
        placeholder.addEventListener('click', function() {
            console.log('Image placeholder clicked - ready for image upload');
            // Future: Add image upload or selection functionality here
        });
    });
    
    // Add hover effect to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Print functionality
    window.printNewsletter = function() {
        window.print();
    };
    
    // Share functionality
    window.shareNewsletter = function() {
        if (navigator.share) {
            navigator.share({
                title: 'CEEM Webzine',
                text: 'Check out the latest research highlights from CEEM',
                url: window.location.href
            }).catch(err => console.log('Error sharing:', err));
        } else {
            // Fallback for browsers that don't support Web Share API
            const url = window.location.href;
            navigator.clipboard.writeText(url).then(() => {
                alert('링크가 클립보드에 복사되었습니다!');
            });
        }
    };
    
    // Track paper link clicks (for analytics)
    const paperLinks = document.querySelectorAll('.paper-actions .btn');
    paperLinks.forEach((link, index) => {
        link.addEventListener('click', function(e) {
            const paperCard = this.closest('.paper-card');
            const paperTitle = paperCard.querySelector('.paper-title').textContent;
            console.log(`Paper link clicked: ${paperTitle}`);
            // Future: Add analytics tracking here
        });
    });
    
    // Add loading state for buttons
    function addLoadingState(button) {
        const originalText = button.textContent;
        button.textContent = 'Loading...';
        button.disabled = true;
        
        setTimeout(() => {
            button.textContent = originalText;
            button.disabled = false;
        }, 1000);
    }
    
    // Responsive navigation (for future mobile menu)
    let lastScroll = 0;
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        const header = document.querySelector('.header');
        
        if (currentScroll > lastScroll && currentScroll > 100) {
            // Scrolling down
            header.style.transform = 'translateY(-10px)';
            header.style.opacity = '0.95';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
            header.style.opacity = '1';
        }
        
        lastScroll = currentScroll;
    });
});

// 애니메이션 설정 함수 - fetch 완료 후 동적으로 생성된 카드에 적용
function setupAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all paper cards
    const paperCards = document.querySelectorAll('.paper-card');
    paperCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// Email validation helper
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Export functions for external use
window.CEEM = {
    printNewsletter: function() {
        window.print();
    },
    shareNewsletter: function() {
        window.shareNewsletter();
    },
    version: '1.0.0'
};

console.log('%c CEEM Webzine v1.0.0 ', 'background: #1A2A6C; color: white; padding: 5px 10px; border-radius: 3px;');
console.log('Built with ❤️ for Clinical Excellence in Emergency Medicine');


