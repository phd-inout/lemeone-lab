# Industry DNA: 专业服务交易市场 (Professional Marketplaces)
ID: ind_013_marketplaces | Version: 2.0

## [Module 1] Baseline Vector (14D)
系统为该行业设置的默认均值下限（未填写的维度在 0.5 左右游动）。
- D11: 0.9
- D12: 0.6

## [Module 2] Industry Anchors (行业刻度极值)
在全局刻度的基础上，本行业特有的及格/生存指标定位于：
- D11 (信任壁垒): 0.9=生存线 (双边市场必须构建超越私下微信交易的实名履约信任担保)
- D5 (门槛): 0.8=标准 (发单和接单路径必须极速)
- D2 (深度): 0.4=及格 (撮单工具属性，系统不宜做太重)

## [Module 3] Critical Dimensions
- **Primary**: D11 (双边信任基准/信誉体系), D12 (跨区域网络流动能力)
- **Secondary**: D5 (极低发单门槛)

## [Module 4] Semantic Mappings
- "实名履约担保" -> D11 +0.3
- "抽成低" -> D5 +0.2, D6 -0.2

## [Module 5] Physics Laws
- 双边启动鸡生蛋问题：初期 D11(护城河) = 0。
- 乘法溢出: D11 突破 0.8 后，形成自然垄断。

## [Module 6] Probing Logic
- IF D11.sigma > 0.6 -> ASK "双边市场最怕买卖双方越过平台私下交易，你是如何构建打破信任围墙的不可替代价值的？"

## [Module 7] Macro Modifiers
- TechDebt λ: 0.4
- CAC Base: 极高 (需要同时补贴买卖双方)
