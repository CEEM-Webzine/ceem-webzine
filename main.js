// CEEM Webzine - Main JavaScript (v1.1.0)
document.addEventListener('DOMContentLoaded', function() {
    console.log('CEEM Webzine v1.1.0 loaded');

    // 1. [파라미터 확인] 주소창의 ?issue= 값을 확인하여 불러올 파일을 결정합니다.
    const urlParams = new URLSearchParams(window.location.search);
    const selectedIssue = urlParams.get('issue');
    const dataFile = selectedIssue ? `archives/${selectedIssue}.json` : 'data.json';
    
    console.log('불러올 파일 경로:', dataFile);

    // 2. [데이터 로딩] 결정된 JSON 파일을 불러옵니다.
    fetch(dataFile)
        .then(response => {
            if (!response.ok) throw new Error('파일을 찾을 수 없습니다.');
            return response.json();
        })
        .then(data => {
            renderWebzine(data); // 웹진 화면 그리기
            setupAnimations();    // 애니메이션 적용
        })
        .catch(error => {
            console.error('Error loading webzine data:', error);
            // 아카이브 로딩 실패 시 기본 data.json으로 복구 시도 (선택 사항)
            if (selectedIssue) window.location.href = window.location.pathname;
        });

    // 3. [렌더링 함수] 데이터를 받아 화면을 구성합니다. (레이아웃 강제 유지 로직)
    function renderWebzine(data) {
        // [A] 호수 정보 및 에디터 노트 업데이트
        if (data.issueInfo) {
            document.querySelector('.issue-number').textContent = `${data.issueInfo.vol} | ${data.issueInfo.issue}`;
            document.querySelector('.issue-date').textContent = data.issueInfo.date;
            const noteElement = document.getElementById('editors-note-text');
            if (noteElement && data.issueInfo.editorsNote) {
                noteElement.textContent = data.issueInfo.editorsNote;
            }
        }

        // [B] 논문 리스트 업데이트
        const container = document.getElementById('papers-container');
        if (container && data.papers) {
            container.innerHTML = ''; 

            data.papers.forEach(paper => {
                // 배지 생성 (JSON에 적힌 그대로 생성)
                const badgesHTML = paper.badges.map(badge => 
                    `<span class="badge badge-${badge}">${badge.replace(/-/g, ' ')}</span>`
                ).join('');

                // reverse 설정 확인 (데이터에 적힌 명령 그대로 실행)
                const isReverse = paper.reverse === true;

                // 논문 카드 HTML 생성 (현재의 세련된 레이아웃 틀 고정)
                const paperHTML = `
                    <article class="paper-card">
                        <div class="paper-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; width: 100%;">
                            <div class="paper-badges">${badgesHTML}</div>
                            <div class="paper-meta" style="color: #4a90e2; font-weight: 500;">
                                <span>Clin Exp Emerg Med</span> • <span>${paper.yearInfo}</span>
                            </div>
                        </div>
                        
                        <div class="paper-content" style="display: flex; flex-direction: ${isReverse ? 'row-reverse' : 'row'}; gap: 30px; align-items: flex-start;">
                            <div class="paper-text" style="flex: 1.2;">
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
                                <div class="paper-actions">
                                    <button class="btn btn-primary" onclick="window.open('${paper.doiLink}', '_blank')">Full Text</button>
                                    <button class="btn btn-secondary" onclick="window.open('${paper.doiLink}', '_blank')">View PDF</button>
                                </div>
                            </div>
                            <div class="paper-visual" style="flex: 0.8; text-align: center;">
                                <img src="${paper.image}" alt="${paper.title}" class="paper-image" style="width: 100%; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                                <p class="visual-caption" style="margin-top: 10px; font-style: italic; color: #666;">${paper.caption}</p>
                            </div>
                        </div>
                    </article>
                `;
                container.insertAdjacentHTML('beforeend', paperHTML);
            });
        }
    }
    
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
    
    // Add animation on scroll
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
