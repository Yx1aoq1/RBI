// 环境
export const NODE_ENV = import.meta.env.MODE || 'production'

export const CONSOLE_ENABLE = false && NODE_ENV !== 'production' // 开启参数打印
