# Lemeone-lab 2.0: DNA 模型与向量空间规范

## 1. 12 维向量空间 (The 12-D Space)

所有实体（用户、产品、竞对）统一由以下 12 维归一化向量（0.0 ~ 1.0）描述：

### 核心属性 (Core Attributes)
1. **$v_{price}$** (价格敏感度)：值越高，共鸣随价格上升衰减越快。
2. **$v_{tech}$** (极客偏好)：值越高，对“硬核”特性的共鸣越高，对 MVP 早期 Bug 的容忍度越强。
3. **$v_{priv}$** (隐私偏好)：与产品的“审计/数据监控”属性方向相反。
4. **$v_{ux}$** (易用性)：值越高，对“产品成熟度”的要求越苛刻。

### 业务维度 (Business Dimensions)
5. **$v_{social}$** (社交溢价)：品牌效应与口碑驱动权重。
6. **$v_{cost}$** (迁移成本)：从旧方案转向新方案的阻力系数。
7. **$v_{scale}$** (扩展性需求)：对产品后期支撑大规模业务的能力要求。
8. **$v_{trust}$** (信任基准)：对开发者/品牌背景的依赖程度。

### 动态维度 (Reserved for Future)
9-12 为预留维度，用于模拟季节性、宏观政策波动等外部扰动对 $V_{user}$ 的瞬时拉扯。

---

## 2. 种子裂变算法 (Seed Fission Algorithm)

1. **输入特征提取**：
   AI 将文本输入映射为 `SeedVector { mean: number[], std: number[] }`。
2. **蒙特卡洛采样 (Monte Carlo)**：
   利用 Box-Muller 变换生成 10,000 个正态分布样本：
   $$V_{user\_i}[n] = \mu[n] + \sigma[n] \times \sqrt{-2 \ln(u_1)} \cos(2\pi u_2)$$
3. **边界处理**：
   所有维度强制 Clamp 在 [0.0, 1.0]。

---

## 3. 碰撞审计逻辑 (Auditing Logic)

### 共鸣强度 ($R$)
$$R = \text{CosineSimilarity}(V_{product}, V_{user}) \times \text{TechDebtPenalty}$$

### 智能体行为涌现 (Agent Emergence)
- **$R > 0.8$**：智能体转化为“付费用户”，贡献 MRR。
- **$R < 0.2$**：智能体转化为“抗议者”，增加市场负噪声。
- **$0.2 < R < 0.8$**：智能体处于“观察期”，不产生现金流，但会受 $v_{social}$ 影响向高密度区漂移。
