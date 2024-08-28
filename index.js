import { catsData } from '/data.js'

const emotionCheckboxes = document.getElementById('emotion-checkboxes')
const getImageBtn = document.getElementById('get-image-btn')
const gifsOnlyOption = document.getElementById('gifs-only-option')
const memeModalInner = document.getElementById('meme-modal-inner')
const memeModal = document.getElementById('meme-modal')
const memeModalCloseBtn = document.getElementById('meme-modal-close-btn')
const themeToggleBtn = document.getElementById('theme-toggle-btn')
const getRandomBtn = document.getElementById('get-random-btn')
const emotionSearch = document.getElementById('emotion-search')

const MAX_SELECTED_EMOTIONS = 3

emotionCheckboxes.addEventListener('change', handleEmotionSelection)
memeModalCloseBtn.addEventListener('click', closeModal)
getImageBtn.addEventListener('click', renderCats)
themeToggleBtn.addEventListener('click', toggleTheme)
getRandomBtn.addEventListener('click', renderRandomCat)
emotionSearch.addEventListener('input', filterEmotions)

function renderEmotionsCheckboxes(cats) {
    let emotionOptions = ''
    const emotions = getUniqueEmotions(cats)

    for (const emotion of emotions) {
        emotionOptions += `
        <div class="checkbox">
            <label for="${emotion}">${emotion}</label>
            <input
            type="checkbox"
            id="${emotion}"
            name="emotions"
            value="${emotion}">
        </div>`
    }
    emotionCheckboxes.innerHTML = emotionOptions
}

function getUniqueEmotions(cats) {
    const emotionsArray = cats.map(cat => cat.emotionTags).flat()
    const uniqueEmotions = [...new Set(emotionsArray)]
    return uniqueEmotions
}

function handleEmotionSelection(e) {
    const selectedCheckboxes = document.querySelectorAll('input[type="checkbox"]:checked')
    const selectedEmotionCount = selectedCheckboxes.length

    if (selectedEmotionCount > MAX_SELECTED_EMOTIONS) {
        e.target.checked = false
        alert(`You can only select up to ${MAX_SELECTED_EMOTIONS} emotions.`)
    } else {
        highlightSelectedOptions(selectedCheckboxes)
    }
}

function highlightSelectedOptions(selectedCheckboxes) {
    const checkboxes = document.querySelectorAll('.checkbox')
    for (const checkbox of checkboxes) {
        checkbox.classList.remove('selected')
    }
    selectedCheckboxes.forEach(checkbox => {
        checkbox.parentElement.classList.add('selected')
    })
}

function renderCats() {
    const selectedEmotions = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(checkbox => checkbox.value)
    const isGif = gifsOnlyOption.checked

    if (selectedEmotions.length > 0) {
        const matchingCats = catsData.filter(cat => selectedEmotions.some(emotion => cat.emotionTags.includes(emotion)) && (isGif ? cat.isGif : true))
        const randomCat = matchingCats[Math.floor(Math.random() * matchingCats.length)]

        memeModalInner.innerHTML = `<img class="cat-img" src="./images/${randomCat.image}" alt="${randomCat.alt}">`
        memeModal.style.display = 'flex'
    }
}

function closeModal() {
    memeModal.style.display = 'none'
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode')
}

function renderRandomCat() {
    const randomCat = catsData[Math.floor(Math.random() * catsData.length)]

    memeModalInner.innerHTML = `<img class="cat-img" src="./images/${randomCat.image}" alt="${randomCat.alt}">`
    memeModal.style.display = 'flex'
}

function filterEmotions() {
    const query = emotionSearch.value.toLowerCase()
    const filteredCats = catsData.filter(cat => cat.emotionTags.some(tag => tag.includes(query)))

    renderEmotionsCheckboxes(filteredCats)
}

renderEmotionsCheckboxes(catsData)
