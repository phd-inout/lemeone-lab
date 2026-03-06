# **lemeone-lab架构演进：从单体应用到 DLC 插件化架构**

为了支撑“行业剧本（DLC）”的扩展能力，后端架构需要进行以下调整，确保核心引擎的纯净与内容的无限扩展。

## **1\. 插件化系统架构图 (The Plugin Architecture)**

系统被分为三层，层与层之间通过标准协议通信：

1. **内核层 (The Nucleus)**：  
   * 负责：物理时间流转、创始人生理损耗算法、基础随机数种子生成。  
   * 特性：**绝对闭源/不可修改**。  
2. **中间层 (The Protocol Layer)**：  
   * 负责：指令解析（CLI Interpreter）、DLC 加载器（Manifest Loader）、AI 语料路由。  
   * 特性：定义了 DLC 的标准格式（JSON Schema）。  
3. **内容层 (The Content Layer / DLCs)**：  
   * 负责：特定行业的事件池、初始资产配置、行业专属 AI 提示词（Prompts）。  
   * 特性：支持热插拔，可由社区贡献或官方发布。

## **2\. DLC 数据结构标准 (DLC Schema)**

一个标准的 DLC 文件夹结构应包含：

/dlc-saas-2026  
  \- manifest.json      \# 包含行业权重系数 (Weights)  
  \- prompts.md         \# 该行业专属的 AI 叙事风格指南  
  \- events/            \# 大量经营事件 JSON  
  \- knowledge/         \# 行业 PDF/研报 (供 RAG 使用)

### **权重系数配置示例 (manifest.json):**

{  
  "industry\_name": "AI SaaS 2026",  
  "stat\_modifiers": {  
    "tec\_impact": 1.25,   // 技术对进度的加速  
    "mkt\_impact": 0.85,   // 营销效果修正  
    "burn\_rate\_base": 1.5 // 该行业算力消耗大，烧钱率基数高  
  },  
  "success\_criteria": {  
    "target\_moat": 80,  
    "target\_revenue": 100000  
  }  
}

## **3\. 技术开发受到的影响与应对**

### **3.1 数据库设计的灵活性**

* **挑战**：传统的固定列数据库无法适应不同 DLC 的特定字段。  
* **对策**：在 Company 表中使用 **PostgreSQL 的 JSONB 字段** 存储 industry\_stats。利用 Prisma 的 Json 类型支持，实现“模式外存储”。

### **3.2 AI 调用的动态上下文 (Context Injection)**

* **挑战**：AI 需要根据不同的 DLC 切换其“专家身份”。  
* **对策**：在 cortex-ai.ts 中实现一个 **系统指令合成器**。它会将 System\_Prompt \+ DLC\_Manifest \+ RAG\_Knowledge 合并后发送给 LLM。  
  * *逻辑*：SystemInstruction \= Core\_Rules \+ Current\_DLC\_Logic \+ Current\_State。

### **3.3 状态机扩展**

* **挑战**：不同 DLC 可能有不同的晋级阶段（例如：传统行业可能没有“种子轮”说法）。  
* **对策**：在加载 DLC 时，覆盖系统默认的 StageController 逻辑，允许 DLC 定义自己的 nextStage() 判定函数。

## **4\. 后续开发优先级 (Priority)**

1. **内核解耦 (Week 1-2)**：将所有硬编码的数值（如精力损耗率）提取到全局配置文件中。  
2. **JSON 事件解析器 (Week 3\)**：支持从外部文件夹加载事件日志，不再把事件写在 TypeScript 代码里。  
3. **命名空间 RAG (Week 4\)**：实现 pgvector 的 collection 隔离，确保加载 DLC 后 AI 的行业术语准确。

## **5\. 商业化建议：DLC 商店**

通过这种架构，你将来可以实现：

* **官方剧本**：免费提供。  
* **精品剧本**：如“李开复式大模型创业模拟”，需消耗 50 个算力积分购买。  
* **社区剧本**：由用户上传，你作为平台方提供算力支撑并抽取分成。