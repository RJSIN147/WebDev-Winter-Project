let allArticles = [];
const newsContainer = document.getElementById('news-container');
const apiKey = 'ccc3bada5e754e179ff2a3f6920f77a4';

const positiveWords = [
    'good', 'great', 'excellent', 'positive', 'fortunate', 'correct', 'superior',
    'happy', 'joyful', 'delightful', 'amazing', 'wonderful', 'fantastic', 'favorable',
    'outstanding', 'brilliant', 'successful', 'pleased', 'satisfied', 'content',
    'cheerful', 'optimistic', 'encouraging', 'promising', 'beneficial', 'advantageous',
    'profitable', 'rewarding', 'commendable', 'praiseworthy', 'notable', 'remarkable',
    'impressive', 'incredible', 'awesome', 'spectacular', 'thrilling', 'uplifting'
];
const negativeWords = [
    'bad', 'poor', 'negative', 'unfortunate', 'wrong', 'inferior', 'terrible',
    'sad', 'unhappy', 'miserable', 'awful', 'horrible', 'dreadful', 'disappointing',
    'unsuccessful', 'dismal', 'depressing', 'pessimistic', 'discouraging', 'unfavorable',
    'harmful', 'damaging', 'detrimental', 'unprofitable', 'regrettable', 'lamentable',
    'criticized', 'condemned', 'notorious', 'infamous', 'shameful', 'disgraceful',
    'appalling', 'frightening', 'alarming', 'disturbing', 'troubling', 'worrying'
];
async function fetchNews() {
    try {
        const response = await fetch(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`);
        const data = await response.json();
        allArticles = data.articles;
        displayNews(allArticles);
    } catch (error) {
        console.error('Error fetching news:', error);
    }
}

function displayNews(articles) {
    newsContainer.innerHTML = '';
    articles.forEach(article => {
        const articleElement = document.createElement('div');
        articleElement.className = 'news-article';
        
        const imageUrl = article.urlToImage ? article.urlToImage : 'default-image.jpg';

        articleElement.innerHTML = `
            <img src="${imageUrl}" alt="Article Image" class="article-image">
            <div class="news-article-content">
                <h2><a href="${article.url}" target="_blank">${article.title}</a></h2>
                <p>${article.description || 'No description available'}</p>
            </div>
        `;
        newsContainer.appendChild(articleElement);
    });
}

function analyzeSentiment(text) {
    let score = 0;
    const words = text.toLowerCase().split(/\W+/);

    words.forEach(word => {
        if (positiveWords.includes(word)) {
            score++;
        } else if (negativeWords.includes(word)) {
            score--;
        }
    });

    return score;
}

function filterArticles(mood) {
    let filteredArticles = allArticles;

    if (mood !== 'all') {
        filteredArticles = allArticles.filter(article => {
            const description = article.description || '';
            const score = analyzeSentiment(description);
            if (mood === 'positive') {
                return score > 0;
            } else if (mood === 'neutral') {
                return score === 0;
            } else if (mood === 'negative') {
                return score < 0;
            }
        });
    }

    displayNews(filteredArticles);
}

fetchNews();
