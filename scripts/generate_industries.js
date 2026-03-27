const fs = require('fs');
const path = require('path');

const industries = [
  {
    id: 'ind_001_robotics',
    name: '垂直领域专业机器人 (Specialized Robotics)',
    baselines: { D1: 0.9, D4: 0.8, D9: 0.85 },
    anchors: '- D2 (深度): 0.8=及格 (必须支持复杂的物理环境算法)\n- D5 (门槛): 0.2=标准 (需要专业派驻工程师现场现场施工调试)\n- D9 (一致性): 0.9=生存线 (出货一致性极高，否则召回破产)',
    primary: 'D1 (性能), D9 (一致性)',
    secondary: 'D4 (安全性)',
    mappings: '- "自动寻路" -> D1 +0.2\n- "全天候工作" -> D4 +0.1',
    physics: '- IF D9 < 0.85 -> TRIGGER Survival_Rate=0\n- IF D6 < 0.3 AND D1 > 0.8 -> TRIGGER Conflict_Cost_Too_High',
    probing: '- IF D9.sigma > 0.6 -> ASK "硬件的出厂一致性和寿命预期是如何承诺的？"',
    modifiers: '- TechDebt λ (衰减系数): 0.3 (硬件迭代较慢但成本高)\n- CAC Base: 极高 (针对B2B重资产)'
  },
  {
    id: 'ind_002_energy',
    name: '能源与精密硬件 (Energy & Precision Hardware)',
    baselines: { D4: 0.9, D11: 0.8 },
    anchors: '- D4 (安全性): 0.9=及格 (通过国家级防爆防燃认证)\n- D11 (壁垒): 0.8=标准 (掌握核心电芯供应链)\n- D5 (门槛): 0.3=标准 (需专业电力工程师接入)',
    primary: 'D4 (安全性), D11 (护城河 - 供应链)',
    secondary: 'D1 (性能)',
    mappings: '- "大容量" / "快充" -> D1 +0.2\n- "防爆" -> D4 +0.3',
    physics: '- IF D4 < 0.9 -> TRIGGER Disaster_Recall_Risk\n- 电池成本乘数效应: D6 (价格) 必须与 D11 (供应链护城河) 强绑定。',
    probing: '- IF D4.sigma > 0.6 -> ASK "在极端供电环境或过热情况下的物理保护机制是什么？"',
    modifiers: '- TechDebt λ: 0.2\n- CAC Base: 中高'
  },
  {
    id: 'ind_003_iot',
    name: '消费电子与 IoT (Consumer Electronics)',
    baselines: { D3: 0.8, D6: 0.8, D5: 0.7 },
    anchors: '- D3 (交互): 0.8=生存线 (工业设计与AppUI必须具备高端感)\n- D6 (付费压迫): 0.8=标准 (由于极度内卷，硬件几乎亏本卖，需靠极高溢价或订阅)\n- D5 (门槛): 0.7=及格 (必须开箱扫码即连)',
    primary: 'D3 (交互体验), D6 (价格压力极高)',
    secondary: 'D14 (认知度)',
    mappings: '- "开箱即用" -> D5 +0.3\n- "无缝连接" -> D3 +0.2',
    physics: '- IF D3 < 0.7 AND D6 > 0.5 -> TRIGGER Conflict_Low_Value_High_Price\n- 规模效应乘数: D14 强烈放大 D6 转化率。',
    probing: '- IF D3.sigma > 0.6 -> ASK "用户开箱到第一次成功连接设备的步骤有几步？"',
    modifiers: '- TechDebt λ: 0.6\n- CAC Base: 高 (红海买量)'
  },
  {
    id: 'ind_004_agritech',
    name: '农业与户外科技 (AgriTech & Outdoor Tech)',
    baselines: { D12: 0.8, D4: 0.85 },
    anchors: '- D12 (全球网络): 0.8=及格 (可在无蜂窝网络区域离线或靠卫星运行)\n- D4 (稳定性): 0.85=标准 (极端日晒雨淋全天候可用)',
    primary: 'D12 (全球/全地形适应性), D4 (环境耐受稳定性)',
    secondary: 'D1 (性能)',
    mappings: '- "全天候" -> D4 +0.2\n- "卫星定位" -> D1 +0.1',
    physics: '- IF D4 < 0.8 -> TRIGGER Environment_Failure_Risk',
    probing: '- IF D12.sigma > 0.6 -> ASK "这套设备在不同温带和缺乏基站网络的野外如何正常运作？"',
    modifiers: '- TechDebt λ: 0.2\n- CAC Base: 极高 (由于B2B农场主渠道封闭)'
  },
  {
    id: 'ind_005_solopreneur',
    name: '个人/单人企业管理软件 (Solopreneur ERP/SaaS)',
    baselines: { D5: 0.9, D3: 0.8, D6: 0.4 },
    anchors: '- D2 (深度): 0.4=及格 (满基础功能即可，做深反而失宠)\n- D5 (门槛): 0.9=标准 (一键微信/Google授权登录，免配置)\n- D6 (付费): 0.2=及格 (个人支付意愿极低，大多靠基础免费)',
    primary: 'D5 (极低进入门槛), D3 (极简交互)',
    secondary: 'D8 (病毒分享)',
    mappings: '- "微信一键登录" -> D5 +0.4\n- "无需部署" -> D5 +0.3',
    physics: '- IF D5 < 0.7 -> TRIGGER Immediate_Churn\n- IF D2 (深度) > 0.8 -> TRIGGER Bloatware_Warning (对个体户过于复杂)',
    probing: '- IF D5.sigma > 0.6 -> ASK "个体户通常没有耐心，你的产品必须几秒内完成核心Aha时刻？"',
    modifiers: '- TechDebt λ: 0.8\n- CAC Base: 低 (靠口碑和自传播)'
  },
  {
    id: 'ind_006_vertical_b2b',
    name: '垂直行业 B2B SaaS (Vertical B2B SaaS)',
    baselines: { D2: 0.85, D11: 0.8, D4: 0.8 },
    anchors: '- D2 (深度): 0.8=及格 (必须支持复杂的行业独有痛点与算税审批流)\n- D11 (护城河): 0.8=生存线 (须有医疗/法律级别的数据准入合规门槛)\n- D5 (门槛): 0.4=标准 (允许通过销售代表/实施团队介入，门槛较高可接受)',
    primary: 'D2 (行业深度), D11 (数据与合规护城河)',
    secondary: 'D4 (稳定性)',
    mappings: '- "HIPAA/SOC2认证" -> D11 +0.2, D4 +0.2\n- "定制化工作流" -> D2 +0.2',
    physics: '- IF D2 < 0.6 -> TRIGGER Replacability_Warning\n- IF D4 < 0.8 AND (医疗/法律) -> TRIGGER Legal_Risk_Collapse',
    probing: '- IF D11.sigma > 0.6 -> ASK "相比于Excel，你的产品积累了什么样的行业专有数据护城河？"',
    modifiers: '- TechDebt λ: 0.4\n- CAC Base: 极高 (需直销团队)'
  },
  {
    id: 'ind_007_devtools',
    name: '开发者工具与基础设施 (DevTools & Infra)',
    baselines: { D1: 0.9, D10: 0.85, D2: 0.8 },
    anchors: '- D1 (性能): 0.9=底线 (毫秒级响应，否则被极客直接抛弃)\n- D10 (生态): 0.8=及格 (必须具备API、丰富的CLI及开源插件支持)\n- D5 (门槛): 0.6=标准 (允许命令行安装或需跑几行代码，不非得Web图形界面)',
    primary: 'D1 (极低延迟/高性能), D10 (生态系统与API)',
    secondary: 'D2 (深度)',
    mappings: '- "开源" -> D10 +0.3, D14 +0.2\n- "毫秒级响应" -> D1 +0.3',
    physics: '- IF D10 < 0.6 -> TRIGGER Ecosystem_Isolation\n- IF D1 < 0.8 -> TRIGGER Dev_Rejection',
    probing: '- IF D10.sigma > 0.6 -> ASK "产品是否提供丰富的 API、Webhook，以及可扩展的插件机制？"',
    modifiers: '- TechDebt λ: 1.2 (极快)\n- CAC Base: 中'
  },
  {
    id: 'ind_008_collaboration',
    name: '协同办公与生产力 (Collaboration Tools)',
    baselines: { D8: 0.85, D5: 0.8, D3: 0.7 },
    anchors: '- D8 (社交传染): 0.8=生存线 (必须天然必须自带链接分享和邀请强制属性)\n- D5 (门槛): 0.8=及格 (须支持一键导入竞品(Notion/Jira)数据)\n- D9 (一致性): 0.6=标准 (非高并发情况保证不丢字即可)',
    primary: 'D8 (社交与病毒传染性), D5 (极低协作迁移成本)',
    secondary: 'D3 (交互)',
    mappings: '- "一键邀请链接" -> D8 +0.3\n- "无缝导入Notion" -> D5 +0.2',
    physics: '- IF D8 < 0.5 -> TRIGGER Growth_Stagnation\n- 乘数效应: D8 的每次提升将指数级降低 CAC。',
    probing: '- IF D8.sigma > 0.6 -> ASK "当一个用户觉得好用时，产品内有什么机制能自然地迫使他邀请同事？"',
    modifiers: '- TechDebt λ: 0.7\n- CAC Base: 中低'
  },
  {
    id: 'ind_009_ai_decision',
    name: 'AI 驱动的决策系统 (AI Decision Systems)',
    baselines: { D2: 0.9, D9: 0.9 },
    anchors: '- D9 (准确性): 0.9=生存线 (金融/医疗投顾领域，绝不允许AI出现致命幻觉)\n- D2 (深度): 0.9=标准 (调用通用API不够，必须有私有RAG或微调模型能力)\n- D4 (安全): 0.8=及格 (数据私有化部署的能力)',
    primary: 'D2 (算法/技术深度), D9 (输出准确性与幻觉控制)',
    secondary: 'D4 (信任感)',
    mappings: '- "100%确定性输出" -> D9 +0.4\n- "黑盒不可解释" -> D4 -0.3',
    physics: '- IF D9 < 0.85 -> TRIGGER Fatal_Mistake_Avoidance\n- 技术债惩罚极限放大 (e^λ*Debt)',
    probing: '- IF D9.sigma > 0.6 -> ASK "在金融/医疗等关键决策中，如何将大模型的幻觉误差降到 0？"',
    modifiers: '- TechDebt λ: 1.5 (算法衰减极快)\n- CAC Base: 高'
  },
  {
    id: 'ind_010_gen_ai',
    name: '内容生成与创意 AI (Generative AI & Media)',
    baselines: { D3: 0.85, D13: 0.9, D8: 0.8 },
    anchors: '- D3 (审美交互): 0.9=不仅是UI好，模型生成的画风/表现力必须震慑眼球\n- D13 (成长潜力): 0.8=生存线 (必须有长效留存路径，否则沦为月抛玩具)\n- D5 (门槛): 0.9=标准 (只允许纯Prompt交互或一键套模板)',
    primary: 'D3 (审美愉悦), D13 (爆发式增长曲线)',
    secondary: 'D8 (自传播能力)',
    mappings: '- "一键成片" -> D5 +0.3, D3 +0.2\n- "带有AI生成水印" -> D8 +0.2',
    physics: '- IF D3 < 0.6 -> TRIGGER Aesthetic_Rejection\n- IF D13 (成长潜力) < 0.7 -> TRIGGER Fast_Fad_Death (沦为月抛工具)',
    probing: '- IF D13.sigma > 0.6 -> ASK "生成式工具很容易成为一波流玩具，用户下个月继续使用的核心理由是什么？"',
    modifiers: '- TechDebt λ: 2.0 (全行业最高，几周迭代一次基座大模型)\n- CAC Base: 极低 (自带传播)'
  },
  {
    id: 'ind_011_web3',
    name: 'Web3 与去中心化协议 (Web3 & DeFi)',
    baselines: { D4: 0.95, D11: 0.85 },
    anchors: '- D4 (安全稳定性): 0.95=底线 (智能合约绝不允许漏洞重入，否则死亡)\n- D11 (护城河): 0.8=及格 (需要 TVL 流动性和网络效应支持)\n- D5 (门槛): 0.3=标准 (容忍复杂的助记词和Gas费概念)',
    primary: 'D4 (智能合约安全/绝对稳定), D11 (流动性/网络效应)',
    secondary: 'D10 (生态集成)',
    mappings: '- "审计通过" -> D4 +0.3\n- "代币经济学" -> D8 +0.2, D6 +0.3',
    physics: '- IF D4 < 0.95 -> TRIGGER Exploit_Death_Spiral\n- 由于代币补贴，短期内 D5 和 D14 可能会有虚假繁荣。',
    probing: '- IF D4.sigma > 0.6 -> ASK "代码是否已经历过顶级审计公司的安全验证，有无重入漏洞防范？"',
    modifiers: '- TechDebt λ: 1.0\n- CAC Base: 高 (空投成本或流动性挖矿)'
  },
  {
    id: 'ind_012_creator',
    name: '创作者经济与社区平台 (Creator Economy)',
    baselines: { D8: 0.9, D14: 0.8, D6: 0.7 },
    anchors: '- D8 (K因子): 0.9=生存线 (系统必须为大V提供极致的粉丝杠杆裂变)\n- D14 (知名度): 0.8=及格 (平台初期没有品牌根本招不到大V)\n- D6 (付费压迫): 0.4=及格 (抽水太高将被私下越过)',
    primary: 'D8 (K因子/粉丝杠杆), D14 (品牌流量与造星能力)',
    secondary: 'D6 (变现抽成)',
    mappings: '- "创作者分成0抽水" -> D6 -0.3 (对创作者吸引力大增)\n- "内容分发算法" -> D14 +0.2',
    physics: '- IF D8 < 0.6 -> TRIGGER Creator_Exodus\n- IF D6 > 0.5 (抽成过高) AND D14 < 0.8 -> TRIGGER Platform_Bypass (私下交易)',
    probing: '- IF D8.sigma > 0.6 -> ASK "头部大V自带流量还是完全依赖平台分发？平台对腰部创作者的扶持机制是什么？"',
    modifiers: '- TechDebt λ: 0.5\n- CAC Base: 极低 (创作者自带流量)'
  },
  {
    id: 'ind_013_marketplaces',
    name: '专业服务交易市场 (Professional Marketplaces)',
    baselines: { D11: 0.9, D12: 0.6 },
    anchors: '- D11 (信任壁垒): 0.9=生存线 (双边市场必须构建超越私下微信交易的实名履约信任担保)\n- D5 (门槛): 0.8=标准 (发单和接单路径必须极速)\n- D2 (深度): 0.4=及格 (撮单工具属性，系统不宜做太重)',
    primary: 'D11 (双边信任基准/信誉体系), D12 (跨区域网络流动能力)',
    secondary: 'D5 (极低发单门槛)',
    mappings: '- "实名履约担保" -> D11 +0.3\n- "抽成低" -> D5 +0.2, D6 -0.2',
    physics: '- 双边启动鸡生蛋问题：初期 D11(护城河) = 0。\n- 乘法溢出: D11 突破 0.8 后，形成自然垄断。',
    probing: '- IF D11.sigma > 0.6 -> ASK "双边市场最怕买卖双方越过平台私下交易，你是如何构建打破信任围墙的不可替代价值的？"',
    modifiers: '- TechDebt λ: 0.4\n- CAC Base: 极高 (需要同时补贴买卖双方)'
  },
  {
    id: 'ind_014_d2c',
    name: '新零售与 D2C 品牌 (D2C E-com)',
    baselines: { D6: 0.8, D14: 0.85, D9: 0.8 },
    anchors: '- D14 (感知度): 0.9=生存线 (必须拥有极高转化率的种草/全渠道触媒能力)\n- D6 (付费效率): 0.8=标准 (客单价或复购率足够高抵消买量成本)\n- D9 (一致性): 0.8=及格 (发货物流退换货链路完整)',
    primary: 'D6 (利润率控制/复购压迫), D14 (全渠道营销触达)',
    secondary: 'D9 (履约一致性)',
    mappings: '- "极致性价比" -> D6 -0.2\n- "私域流量池" -> D8 +0.2',
    physics: '- IF D14 < 0.6 -> TRIGGER Inventory_Death\n- IF D9 (交付退货率高) < 0.7 -> TRIGGER Cashflow_Rupture。',
    probing: '- IF D14.sigma > 0.6 -> ASK "主要获客依赖公域买量还是私域裂变？单均 CAC 占客单价的具体比例？"',
    modifiers: '- TechDebt λ: 0.1 (几无技术债重力)\n- CAC Base: 极高 (流量成本高昂)'
  },
  {
    id: 'ind_015_fintech',
    name: '金融科技与支付 (FinTech & Payments)',
    baselines: { D4: 0.95, D11: 0.85, D5: 0.7 },
    anchors: '- D4 (合规与安全): 0.95=死亡底线 (牌照合规性与资金底线)\n- D11 (护城河): 0.85=标准 (转换银行账户或网关的摩擦极高，形成护城河)\n- D5 (门槛): 0.8=及格 (给C端的开户和Checkout体验顺滑)',
    primary: 'D4 (合规资金安全性), D11 (特许经营或转换摩擦)',
    secondary: 'D5 (极致的开户/支付顺滑度)',
    mappings: '- "数字货币牌照" -> D4 +0.3\n- "一键Checkout" -> D5 +0.3',
    physics: '- IF D4 < 0.9 -> TRIGGER Regulatory_Ban\n- IF D5 < 0.6 -> TRIGGER Cart_Abandonment_Surge',
    probing: '- IF D4.sigma > 0.6 -> ASK "所在国的金融支付牌照或反洗钱 (AML) 审计方案是什么？是否有足够的资本金储备？"',
    modifiers: '- TechDebt λ: 0.3\n- CAC Base: 极高'
  }
];

const outDir = path.join(__dirname, '../src/assets/knowledge/industries');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

industries.forEach((ind) => {
  const content = `# Industry DNA: ${ind.name}
ID: ${ind.id} | Version: 2.0

## [Module 1] Baseline Vector (14D)
系统为该行业设置的默认均值下限（未填写的维度在 0.5 左右游动）。
${Object.entries(ind.baselines).map(([k, v]) => `- ${k}: ${v}`).join('\n')}

## [Module 2] Industry Anchors (行业刻度极值)
在全局刻度的基础上，本行业特有的及格/生存指标定位于：
${ind.anchors}

## [Module 3] Critical Dimensions
- **Primary**: ${ind.primary}
- **Secondary**: ${ind.secondary}

## [Module 4] Semantic Mappings
${ind.mappings}

## [Module 5] Physics Laws
${ind.physics}

## [Module 6] Probing Logic
${ind.probing}

## [Module 7] Macro Modifiers
${ind.modifiers}
`;

  fs.writeFileSync(path.join(outDir, `${ind.id}.md`), content, 'utf8');
});

console.log('Successfully generated 15 Industry DNA MD files with Anchors.');
