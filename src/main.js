// Initialize OpenCC converter (Traditional to Simplified)
// opencc-js is loaded from CDN in index.html
const converter = OpenCC.Converter({ from: 'tw', to: 'cn' });

let shengjiaoData = {};

// Elements
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const clearBtn = document.getElementById('clear-btn');
const resultsContainer = document.getElementById('results-container');
const initialState = document.getElementById('initial-state');

// Fetch the mapping data
async function loadData() {
  try {
    // Relative path works because it's served from /public
    const response = await fetch('/shengjiao.json');
    shengjiaoData = await response.json();
    console.log("Data loaded successfully!");
  } catch (error) {
    console.error("Failed to load calligraphy data:", error);
  }
}

// Generate image URL from raw github content
function getImageUrl(simplifiedChar, filename) {
  const encChar = encodeURIComponent(simplifiedChar);
  const encFile = encodeURIComponent(filename);
  const encFolder = encodeURIComponent('王羲之 集字聖教序 行書');
  return `https://raw.githubusercontent.com/neil-zt/calligraphy-community/refs/heads/master/${encFolder}/${encChar}/${encFile}`;
}

// Perform search
function handleSearch(query) {
  if (!query.trim()) {
    renderEmpty();
    return;
  }

  const chars = query.replace(/\s+/g, '').split('');
  const results = [];

  chars.forEach((char, charIdx) => {
    // Convert traditional to simplified to match JSON keys
    const simplifiedChar = converter(char);
    const filenames = shengjiaoData[simplifiedChar];
    
    if (filenames && filenames.length > 0) {
      filenames.forEach((filename, fileIdx) => {
        results.push({
          id: `${char}-${charIdx}-${fileIdx}`,
          char: char, // Original character typed
          imageUrl: getImageUrl(simplifiedChar, filename),
          source: '《聖教序》',
        });
      });
    }
  });

  renderResults(results, query);
}

// Render UI for empty state
function renderEmpty() {
  resultsContainer.innerHTML = '';
  resultsContainer.appendChild(initialState);
  initialState.style.display = 'block';
  clearBtn.classList.add('hidden');
}

// Render Results
function renderResults(results, query) {
  initialState.style.display = 'none';
  resultsContainer.innerHTML = ''; // Clear previous

  if (results.length === 0) {
    resultsContainer.innerHTML = `
      <div class="text-center text-gray-500 py-12">
        <p class="text-xl mb-2">找不到「${query}」的字帖</p>
        <p class="text-sm opacity-70">請嘗試其他漢字</p>
      </div>
    `;
    return;
  }

  // Create grid
  const grid = document.createElement('div');
  grid.className = 'grid grid-cols-2 md:grid-cols-3 gap-6';

  results.forEach(result => {
    const card = document.createElement('div');
    card.className = 'group relative flex flex-col bg-white border border-gray-200 p-4 rounded-sm hover:-translate-y-1 hover:shadow-xl transition-all duration-300';
    
    card.innerHTML = `
      <div class="aspect-square w-full mb-4 relative bg-[#f0eee9] overflow-hidden rounded-sm flex items-center justify-center p-2 border border-gray-100">
        <img 
          src="${result.imageUrl}" 
          alt="${result.char}" 
          class="w-full h-full object-contain filter contrast-125 rounded-xs"
          loading="lazy"
          onerror="this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBlZWU5Ii8+PC9zdmc+'"
        />
        <div class="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        </div>
      </div>
      <div class="flex items-end justify-between px-1">
        <div>
          <h3 class="text-2xl font-medium tracking-widest text-[#2c2c2c] mb-1">${result.char}</h3>
          <p class="text-xs text-gray-400 font-sans tracking-wider">${result.source}</p>
        </div>
        <a 
          href="${result.imageUrl}"
          download="shengjiao_${result.char}.gif"
          target="_blank"
          class="text-[#8b2626] opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-[#8b2626]/10 rounded-full"
          title="開啟圖片"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
        </a>
      </div>
    `;
    grid.appendChild(card);
  });

  resultsContainer.appendChild(grid);
  lucide.createIcons();
}

// Event Listeners
searchInput.addEventListener('input', (e) => {
  const query = e.target.value;
  if (query.length > 0) {
    clearBtn.classList.remove('hidden');
  } else {
    clearBtn.classList.add('hidden');
  }
  handleSearch(query);
});

searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  handleSearch(searchInput.value);
});

clearBtn.addEventListener('click', () => {
  searchInput.value = '';
  clearBtn.classList.add('hidden');
  renderEmpty();
  searchInput.focus();
});

// Initialize
loadData();
