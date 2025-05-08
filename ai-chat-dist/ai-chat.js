// 加载AI聊天应用
(function() {
  // 显示加载状态
  function showLoading() {
    const app = document.getElementById('app');
    if (app) {
      app.innerHTML = `
        <div style="
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          flex-direction: column;
          font-family: Arial, sans-serif;
        ">
          <h1 style="color: #3B82F6; margin-bottom: 20px;">AI 助手正在加载...</h1>
          <div style="
            width: 50px;
            height: 50px;
            border: 5px solid #f3f3f3;
            border-top: 5px solid #3B82F6;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          "></div>
        </div>
        <style>
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
      `;
    }
  }

  // 显示错误信息
  function showError(message) {
    const app = document.getElementById('app');
    if (app) {
      app.innerHTML = `
        <div style="
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          flex-direction: column;
          font-family: Arial, sans-serif;
          padding: 20px;
          text-align: center;
        ">
          <h1 style="color: #f43f5e; margin-bottom: 20px;">加载出错</h1>
          <p style="margin-bottom: 20px;">${message}</p>
          <p>
            <button onclick="location.reload()" style="
              background-color: #3B82F6;
              color: white;
              border: none;
              padding: 10px 20px;
              border-radius: 5px;
              cursor: pointer;
            ">
              重新加载
            </button>
          </p>
        </div>
      `;
    }
  }

  // 加载应用资源
  function loadApp() {
    try {
      // 首先加载配置文件
      const configScript = document.createElement('script');
      configScript.src = './config.js';
      configScript.onload = function() {
        // 配置加载成功后，加载其他资源
        loadMainResources();
      };
      configScript.onerror = function() {
        showError('无法加载配置文件。请检查网络连接或联系管理员。');
      };
      document.head.appendChild(configScript);
    } catch (error) {
      console.error('加载出错:', error);
      showError('加载应用时出错: ' + error.message);
    }
  }

  // 加载主要资源
  function loadMainResources() {
    try {
      // 创建CSS链接
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = './dist/assets/index-CiTpV3ka.css';
      document.head.appendChild(link);
      
      // 使用普通script标签加载（不使用module类型）
      const script = document.createElement('script');
      script.src = './dist/assets/index-CUfZnN71.js';
      script.onerror = function() {
        showError('无法加载应用脚本。请检查网络连接或服务器配置。');
      };
      
      // 添加到文档
      document.body.appendChild(script);
    } catch (error) {
      console.error('加载出错:', error);
      showError('加载应用时出错: ' + error.message);
    }
  }

  // 等待DOM加载完成
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      showLoading();
      loadApp();
    });
  } else {
    showLoading();
    loadApp();
  }
})(); 