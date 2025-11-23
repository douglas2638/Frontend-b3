import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
})

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error)
    throw error
  }
)

export interface StockData {
  symbol: string
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface StockInfo {
  symbol: string
  company_name?: string
  current_price: number
  open_price: number
  day_high: number
  day_low: number
  volume: number
  data_source: string
}

export interface AnalysisResult {
  symbol: string
  score: number
  trend: string
  statistics: {
    current_price: number
    annual_return: number
    annual_volatility: number
    sharpe_ratio: number
    max_drawdown: number
  }
  recommendations: string[]
}

export interface PortfolioAnalysis {
  portfolio_statistics: {
    expected_annual_return: number
    annual_volatility: number
    sharpe_ratio: number
  }
  individual_analyses: Record<string, AnalysisResult>
  weights: Record<string, number>
  diversification_score: number
}

export class B3ApiService {
  // Stock Data
  async getStockData(symbol: string, period: string = '6mo') {
    const response = await api.get(`/stock/${symbol}`, {
      params: { period, include_indicators: true }
    })
    return response.data
  }

  async getStockInfo(symbol: string) {
    const response = await api.get(`/stock/${symbol}/info`)
    return response.data
  }

  // Analysis
  async analyzeStock(symbol: string, startDate?: string, endDate?: string) {
    const response = await api.post('/analyze', {
      symbol,
      start_date: startDate,
      end_date: endDate
    })
    return response.data
  }

  async quickAnalyze(symbol: string) {
    const response = await api.get(`/analyze/quick/${symbol}`)
    return response.data
  }

  async analyzePortfolio(stocks: string[], weights?: number[], initialInvestment: number = 10000) {
    const params: any = {
      stocks: stocks.join(','),
      initial_investment: initialInvestment
    }
    
    if (weights) {
      params.weights = weights.join(',')
    }

    const response = await api.get('/portfolio/analyze', { params })
    return response.data
  }

  // Market
  async getMarketOverview() {
    const response = await api.get('/market/overview')
    return response.data
  }

  async getAvailableStocks() {
    const response = await api.get('/stocks/list')
    return response.data
  }

  // System
  async getHealth() {
    const response = await api.get('/health/detailed')
    return response.data
  }

  async clearCache() {
    const response = await api.get('/cache/clear')
    return response.data
  }
}

export const b3Api = new B3ApiService()