// CEEM Webzine - Main JavaScript

// Smooth scroll functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('CEEM Webzine loaded successfully');
    
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
