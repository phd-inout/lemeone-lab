# Industry DNA: 金融科技与支付 (FinTech & Payments)
ID: ind_015_fintech | Version: 2.0

## [Module 1] Baseline Vector (14D)
系统为该行业设置的默认均值下限（未填写的维度在 0.5 左右游动）。
- D4: 0.95
- D11: 0.85
- D5: 0.7

## [Module 2] Industry Anchors (行业刻度极值)
在全局刻度的基础上，本行业特有的及格/生存指标定位于：
- D4 (合规与安全): 0.95=死亡底线 (牌照合规性与资金底线)
- D11 (护城河): 0.85=标准 (转换银行账户或网关的摩擦极高，形成护城河)
- D5 (门槛): 0.8=及格 (给C端的开户和Checkout体验顺滑)

## [Module 3] Critical Dimensions
- **Primary**: D4 (合规资金安全性), D11 (特许经营或转换摩擦)
- **Secondary**: D5 (极致的开户/支付顺滑度)

## [Module 4] Semantic Mappings
- "数字货币牌照" -> D4 +0.3
- "一键Checkout" -> D5 +0.3

## [Module 5] Physics Laws
- IF D4 < 0.9 -> TRIGGER Regulatory_Ban
- IF D5 < 0.6 -> TRIGGER Cart_Abandonment_Surge

## [Module 6] Probing Logic
- IF D4.sigma > 0.6 -> ASK "所在国的金融支付牌照或反洗钱 (AML) 审计方案是什么？是否有足够的资本金储备？"

## [Module 7] Macro Modifiers
- TechDebt λ: 0.3
- CAC Base: 极高
