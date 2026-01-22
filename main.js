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

}();
