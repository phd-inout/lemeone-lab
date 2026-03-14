# lemeone-lab：从数据库到 Markdown 的语义映射层 (Semantic Mapping Layer) 设计指南

这是一套介于关系型数据库（Relational DB，硬核数值）与 大语言模型（LLM，认知语义）之间的桥接系统。它不会取代现有的数据库，而是作为数据库的“实时语义视图”，将冰冷的数值序列化为 AI 最易理解的 Markdown 格式，实现“龙虾式”的深度记忆与精准复盘。

## 1. 核心设计理念

**唯一真理来源**：始终以数据库（PostgreSQL）的快照序列为准。
**动态实例化**：Markdown 仅在调用 AI（Cortex AI / Gemini）时**动态在内存中生成**，不持久化单独的 `.md` 文件实体，以防止数据同步冲突与状态分裂。
**消解机器幻觉**：通过把数据库属性（如 `cash`, `techDebt`, `founderVector`）统一转译为带有业务含义的 Markdown 榜单表格或特征描述，消除 AI 在推演过程中的数值幻觉。

---

## 2. 核心语义文档资产 (Strategic Assets)

这些文档不仅是动态生成的视图，其**核心内容（Content）**在关键节点会持久化到数据库的 `Rehearsal.company` 或 `ProductLine` 的 JSON 字段中，确保 AI 的“记忆”具有连贯性。

### 📝 PROPOSAL.md (项目建议书)
*   **持久化时机**：`idea` 指令执行完毕且用户确认后。
*   **核心内容**：
    *   **愿景描述**：用户输入的产品点子原文。
    *   **AI 评估**：包含预算（MVP 周数、月均支出）、人力缺口预警、初期 Moat 预测。
    *   **战略红线**：AI 识别出的 2026 年行业竞争红线或合规风险。

### 📋 BACKLOG.md (动态需求池)
*   **持久化时机**：每 2 周一次的“战略会话”结束时。
*   **核心内容**：
    *   **已攻克任务**：过去 2 周实际产出的技术模块或市场指标。
    *   **即时待办**：AI 根据当前 devProgress 和市场反馈动态生成的下一步任务（如：“由于 TEC 不足，需要先重构鉴权模块”）。
    *   **技术债水位**：用语义化描述当前的维护压力（如：“代码库正处于崩坏边缘”）。

### 📊 MARKET_FEEDBACK.md (市场画像)
*   **持久化时机**：伴随随机事件或阶段晋级触发。
*   **核心内容**：
    *   **用户原声**：模拟的 Reddit/Twitter 真实评论，反映用户对当前 TechProgress 的真实感观。
    *   **PMF 差距分析**：技术进度与产品成熟度脱节的语义描述。

---

## 3. “战略会话”中的语义流动 (The Strategic Session Flow)

系统不再只是“步进数值”，每 2 周触发一次**强制性认知对齐**：

1.  **数据汇总**：Mapper 将过去 2 周的 `Cash`, `DevProgress`, `TechDebt` 变化注入上下文。
2.  **资产更新**：AI 读取旧的 `BACKLOG.md`，对比实际产出，更新已完成项，并生成新的待办。
3.  **冲突识别**：AI 检查语义层面的矛盾（如：现金只够 1 周，但 BACKLOG 里还有 4 周的研发任务）。
4.  **决策询问**：AI 停止自动模拟，在终端抛出基于资产的“决策球”：
    > “[COO 建议] 我们目前的现金流极度危险。根据 BACKLOG，'核心爬虫模块'还需要 2 周才能上线。你是选择‘削减功能提前发布’，还是‘冒着倒闭风险申请融资’？”
5.  **状态提交**：用户决策后，新的战略方向被写回 DB，进入下一个 2 周循环。


---

## 3. 核心开发逻辑：语义转化器 (The Mapper)

在服务端实现一个 `SemanticContextService`，负责串联上述渲染：

```typescript
// 将数据库快照映射为语义 Markdown 的服务
export class SemanticContextService {
  public static generateAhaContext(rehearsal: Rehearsal, product?: ProductLine, recentLogsLimit: number = 8): string {
    const soul = this.mapToSoul(rehearsal.founderJson, rehearsal.ideaJson);
    const dash = this.mapToDashboard(rehearsal.companyJson, product);
    const journal = this.mapToJournal(rehearsal.logsJson, recentLogsLimit);

    // 返回拼接后的 Markdown 字符串，作为 Prompt 系统上下文注入
    return `
# SOUL_CONTEXT
${soul}

# CURRENT_DASHBOARD
${dash}

# RECENT_JOURNAL_HISTORY
${journal}
    `;
  }

  private static mapToSoul(...) { /* 渲染逻辑 */ }
  private static mapToDashboard(...) { /* 渲染逻辑 */ }
  private static mapToJournal(...) { /* 渲染逻辑 */ }
}
```

---

## 4. “龙虾式”因果复盘的执行流程 (Causal Reasoning)

当 DRTA 数值引擎（System 1）检测到极值或崩坏（例如：现金断流、技术债暴雷），触发 Aha-Moment 或 破产清算 时，按以下顺序执行“深度复盘”：

1.  **快照投影**：`SemanticContextService` 将数据库中该 `Rehearsal` 的序列状态投影成 `SOUL`, `DASHBOARD`, `JOURNAL` 三层 MD 上下文。
2.  **案例检索 (Vector RAG)**：利用提取到的特征，结合 `BusinessCase.embedding` 从 `pgvector` 中检索出与之高度近似的 2-3 个真实商业案例。
3.  **语义对齐**：将“本地 MD 状态” + “检索到的异星真实案例”。同时喂入 Gemini 大模型。
4.  **复盘生成**：AI 在读取 `JOURNAL.md` 的历史轨迹后，能够精确定位因果关系（例如指出：“你在第 4 周盲目追求 `techProgress` 而忽略了招聘补齐 `OPS`，直接导致了本周的业务内耗与团队出走…”）。

---

## 5. 特殊场景的支持策略

### 离线补算下的 MD 记忆维护 (Offline Warp Integration)

针对 `1秒 = 1虚拟小时` 的高频流速，日志维护采取松弛策略：
*   **实时运行期间**：每经历一整周（168 虚拟小时），向 `logsJson` (对应映射后的 `JOURNAL.md`) 追加一条高度紧凑的浓缩周报。
*   **离线补偿期间（Offline Warp）**：当用户重连并触发离线补算时，系统执行快进，并将离线期间的数值变化**折叠**。用一个 `# [OFFLINE_SUMMARY]` 块级标题聚合掉离线周期内的所有宏观波动，而不是逐周生成日志。这能极大防止长文本撑爆 Token 空间或干扰 AI 的重点。

### 极具沉浸感的商业尸检 (Autopsy / Graveyard)

当玩家在 CLI 终端执行 `grave <id>` 时：
1. 后端直接调用 `generateAhaContext` 还原死者生前的 `SOUL`、临终时的 `DASHBOARD` 和最后十周的 `JOURNAL`。
2. 将这套材料丢给 AI 生成辛辣的尸检报告。
3. （可选进阶功能）不仅在控制台输出复盘分析，还允许终端直接用 `cat /var/log/soul.md` 的形式呈现这份动态生成的亡者档案给玩家检阅。
