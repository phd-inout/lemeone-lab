"use client";

import { useEffect, useRef, useCallback, useState } from 'react';
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import { useLemeoneStore } from '@/lib/store';
import { DIM } from '@/lib/engine/types';

// ANSI Colors
const C = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
    magenta: '\x1b[35m',
    gray: '\x1b[90m',
    bold: '\x1b[1m',
}

const HELP_TEXT = `
${C.cyan}${C.bold}LEMEONE_LAB v2.0 CLI${C.reset} ${C.gray}— Gravity Sandbox OS${C.reset}

${C.bold}FEEDING & INITIALIZATION${C.reset}
  ${C.green}scan "<seed>"${C.reset}   - Initialize from text or drop a BP/PRD file.
  ${C.green}upgrade <tier>${C.reset}   - Upgrade license (FREE, PRO, ULTRA, ENTERPRISE).

${C.bold}SIMULATION${C.reset}
  ${C.green}run <weeks>${C.reset}      - Step simulation forward (time evolution).
  ${C.green}reset${C.reset}            - Wipe current simulation state.

${C.bold}VECTOR TUNING${C.reset}
  ${C.green}set <dim> <val>${C.reset}   - Adjust 12D dimensions (perf, depth, interact, stable...).
  ${C.green}feature "<desc>"${C.reset} - Map a natural language feature to vector space.
  ${C.green}burn <amount>${C.reset}    - Set base monthly operating cost.
  ${C.green}fund <amount>${C.reset}    - Inject capital (Series A/B/C).

${C.bold}DIAGNOSTICS${C.reset}
  ${C.green}stat${C.reset}             - Display precise 12D product vector & metrics.
  ${C.green}audit${C.reset}            - Trigger Deep AI Audit & Asset refresh.

Input ${C.green}help${C.reset} / ${C.green}clear${C.reset} / ${C.green}exit${C.reset} to control terminal.
`

export default function TerminalUI() {
    const termRef = useRef<HTMLDivElement>(null)
    const xtermRef = useRef<Terminal | null>(null)
    const fitAddonRef = useRef<FitAddon | null>(null)
    const inputBufRef = useRef('')
    const historyRef = useRef<string[]>([])
    const historyIndexRef = useRef(-1)
    const currentInputRef = useRef('')
    const [isDragging, setIsDragging] = useState(false)

    const { 
        initSimulation, 
        step, 
        updateVector, 
        addFeature, 
        fund, 
        setBurn,
        audit, 
        reset, 
        upgradeTier,
    } = useLemeoneStore()

    const print = useCallback((text: string) => {
        const term = xtermRef.current
        if (!term) return
        text.split('\n').forEach(line => {
            term.write('\r\n' + line)
        })
    }, [])

    const showPrompt = useCallback(() => {
        xtermRef.current?.write('\r\n> ')
    }, [])

    const handleCommand = useCallback(async (input: string) => {
        const term = xtermRef.current
        if (!term) return
        
        const raw = input.trim()
        if (!raw) { showPrompt(); return }

        const parts = raw.match(/[^\s"']+|"([^"]*)"|'([^']*)'/g)?.map(p => 
            p.startsWith('"') || p.startsWith("'") ? p.slice(1, -1) : p
        ) || []
        
        const cmd = parts[0]?.toLowerCase()
        const args = parts.slice(1)

        switch (cmd) {
            case 'help':
                print(HELP_TEXT)
                break
            case 'clear':
                term.clear()
                break
            case 'scan':
                if (!args[0]) {
                    print(`${C.red}[ERR] Missing input. Usage: scan "..." or drop a file.${C.reset}`)
                } else {
                    const isShort = args[0].length < 200
                    print(`${C.cyan}[PARSING] 正在解析商业基因向量...${C.reset}`)
                    await initSimulation(args[0])
                    if (isShort) {
                        print(`\n${C.yellow}[EXPERT_ADVICE] 检测到输入内容较简略(小于200字)。${C.reset}`)
                        print(`${C.gray}建议拖入详细的 PRD 或 BP 文档。在深度模式下，AI 将能够识别更深层的逻辑断裂点。${C.reset}`)
                    }
                }
                break
            case 'upgrade':
                const newTier = args[0]?.toUpperCase() as any
                if (['FREE', 'PRO', 'ULTRA', 'ENTERPRISE'].includes(newTier)) {
                    upgradeTier(newTier)
                } else {
                    print(`${C.red}[ERR] Invalid tier. Available: FREE, PRO, ULTRA, ENTERPRISE${C.reset}`)
                }
                break
            case 'run':
                const weeks = parseInt(args[0] || '1', 10)
                print(`${C.green}[COLLISION] 执行 ${weeks} 周虚拟压力测试...${C.reset}`)
                await step(weeks)
                break
            case 'set':
                const dim = args[0]?.toUpperCase() as keyof typeof DIM
                const val = parseFloat(args[1])
                if (DIM[dim] !== undefined && !isNaN(val)) {
                    updateVector(dim, val)
                } else {
                    print(`${C.red}[ERR] Invalid dimension. Available: PERF, DEPTH, INTERACT, STABLE...${C.reset}`)
                }
                break
            case 'feature':
                if (!args[0]) {
                    print(`${C.red}[ERR] Missing feature description.${C.reset}`)
                } else {
                    await addFeature(args[0])
                }
                break
            case 'fund':
                const amount = parseInt(args[0] || '0', 10)
                if (amount > 0) {
                    fund(amount)
                } else {
                    print(`${C.red}[ERR] Invalid amount.${C.reset}`)
                }
                break
            case 'burn':
                const bAmt = parseInt(args[0] || '0', 10)
                if (!isNaN(bAmt) && bAmt >= 0) {
                    setBurn(bAmt)
                } else {
                    print(`${C.red}[ERR] Invalid burn rate.${C.reset}`)
                }
                break
            case 'audit':
                print(`${C.magenta}[ALIGNMENT] 启动战略一致性复盘...${C.reset}`)
                await audit()
                break
            case 'stat':
                const s = useLemeoneStore.getState().sandboxState
                if (!s) {
                    print(`${C.gray}Simulation not initialized.${C.reset}`)
                } else {
                    print(`\n${C.cyan}╔═ PRODUCT VECTOR (12D) ══════════════════╗${C.reset}`)
                    print(`${C.cyan}║${C.reset}  RESOLUTION: ${C.bold}${s.tier}${C.reset} (${s.agents.length.toLocaleString()} Agents)`)
                    print(`${C.cyan}║${C.reset}  D1-D4 [CORE]: P:${s.productVector[0].toFixed(3)} D:${s.productVector[1].toFixed(3)} I:${s.productVector[2].toFixed(3)} S:${s.productVector[3].toFixed(3)}`)
                    print(`${C.cyan}║${C.reset}  D5-D8 [MKT]:  F:${s.productVector[4].toFixed(3)} U:${s.productVector[5].toFixed(3)} S:${s.productVector[6].toFixed(3)} C:${s.productVector[7].toFixed(3)}`)
                    print(`${C.cyan}║${C.reset}  D9-D12[STR]:  E:${s.productVector[8].toFixed(3)} B:${s.productVector[9].toFixed(3)} G:${s.productVector[10].toFixed(3)} C:${s.productVector[11].toFixed(3)}`)
                    print(`${C.cyan}╚═════════════════════════════════════════╝${C.reset}`)
                    print(`${C.yellow}CASH: ¥${s.cash.toLocaleString()}  BURN: ¥${s.burnRate.toLocaleString()}/mo${C.reset}`)
                }
                break
            case 'reset':
                reset()
                term.clear()
                print(`${C.yellow}Simulation reset. Memory wiped.${C.reset}`)
                break
            case 'exit':
                print(`${C.gray}Connection closed.${C.reset}`)
                break
            default:
                print(`${C.red}Unknown command: ${cmd}${C.reset}`)
        }

        showPrompt()
    }, [initSimulation, step, updateVector, addFeature, fund, setBurn, audit, reset, upgradeTier, showPrompt, print])

    const handleFileDrop = useCallback(async (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        const file = e.dataTransfer.files[0]
        if (!file) return

        const validExts = ['.md', '.txt', '.json']
        if (!validExts.some(ext => file.name.endsWith(ext))) {
            print(`${C.red}[ERR] Unsupported file. Please use .md, .txt or .json${C.reset}`)
            showPrompt()
            return
        }

        print(`${C.cyan}[FEEDING] 成功接收文件: ${file.name}${C.reset}`)
        const text = await file.text()
        print(`${C.cyan}[PARSING] 正在执行深度文档扫描 (Size: ${text.length} chars)...${C.reset}`)
        
        // Prevent recursive quotes in command
        const cleanText = text.replace(/"/g, "'")
        await handleCommand(`scan "${cleanText}"`)
    }, [handleCommand, print, showPrompt])

    // Initialize Terminal
    useEffect(() => {
        if (!termRef.current || xtermRef.current) return

        const term = new Terminal({
            theme: {
                background: '#00000000',
                foreground: '#e2e2e2',
                cursor: '#00f2ff',
                green: '#00ff88',
                cyan: '#00f2ff',
                yellow: '#ffd700',
            },
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 13,
            cursorBlink: true,
        })

        const fitAddon = new FitAddon()
        term.loadAddon(fitAddon)
        term.open(termRef.current)
        setTimeout(() => fitAddon.fit(), 100)
        xtermRef.current = term

        term.writeln(`${C.cyan}${C.bold}LEMEONE_LAB v2.0 - GRAVITY ENGINE INITIALIZED${C.reset}`)
        term.writeln(`${C.gray}Type 'help' to start or drop a PRD/BP file here.${C.reset}`)
        term.write('\r\n> ')

        term.onData(e => {
            const buf = inputBufRef.current
            if (e === '\r') {
                term.write('\r\n')
                const cmd = buf
                inputBufRef.current = ''
                if (cmd.trim()) {
                    const last = historyRef.current[historyRef.current.length - 1]
                    if (cmd.trim() !== last) historyRef.current.push(cmd.trim())
                }
                historyIndexRef.current = -1
                handleCommand(cmd)
            } else if (e === '\x7F') { 
                if (buf.length > 0) {
                    inputBufRef.current = buf.slice(0, -1)
                    term.write('\b \b')
                }
            } else if (e === '\x1b[A') { // Arrow Up
                if (historyRef.current.length > 0) {
                    if (historyIndexRef.current === -1) {
                        currentInputRef.current = buf
                    }
                    if (historyIndexRef.current < historyRef.current.length - 1) {
                        historyIndexRef.current++
                        const histCmd = historyRef.current[historyRef.current.length - 1 - historyIndexRef.current]
                        inputBufRef.current = histCmd
                        term.write('\r> \x1b[K' + histCmd)
                    }
                }
            } else if (e === '\x1b[B') { // Arrow Down
                if (historyIndexRef.current > -1) {
                    historyIndexRef.current--
                    if (historyIndexRef.current === -1) {
                        inputBufRef.current = currentInputRef.current
                    } else {
                        const histCmd = historyRef.current[historyRef.current.length - 1 - historyIndexRef.current]
                        inputBufRef.current = histCmd
                    }
                    term.write('\r> \x1b[K' + inputBufRef.current)
                }
            } else if (e >= ' ') {
                inputBufRef.current += e
                term.write(e)
            }
        })

        const handleResize = () => fitAddon.fit()
        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
            term.dispose()
            xtermRef.current = null
        }
    }, [handleCommand])

    return (
        <div 
            className={`w-full h-full bg-black p-2 transition-all duration-300 ${isDragging ? 'ring-2 ring-cyan-500 bg-gray-900 opacity-80' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleFileDrop}
        >
            <div ref={termRef} className="w-full h-full" />
        </div>
    )
}
