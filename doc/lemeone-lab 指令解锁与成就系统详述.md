# **lemeone-lab：指令解锁与成就系统详述 (Feedback Systems v2.0)**

本项目通过“渐进式硬核”架构，将 35+ 核心成就与 4 级指令链条深度融合，确保玩家在 2026 创业沙盒中获得持续的心理正反馈。

## **1\. 指令重构与交互系统 (Command & UX Hierarchy)**

基于创业生命周期与玩家操作习惯，我们将指令体系重构为**短指令（Alias）+ 交互式选单 (Prompt) + 智能联想**的终端体验。告别繁琐的长拼写，让系统更像一个现代化的易用 CLI 工具。

### **1.0 终端全局交互规范 (Terminal UX Rules)**

* **简短语义单词**：核心指令采用 3-4 个字母的标准 IT 术语缩写或短词（如 `dev`, `stat`, `auto`），既保证了单词的语义完整性，又避免了拼写过长带来的输入负担。
* **渐进式表单 (Interactive Prompt)**：如果玩家记不住参数，只需要敲入主指令（如 `dev`）并回车，终端会自动以交互表单的形式询问（例如：`? 预计冲刺几周: [1周] [2周]`），无需硬背 `-w 2` 等参数。
* **智能联想补全**：如果输入时不确定，敲击 `Tab` 键即可在下方直接呼出可选参数列表与中文释义。
* **语义模糊容错**：类似于 `buy 公司名字`，即便没加 flag，也能由底层的 Intent 引擎接管处理。

### **1.1 游戏初始化与建档 (Initialization - Day 0)**

在真正进入 SEED 阶段的日常前，玩家需要通过以下系统指令完成“建档”，这些指令经过交互式表单重构，告别一次性输入海量信息的痛苦：

* `user`：建立创始人档案。（替代原来的 `init` 的一部分）
  * 敲入后交互选项：逐步提问 `[Founder Name?]` -> `[选择核心天赋 (Hack/Hustle/Design)]` -> `[ROLL 点分配属性]`。
* `corp`：注册公司实体。
  * 敲入后交互选项：`[输入公司名称(Inc.)]` -> `[选择创业赛道(如 Web3/AI/SaaS)]` -> `[获取初始资金]`。
* `idea`：构思初始产品理念。（替代原来 `init` 中直接定死方向的硬核设定）
  * 敲入后基于当前行业和创始人的属性，生成可选项，交互式定义第一款产品的形态与基因向量。

### **1.2 创意与生存 (Discovery & Survival - SEED 阶段)**

* `stat`：看板与资产分析。（合并原 `status` 与 `inventory`）
  * 不带参数时列出综合面板。
  * 可选参数：`stat --fin` (看财务)、`stat --team` (看团队)、`stat --prod` (看产品矩阵)。
* `dev`：研发与冲刺。（替代原 `sprint` 与 `prototype`）
  * 敲入后交互选项：`[常规打磨(稳健)]` / `[粗糙原型(高概率产出技术债)]` / `[极限压榨(耗生命值)]`。针对当前聚焦的产品线积累 Progress。
* `fix`：修复缓冲。（合并原 `rest`）
  * 敲入后交互选项：`[创始人休假回血(耗时间)]` / `[偿还技术债(耗带宽)]`。

### **1.3 验证与寻找 PMF (Validation - MVP/PMF 阶段)**

* `scan`：扫描与分析市场。（替代原 `market-scan` 与 `analyze-resonance`）
  * 将浅层扫描和深层夹角计算收拢。交互选项：`[粗略定位市场热点]` / `[深度计算共鸣夹角(需高阶解锁)]`。
* `test`：投放测验与调研。（替代原 `survey`）
  * 花钱/精力获取用户反馈，修正当前主推产品的向量。
* `prod`：多产品线管理。（新增：一家公司可运行多款产品与服务）
  * 创业不再是一条道走到黑，容许多业务并行。交互选项：`[构思新产品(调起 idea)]` / `[切换研发与投放焦点]` / `[关停亏损条线]`。
* `fund`：资本运作。（替代原 `pitch` 与 `audit`）
  * 交互选项：`[接洽VC路演尝试融资(pitch)]` / `[内部财务审计优化开销(audit)]`。

### **1.4 扩张与系统化 (Scale & Automate - SCALE 阶段)**

* `hire`：招募人才。（涵盖原本的 `hire` 和高管 `headhunt`）
  * 交互选项：`[招募人类外包/实习生]` / `[购买并部署 AI Agent]` / `[砸重金挖猎核心高管(需解锁)]`。
* `auto`：工作流自动化。（替代 `automate`）
  * 把重复任务指派给已雇佣的 AI 员工，永久削减带宽消耗基数。
* `grow`：大推与增长。（替代 `pr-push`）
  * PR轰炸，将现金转化为品牌声量与销售转化。

### **1.5 巨头与终局 (Dominion - TITAN 阶段)**

* `buy`：竞品并购。（替代 `m-and-a`）
  * 向竞争对手发起收购。高容错：`buy competitorHQ`。
* `rule`：制定规则。（组合了 `ecosystem-init` 和 `lobby`）
  * 交互选项：`[强推我方行业标准(吸血)]` / `[院外游说(降低政策风险)]`。

## **2\. 成就系统：实验室勋章 (35 个核心里程碑)**

成就分为商业、算法、生存与隐藏四个维度，每项成就均奖励 **Lab Points**（用于重开局时的属性加成）。

### **2.1 商业领袖 (Commercial Milestones)**

1. **\[第一桶金\]**：实现首次营收。  
2. **\[收支平衡\]**：周营收超过周支出。  
3. **\[种子猎人\]**：融资总额累计超过 $1M。  
4. **\[估值神话\]**：单次融资估值提升 10 倍以上。  
5. **\[独角兽\]**：公司估值达到 $1B。  
6. **\[十角兽\]**：公司估值达到 $10B。  
7. **\[市场主宰\]**：细分领域市场占有率超过 35%。  
8. **\[利润机器\]**：周净利润超过 $1M。  
9. **\[现金为王\]**：账户现金储备超过 $100M。  
10. **\[全球视野\]**：在 5 个不同的行业 DLC 中均达成 PMF。

### **2.2 算法大师 (Algorithmic Achievements)**

11. **\[绝对共鸣\]**：相似度 ![][image3] 连续 4 周保持在 0.99 以上。  
12. **\[禅定状态\]**：公司向量在市场剧烈波动下保持 20 周稳定。  
13. **\[混沌幸存者\]**：在单周市场偏移超过 40% 的情况下未破产。  
14. **\[效率之神\]**：![][image4]（单位带宽价值）进入全服 Top 1%。  
15. **\[纯粹人类\]**：在不雇佣任何 AI Agent 的情况下进入 SCALE 阶段。  
16. **\[奇点信徒\]**：公司 90% 以上的带宽产出由 AI Agent 贡献。  
17. **\[无债一身轻\]**：在 Progress 突破 1000 时保持 0 技术债。  
18. **\[完美转型\]**：通过 pivot 指令将相似度从 0.2 提升至 0.9。  
19. **\[极简主义\]**：仅靠一名创始人（无合伙人/员工）达成 PMF。  
20. **\[蜂巢思维\]**：10 个 AI Agent 同时在岗且稳定性（Loyalty）全满。

### **2.3 生存与韧性 (Resilience & Grit)**

21. **\[向死而生\]**：在 Health \< 5 的状态下完成 IPO。  
22. **\[忘年交\]**：团队中同时拥有 22 岁和 60 岁的核心成员。  
23. **\[不死鸟\]**：在现金低于 $1000 后成功逆袭达成 PMF。  
24. **\[豪赌客\]**：在成功率低于 10% 的融资谈判中胜出。  
25. **\[过劳之伤\]**：创始人第一次因崩溃而强制停工。  
26. **\[硅谷传说\]**：模拟存活时间超过 1000 个虚拟天。  
27. **\[反脆弱\]**：在市场崩溃（Market Crash）事件中反而增加了护城河。

### **2.4 “Aha\!” 隐藏成就 (Hidden Insights)**

28. **\[断舍离\]**：主动裁撤掉一名 Talent \> 90 的人类员工。  
29. **\[沉默的教训\]**：因为忽略技术债导致系统彻底宕机重来。  
30. **\[特修斯之船\]**：创始人的所有初始属性均通过 LRN 提升了 20 点以上。  
31. **\[代码会说话\]**：AI Agent 连续 3 次提出正确的 pivot 建议。  
32. **\[道德泰坦\]**：在 Reputation 满分的情况下达成 TITAN。  
33. **\[冷酷执行者\]**：在单回合内解雇超过 50% 的人类员工。  
34. **\[时空旅人\]**：在模拟中存活至 2040 年。  
35. **\[实验室之友\]**：触发了所有类型的 AI “顿悟时刻（Aha Moments）”。

## **3\. 技术实现逻辑**

* **成就追踪器 (AchievementTracker)**：每轮 simulateCycle 结束时进行 Hook，检查全局状态机是否满足成就条件。  
* **指令网关 (CommandGate)**：在 CLI 解析层进行拦截，未解锁指令返回 \[ACCESS\_DENIED: TIER\_INSUFFICIENT\]。  
* **持久化收益**：Lab Points 存储在用户的 UserRecord 中。每次 init 时，系统会提示：检测到历史遗产：你有 420 点 Lab Points 可用于初始化基因加成。

[image1]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAABNklEQVR4XmNgIAIoKCg0oIsRDUCa5eXl9+PA/9HVUwSobuDgAkDvvQd5EQlfR5OHyyGLEwRycnJ1IE3AyEpAl5ORkeEEinegixMEQE32UNfMRpcDiv1EFyMKADUqggwFungHFrkl6GJEA6hLv8D4QAsEgfyXyGpIBuiRAWT/UlRU1EdWQzJANhRIl4iKivKgqyEZIBsKjLiN6PJkAZihQBykpKQkh0XeEMaWlZU1hbGBQSQPpBhhfBQA1HQdaug5dDlgpLUDxYOB+CUQe0LVvwf6SAPKfoGqAwqAEtNAhqKLgwDINUCDdwIN4YAKMQLVXoDJ49JHECBrBLKzgTgQif8BGGT8MD7RAM3Q1cDsKwRiS0tLywD5i4C+mIlQTSSQR8pZQPYfGFtLS4sNyN8LDB4lmNjQAACiGVe66TSCXgAAAABJRU5ErkJggg==>

[image2]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAXCAYAAAA2jw7FAAAAk0lEQVR4XmNgGIRATk7OV15e/oKKigo7uhwDUOIfEDtB2f/RJZ8pKyuLIfExFKAIoPCBnFYgfoEkj6HgPxCvBzowH4jzFBQUOrApuA/E96D4I4YCOAfC/wXEXTA+IxYFuH0gIyMjDeR/R5aHKwA6UAvI/mFsbMyKogDo6kSgxHUgvVJKSkoERRIGFBUV7dDFhg8AAJhfLjKmGaSAAAAAAElFTkSuQmCC>

[image3]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAWCAYAAAC7ZX7KAAACdElEQVR4Xu1WPWiTYRCOaauCKF0khfx8SRMJRBAhVatCxQ4V6a6I+LOKIuJQkQ4txUUUcauTThIQpB1Kt2LXQjuUUnEo3UQRBwVBUVCfJ97F8/p+UkE/lzxwed977u69y3v3fUkq1UYbyaNSqewqFAojng8hiqIGlg7PJwoUMYNli+dLpRJM0QpkULlqtboTX+6B9UsUxWLxNAo4FeBPoNAp7rF+gzwztvF8Pn/gp3dCQBHDLMbzhOWxf+H9qKMDA5b755CbWwnwa7jFJ0anny/4I+Sd5X4BjG8gDbTvkQS3Bh/6Z8g85A7klQmjbQlyF3HTjEMh942N+gXnf0v47dZPcrYA+23PtYBk52B8zz0cz8iB16hj3+BMqS9vBnJJddi/mH2o4GOqC7cqBV5H3qtcRf/g/C7HFkxDJpPZoTqS7OeK19G2UJBy9Xq9i3sk3ksdcf3Qj1i/crmcV105eyZij1JH7E3ndzKUm+iIM+Cw8yGbLQQ+k1oEZB6Je8jXarWt5PgO9rGQVaOvQ2atj/CHQ7mbiDPg1dIXspFjQdimtTN625Cv1k+7ZTnIPatbuwL82TibHnzIcaNYOkNByvElj7iLhl+0/lLccdUNN8F9LpfbE7mHWAH+Sih3E2hrL4385eFNQR9DId1i44OxDNs+qGnsX2I/RBvbzTjOekpGiyOi50pxD1UXbg7yWjrS6oYHzlmILVgBp5ok3wDcRhaFHnR0mh+cW33wLKIfP7sbkjIHc3neQr5ssxNJgh15LvO+aWSz2RziHns+MSD5W8/9DvD/5LlEgQKeYun0fAgYl90Ylxue/x/Y1H/cPx2fNv42vgNyAMCY8jKxxAAAAABJRU5ErkJggg==>

[image4]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAWCAYAAACosj4+AAACF0lEQVR4Xu2Uv2tTURTHY0UrKFapIZiYnwRKg+gQcfFHKbqIceggCHVwaiuldMlYcBQzOIhuDi4OguDgP6A4ugl2EkoIrlEXsZVWP+f13OTk9AVbkCzNF768d7/f7zn3vvvue4nEEEP8B+RyucvFYvFcNps9y/U813Tw8vl8UXxYxbto63YD6VkoFKYC6XGVXpdknmq1esjnI5RKpTEm/gPbEkYaCR5NjsB7eD/U2xMqlcphalekP33mZS76nGRch79gy9dEIPxJi05YPZlMHutbtEtQvwo/el12S+b0egSMZ7pLN52+wbZfsdpeoX1vxOhv+y6InbkjJtv50GjzmUxm3OYCyL0gvyZnhOtX+EHqU6nUUZ/1k+or24Lfrd4DOR/6JC+Dxv03m7HAa1Izp4uZFo3xA+6f21w6nT6lfRvKx/AnD3s/bvEWB7WwKQOaX+d+0ocE5XJ5FL+C/4bGr4LObl2QHjbL+Cn8bbVEd651p/dCQ1FDrl+87yFZDuaEGT+Bmz4DG1ZT/Z14PNg173UQFkTovffiEBZvx+zYgtfkU7ea6nKGpL7zi9mBsCDY9l4MDsQtSPQYzSOq7eN1YUI9TePALi5r/jSclP8Y2m3xOGPHub+F/lozM4xrqsmZkrdQ8z13gKaPCM96PQ7k2vKl8Fs4I/T+wPHP7R4U8tt/9Ja+is/eHzh493fhEotZhHXvD7Hv8BekqZpUxFii8AAAAABJRU5ErkJggg==>