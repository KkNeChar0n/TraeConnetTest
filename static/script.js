// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 获取按钮和消息元素
    const changeColorBtn = document.getElementById('changeColorBtn');
    const message = document.getElementById('message');
    
    // 定义颜色数组
    const colors = [
        '#fce4ec',  // 默认粉色
        '#f8bbd0',  // 浅粉色
        '#f48fb1',  // 中等粉色
        '#f06292',  // 深粉色
        '#ec407a',  // 鲜艳粉色
        '#e91e63'   // 深粉色
    ];
    
    let currentColorIndex = 0;
    
    // 按钮点击事件监听器
    changeColorBtn.addEventListener('click', function() {
        // 切换到下一个颜色
        currentColorIndex = (currentColorIndex + 1) % colors.length;
        
        // 改变背景颜色
        document.body.style.backgroundColor = colors[currentColorIndex];
        
        // 更新消息
        message.textContent = '背景颜色已更改！';
        
        // 重置消息样式
        message.style.color = '#ec407a';
        
        // 3秒后恢复默认消息
        setTimeout(function() {
            message.textContent = '欢迎访问！';
        }, 3000);
    });
    
    // 添加页面加载动画效果
    const content = document.querySelector('.content');
    content.style.opacity = '0';
    content.style.transform = 'translateY(20px)';
    
    // 页面加载完成后显示内容
    setTimeout(function() {
        content.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        content.style.opacity = '1';
        content.style.transform = 'translateY(0)';
    }, 100);
    
    // 数组计算器功能
    const arrayInput = document.getElementById('arrayInput');
    const calculateBtn = document.getElementById('calculateBtn');
    const result = document.getElementById('result');
    
    // 计算按钮点击事件
    calculateBtn.addEventListener('click', function() {
        const inputValue = arrayInput.value.trim();
        
        // 验证输入
        if (!inputValue) {
            result.textContent = '错误：请输入数组';
            result.style.color = '#e74c3c';
            return;
        }
        
        // 解析数组
        try {
            const arrayStr = inputValue.split(',');
            const array = arrayStr.map(item => {
                const num = parseInt(item.trim(), 10);
                if (isNaN(num)) {
                    throw new Error('包含非整数元素');
                }
                return num;
            });
            
            // 验证数组长度
            if (array.length < 2) {
                result.textContent = '错误：数组长度至少需要为2';
                result.style.color = '#e74c3c';
                return;
            }
            
            // 发送请求到后端
            fetch('/find_second_values', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ array: array })
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    result.textContent = `错误：${data.error}`;
                    result.style.color = '#e74c3c';
                } else {
                    result.innerHTML = `
                        第二大值：${data.second_largest}<br>
                        第二小值：${data.second_smallest}
                    `;
                    result.style.color = '#27ae60';
                }
            })
            .catch(error => {
                result.textContent = `网络错误：${error.message}`;
                result.style.color = '#e74c3c';
            });
            
        } catch (error) {
            result.textContent = `解析错误：${error.message}`;
            result.style.color = '#e74c3c';
        }
    });
});