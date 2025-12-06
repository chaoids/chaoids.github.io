// Load article metadata and content based on article ID
async function loadArticle() {
  const urlParams = new URLSearchParams(window.location.search);
  const articleId = urlParams.get('id') || '1';
  
  try {
    const response = await fetch(`articles/${articleId}.md`);
    if (!response.ok) throw new Error('Article not found');
    
    const markdown = await response.text();
    const { meta, content } = parseArticleMarkdown(markdown);
    
    // Set page title and article heading
    document.title = `${meta.title} - Chao Ideas`;
    document.getElementById('article-title').textContent = `${meta.title} - Chao Ideas`;
    document.getElementById('article-heading').textContent = meta.title;
    document.getElementById('article-date').textContent = `发布于 ${meta.date}`;
    
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

// Parse YAML-style frontmatter from markdown
function parseArticleMarkdown(markdown) {
  const lines = markdown.split('\n');
  const meta = {
    title: '未命名文章',
    date: new Date().toLocaleDateString('zh-CN')
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
