from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

def find_second_largest_smallest(arr):
    """
    查找整数数组中的第二大值和第二小值
    :param arr: 整数数组
    :return: 包含第二大值和第二小值的字典
    """
    # 检查数组长度
    if len(arr) < 2:
        return {
            "error": "数组长度至少需要为2",
            "second_largest": None,
            "second_smallest": None
        }
    
    # 去重处理，避免重复元素影响结果
    unique_arr = list(set(arr))
    
    # 如果所有元素都相同
    if len(unique_arr) == 1:
        return {
            "error": "数组中所有元素都相同，无法确定第二大或第二小",
            "second_largest": None,
            "second_smallest": None
        }
    
    # 排序并找到结果
    sorted_arr = sorted(unique_arr)
    second_smallest = sorted_arr[1]
    second_largest = sorted_arr[-2]
    
    return {
        "error": None,
        "second_largest": second_largest,
        "second_smallest": second_smallest
    }

@app.route('/')
def home():
    # 渲染HTML页面
    return render_template('index.html')

@app.route('/find_second_values', methods=['POST'])
def find_second_values():
    # 获取请求数据
    data = request.json
    
    try:
        # 解析数组
        arr = data['array']
        # 验证是否为整数数组
        if not all(isinstance(x, int) for x in arr):
            return jsonify({
                "error": "数组必须只包含整数",
                "second_largest": None,
                "second_smallest": None
            }), 400
        
        # 调用函数获取结果
        result = find_second_largest_smallest(arr)
        return jsonify(result)
        
    except KeyError:
        return jsonify({
            "error": "请求缺少'array'参数",
            "second_largest": None,
            "second_smallest": None
        }), 400
    except Exception as e:
        return jsonify({
            "error": f"处理请求时发生错误: {str(e)}",
            "second_largest": None,
            "second_smallest": None
        }), 500

if __name__ == '__main__':
    app.run(debug=True)