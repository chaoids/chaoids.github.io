// Load article metadata and content based on article ID
async function loadArticle() {
  const urlParams = new URLSearchParams(window.location.search);
  const articleId = urlParams.get('id') || '1';
  
  try {
    const response = await fetch(`articles/${articleId}.md`);
    if (!response.ok) throw new Error('Article not found');
    
    const markdown = await response.text();
    const { meta, content } = parseArticleMarkdown(markdown);
    
    // Convert ISO date to Chinese format for display
    const displayDate = formatDateToChinese(meta.date);
    
    // Set page title and article heading
    document.title = `${meta.title} - Chao Ideas`;
    document.getElementById('article-title').textContent = `${meta.title} - Chao Ideas`;
    document.getElementById('article-heading').textContent = meta.title;
    document.getElementById('article-date').textContent = `发布于 ${displayDate}`;
    
    // Convert markdown to HTML and display
    const html = marked.parse(content);
    const articleContentDiv = document.getElementById('article-content');
    articleContentDiv.innerHTML = html;
    
    // Add back link
    const backLink = document.createElement('a');
    backLink.href = 'blogs.html';
    backLink.className = 'back-link';
    backLink.textContent = '← 返回博客列表';
    articleContentDiv.appendChild(backLink);
    
  } catch (error) {
    console.error('Error loading article:', error);
    document.getElementById('article-content').innerHTML = '<p>文章加载失败</p>';
  }
}

// Convert ISO date (YYYY-MM-DD) to Chinese format (YYYY年MM月DD日)
function formatDateToChinese(isoDate) {
  if (!isoDate) return new Date().toLocaleDateString('zh-CN');
  
  const date = new Date(isoDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}年${month}月${day}日`;
}

// Parse YAML-style frontmatter from markdown
function parseArticleMarkdown(markdown) {
  const lines = markdown.split('\n');
  const meta = {
    title: '未命名文章',
    date: new Date().toISOString().split('T')[0]
  };
  
  let contentStart = 0;
  
  // Check if starts with frontmatter
  if (lines[0] === '---') {
    for (let i = 1; i < lines.length; i++) {
      if (lines[i] === '---') {
        contentStart = i + 1;
        break;
      }
      const [key, value] = lines[i].split(':').map(s => s.trim());
      if (key && value) {
        meta[key] = value;
      }
    }
  }
  
  const content = lines.slice(contentStart).join('\n');
  return { meta, content };
}

// Load article when DOM is ready
document.addEventListener('DOMContentLoaded', loadArticle);
