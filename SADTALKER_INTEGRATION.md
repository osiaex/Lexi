# SadTalker 集成使用指南

## 🎯 功能概述

LEXI项目现已集成SadTalker功能，可以将DeepSeek AI的文本回复转换为逼真的说话人脸视频。通过结合文本转语音(TTS)技术和SadTalker的AI驱动面部动画，为实验参与者提供更加生动的AI互动体验。

## ✨ 功能特性

- 🤖 **AI文本转视频** - 将DeepSeek的文本回复自动转换为说话视频
- 🗣️ **文本转语音** - 使用OpenAI TTS将文本转换为自然语音
- 👤 **自定义头像** - 允许用户上传自己的头像照片
- 🎛️ **灵活控制** - 实验管理员可通过控制台决定是否启用功能
- 📱 **响应式设计** - 在桌面端和移动端都有优化的用户体验

## 🚀 快速开始

### 环境准备

1. **确保SadTalker已部署**
   ```bash
   # SadTalker应该位于项目根目录
   ls ../SadTalker/inference.py
   ```

2. **安装SadTalker依赖**
   ```bash
   cd ../SadTalker
   pip install -r requirements.txt
   ```

3. **配置环境变量**
   ```bash
   # 在server/.env中添加
   OPENAI_API_KEY=your_openai_api_key_here
   ```

### 启用功能

1. **启动服务器**
   ```bash
   cd server
   npm run dev
   ```

2. **运行测试脚本**
   ```bash
   cd server
   node test-sadtalker.js
   ```

3. **在Admin控制台中配置实验**
   - 进入Admin面板
   - 创建或编辑实验
   - 在"SadTalker Settings"部分启用相关功能

## 🔧 实验配置

### SadTalker设置选项

在实验表单中，您可以配置以下选项：

- **Enable SadTalker Video Generation** - 启用视频生成功能
- **Allow Custom Avatar Upload** - 允许受试者上传自定义头像
- **Auto-play Generated Videos** - 自动播放生成的视频

### 配置示例

```javascript
experimentFeatures: {
    userAnnotation: false,
    streamMessage: true,
    sadTalker: {
        enabled: true,          // 启用SadTalker
        customAvatar: true,     // 允许自定义头像
        autoPlay: true          // 自动播放视频
    }
}
```

## 📋 使用流程

### 对于实验管理员

1. **配置实验**
   - 在Admin控制台中创建新实验
   - 启用SadTalker相关设置
   - 根据需要配置自定义头像和自动播放选项

2. **监控服务**
   - 访问 `/sadtalker/health` 端点检查服务状态
   - 查看服务器日志确认视频生成情况

### 对于实验参与者

1. **上传头像**（如果启用了自定义头像）
   - 在聊天页面左侧边栏找到"Custom Avatar"
   - 点击"Upload Avatar"按钮
   - 选择清晰的人脸照片（建议正面照）

2. **开始对话**
   - 正常发送消息给AI
   - AI回复时会自动生成说话视频
   - 视频会显示在文本消息上方

## 🛠️ 技术实现

### 核心组件

1. **TTS服务** (`tts.service.ts`)
   - 使用OpenAI TTS API将文本转换为语音
   - 支持多种声音选择
   - 输出MP3格式音频

2. **SadTalker服务** (`sadtalker.service.ts`)
   - 调用SadTalker Python脚本
   - 处理图片和音频输入
   - 生成说话视频并返回base64编码

3. **对话服务扩展** (`conversations.service.ts`)
   - 集成TTS和SadTalker调用
   - 在AI回复后自动生成视频
   - 支持流式和非流式消息

4. **前端组件**
   - `TalkingVideoPlayer.tsx` - 视频播放器
   - `AvatarUploader.tsx` - 头像上传组件
   - `Message.tsx` - 扩展消息显示

### 数据流

```
用户消息 → DeepSeek API → 文本回复 → TTS服务 → 音频文件 → SadTalker → 说话视频 → 前端显示
```

## 🚨 故障排除

### 常见问题

1. **SadTalker服务不可用**
   ```bash
   # 检查SadTalker目录
   ls ../SadTalker/
   
   # 检查Python环境
   python --version
   
   # 安装依赖
   cd ../SadTalker && pip install -r requirements.txt
   ```

2. **TTS服务失败**
   ```bash
   # 检查API密钥
   echo $OPENAI_API_KEY
   
   # 在.env文件中设置
   OPENAI_API_KEY=your_key_here
   ```

3. **视频生成缓慢**
   - 确保有足够的系统资源
   - 考虑使用GPU加速
   - 调整视频尺寸设置

4. **头像上传失败**
   - 检查文件大小（<5MB）
   - 确保是有效的图片格式
   - 验证网络连接

### 性能优化

1. **GPU加速**
   ```bash
   # 检查CUDA可用性
   python -c "import torch; print(torch.cuda.is_available())"
   ```

2. **缓存优化**
   - 考虑缓存生成的视频
   - 实现头像预处理

3. **并发控制**
   - 限制同时生成的视频数量
   - 实现队列系统

## 📊 监控和日志

### 健康检查

访问以下端点检查服务状态：

- `GET /sadtalker/health` - 服务健康状态
- `GET /sadtalker/default-avatar` - 默认头像获取

### 日志监控

重要的日志信息：

```bash
# SadTalker生成日志
"Generating talking video for message..."

# TTS生成日志
"Generating speech for text: ..."

# 服务健康检查
"SadTalker health check: OK"
```

## 🔒 安全考虑

1. **文件上传安全**
   - 验证文件类型和大小
   - 防止恶意文件上传

2. **资源限制**
   - 限制视频生成频率
   - 监控CPU/内存使用

3. **数据隐私**
   - 及时清理临时文件
   - 保护用户上传的头像

## 📝 更新日志

### v1.0.0 (初始版本)
- ✅ 集成SadTalker视频生成
- ✅ OpenAI TTS支持
- ✅ 自定义头像上传
- ✅ 实验配置控制
- ✅ 响应式UI设计

## 🤝 贡献指南

欢迎贡献改进建议：

1. 报告bug和问题
2. 提出功能请求
3. 提交代码改进
4. 完善文档

## 📞 支持

如有问题请联系：
- 查看日志文件
- 运行测试脚本
- 检查服务状态
- 提交issue

---

🎉 享受更生动的AI对话体验！ 