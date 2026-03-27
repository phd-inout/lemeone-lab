# Industry DNA: 新零售与 D2C 品牌 (D2C E-com)
ID: ind_014_d2c | Version: 2.0

## [Module 1] Baseline Vector (14D)
系统为该行业设置的默认均值下限（未填写的维度在 0.5 左右游动）。
- D6: 0.8
- D14: 0.85
- D9: 0.8

## [Module 2] Industry Anchors (行业刻度极值)
在全局刻度的基础上，本行业特有的及格/生存指标定位于：
- D14 (感知度): 0.9=生存线 (必须拥有极高转化率的种草/全渠道触媒能力)
- D6 (付费效率): 0.8=标准 (客单价或复购率足够高抵消买量成本)
- D9 (一致性): 0.8=及格 (发货物流退换货链路完整)

## [Module 3] Critical Dimensions
- **Primary**: D6 (利润率控制/复购压迫), D14 (全渠道营销触达)
- **Secondary**: D9 (履约一致性)

## [Module 4] Semantic Mappings
- "极致性价比" -> D6 -0.2
- "私域流量池" -> D8 +0.2

## [Module 5] Physics Laws
- IF D14 < 0.6 -> TRIGGER Inventory_Death
- IF D9 (交付退货率高) < 0.7 -> TRIGGER Cashflow_Rupture。

## [Module 6] Probing Logic
- IF D14.sigma > 0.6 -> ASK "主要获客依赖公域买量还是私域裂变？单均 CAC 占客单价的具体比例？"

## [Module 7] Macro Modifiers
- TechDebt λ: 0.1 (几无技术债重力)
- CAC Base: 极高 (流量成本高昂)
