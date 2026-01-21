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

}();
