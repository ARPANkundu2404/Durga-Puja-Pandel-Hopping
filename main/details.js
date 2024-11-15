const languageToggle = document.getElementById('languageToggle');
const bengaliContent = document.getElementById('bengalicontent');
const englishContent = document.getElementById('englishcontent');
const bengaliIcon = document.getElementById('bengaliIcon');
const englishIcon = document.getElementById('englishIcon');

languageToggle.addEventListener('change', () => {
    if(languageToggle.checked){
        bengaliContent.classList.add('hidden');
        englishContent.classList.remove('hidden');
        bengaliIcon.classList.remove('hidden');
        englishIcon.classList.add('hidden');
    }
    else{
        englishContent.classList.add('hidden');
        englishIcon.classList.remove('hidden');
        bengaliContent.classList.remove('hidden');
        bengaliIcon.classList.add('hidden');
    }
})