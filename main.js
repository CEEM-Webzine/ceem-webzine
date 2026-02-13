// CEEM Webzine - Main JavaScript (v1.2.0)
document.addEventListener('DOMContentLoaded', function() {
    console.log('CEEM Webzine v1.2.0 loaded');

    // 1. [경로 결정] 주소창 파라미터가 있으면 아카이브, 없으면 data.json
    const urlParams = new URLSearchParams(window.location.search);
    const selectedIssue = urlParams.get('issue');
    const dataFile = selectedIssue ? `archives/${selectedIssue}.json` : 'data.json';
    
    console.log('Fetching:', dataFile);

    // 2. [데이터 로딩] 단 한 번의 fetch로 모든 것을 해결합니다.
    fetch(dataFile)
        .then(response => {
            if (!response.ok) throw new Error('파일을 찾을 수 없습니다.');
            return response.json();
        })
        .then(data => {
            // [A] 상단 호수 및 에디터 노트 업데이트
            updateIssueInfo(data.issueInfo);
            // [B] 논문 리스트 생성 (데이터 기반 레이아웃 유지)
            renderPapers(data.papers);
            // [C] 애니메이션 효과 적용
            setupAnimations();
        })
        .catch(error => console.error('Data loading failed:', error));

    // --- 내부 기능 함수들 ---

    function updateIssueInfo(info) {
        if (!info) return;
        document.querySelector('.issue-number').textContent = `${info.vol} | ${info.issue}`;
        document.querySelector('.issue-date').textContent = info.date;
        const noteElement = document.getElementById('editors-note-text');
        if (noteElement) noteElement.textContent = info.editorsNote;
    }

    function renderPapers(papers) {
        const container = document.getElementById('papers-container');
        if (!container || !papers) return;
        container.innerHTML = ''; // 초기화

        papers.forEach(paper => {
            const badgesHTML = paper.badges.map(b => 
                `<span class="badge badge-${b}">${b.replace(/-/g, ' ')}</span>`
            ).join('');

            const isReverse = paper.reverse === true;

            const paperHTML = `
                <article class="paper-card">
                    <div class="paper-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
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
                            <p class="visual-caption" style="margin-top: 10px; font-style: italic;">${paper.caption}</p>
                        </div>
                    </div>
                </article>
            `;
            container.insertAdjacentHTML('beforeend', paperHTML);
        });
    }

    function setupAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.paper-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    }

    // 공용 이벤트 리스너 (Smooth Scroll)
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });
});

// 전역 공유 함수
window.printNewsletter = () => window.print();
window.shareNewsletter = () => {
    if (navigator.share) {
        navigator.share({ title: 'CEEM Webzine', url: window.location.href });
    } else {
        navigator.clipboard.writeText(window.location.href);
        alert('링크가 복사되었습니다!');
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
