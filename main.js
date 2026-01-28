void function() {
    "use strict"

    const $ = sel => document.querySelector(sel)
    const $$ = sel => Array.from(document.querySelectorAll(sel))
    Node.prototype.on = Node.prototype.addEventListener

    const modeCards = $$('.mode-card')
    const modeImages = $$('[data-mode-image]')

    function activateMode(mode) {
        modeCards.forEach(card => card.classList.toggle('active', card.dataset.mode === mode))
        modeImages.forEach(img => {
            const visible = img.dataset.modeImage === mode
            img.hidden = !visible
        })
    }

    modeCards.forEach(card => {
        card.on('click', () => activateMode(card.dataset.mode))
    })

    if (modeCards.length) {
        activateMode(modeCards[0].dataset.mode)
    }

    const langKey = "flat:language"
    const languages = [
        { key: "zh-CN", name: "简体中文" },
        { key: "en", name: "English" },
    ]
    const langHref = {
        "zh-CN": "/",
        "en": "/en/",
    }
    const currentLanguage = location.pathname.split("/").filter(Boolean)[0] || "zh-CN"
    
    // i18n 功能：更新所有带有 data-zh 和 data-en 属性的元素
    function updateI18n(lang) {
        // 判断语言：如果是 "en" 则使用英文，否则使用中文
        const isEnglish = lang === "en"
        const langKey = isEnglish ? "en" : "zh"
        const elements = $$('[data-zh], [data-en]')
        elements.forEach(el => {
            const text = el.getAttribute(`data-${langKey}`)
            if (text) {
                el.textContent = text
            }
        })
    }
    
    // 初始化时更新i18n
    updateI18n(currentLanguage)

    let select = $('#lang')
    if (select) {
        select.innerHTML = ""
        languages.forEach(({ key, name }) => {
            const option = document.createElement('option')
            option.value = key
            option.textContent = name
            select.append(option)
        })
        select.value = currentLanguage

        select.on('change', (e) => {
            const language = e.target.value
            localStorage.setItem(langKey, language)
            updateI18n(language)
            window.location.href = langHref[language]
        })
    }

    // 定价标签页切换
    const pricingTabs = $$('.pricing-tab')
    const pricingContents = $$('.pricing-content')
    
    function switchPricingTab(tabName) {
        pricingTabs.forEach(tab => {
            if (tab.dataset.tab === tabName) {
                tab.classList.add('active')
            } else {
                tab.classList.remove('active')
            }
        })
        pricingContents.forEach(content => {
            if (content.id === tabName) {
                content.classList.add('active')
            } else {
                content.classList.remove('active')
            }
        })
    }
    
    if (pricingTabs.length) {
        pricingTabs.forEach(tab => {
            tab.on('click', (e) => {
                e.preventDefault()
                switchPricingTab(tab.dataset.tab)
            })
        })
    }

    // macOS 下载模态框
    const macDownloadCard = $('#macDownloadCard')
    const macDownloadModal = $('#macDownloadModal')
    const macDownloadModalClose = $('#macDownloadModalClose')

    if (macDownloadCard && macDownloadModal) {
        macDownloadCard.on('click', (e) => {
            e.preventDefault()
            macDownloadModal.classList.add('active')
        })
    }

    if (macDownloadModalClose) {
        macDownloadModalClose.on('click', () => {
            macDownloadModal.classList.remove('active')
        })
    }

    // 点击模态框背景关闭
    if (macDownloadModal) {
        macDownloadModal.on('click', (e) => {
            if (e.target === macDownloadModal) {
                macDownloadModal.classList.remove('active')
            }
        })
    }

    // 移动端菜单切换
    const mobileMenuToggle = $('#mobileMenuToggle')
    const mainNav = $('#mainNav')
    
    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.on('click', () => {
            const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true'
            mobileMenuToggle.setAttribute('aria-expanded', !isExpanded)
            mainNav.classList.toggle('active')
            document.body.style.overflow = !isExpanded ? 'hidden' : ''
        })
        
        // 点击菜单链接后关闭菜单并滚动到对应位置
        const navLinks = mainNav.querySelectorAll('a')
        navLinks.forEach(link => {
            link.on('click', (e) => {
                e.preventDefault()
                e.stopPropagation()
                
                const href = link.getAttribute('href')
                if (!href) return
                
                // 如果是锚点链接
                if (href.startsWith('#')) {
                    const targetId = href.substring(1)
                    const targetElement = document.getElementById(targetId) || document.querySelector(`[id="${targetId}"]`)
                    
                    // 先关闭菜单
                    mobileMenuToggle.setAttribute('aria-expanded', 'false')
                    mainNav.classList.remove('active')
                    document.body.style.overflow = ''
                    
                    // 等待菜单关闭动画完成后再滚动
                    setTimeout(() => {
                        if (targetElement) {
                            const headerHeight = document.querySelector('.site-header')?.offsetHeight || 0
                            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20
                            
                            window.scrollTo({
                                top: Math.max(0, targetPosition),
                                behavior: 'smooth'
                            })
                        } else {
                            // 如果没有找到目标元素，使用默认的锚点跳转
                            window.location.href = href
                        }
                    }, 350) // 等待菜单关闭动画（0.3s）+ 额外缓冲
                } else {
                    // 非锚点链接，直接跳转
                    window.location.href = href
                }
            })
        })
        
        // 点击遮罩层关闭菜单（但不阻止链接点击）
        mainNav.on('click', (e) => {
            // 如果点击的是遮罩层本身（不是链接），才关闭菜单
            if (e.target === mainNav || (e.target.classList.contains('site-nav') && !e.target.closest('a'))) {
                mobileMenuToggle.setAttribute('aria-expanded', 'false')
                mainNav.classList.remove('active')
                document.body.style.overflow = ''
            }
        })
    }

}();
