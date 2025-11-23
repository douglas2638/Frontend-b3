import { create } from 'zustand'
import { b3Api, type StockData, type AnalysisResult, type PortfolioAnalysis } from './api'

interface AppState {
  // Estado de loading
  loading: boolean
  setLoading: (loading: boolean) => void

  // Dados de ações
  stockData: StockData[] | null
  currentStock: string | null
  fetchStockData: (symbol: string, period?: string) => Promise<void>

  // Análises
  analysis: AnalysisResult | null
  portfolioAnalysis: PortfolioAnalysis | null
  fetchAnalysis: (symbol: string) => Promise<void>
  fetchPortfolioAnalysis: (stocks: string[], weights?: number[]) => Promise<void>

  // Mercado
  marketOverview: any | null
  fetchMarketOverview: () => Promise<void>

  // Erros
  error: string | null
  setError: (error: string | null) => void
}

export const useAppStore = create<AppState>((set, get) => ({
  // Estado inicial
  loading: false,
  stockData: null,
  currentStock: null,
  analysis: null,
  portfolioAnalysis: null,
  marketOverview: null,
  error: null,

  // Setters
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // Actions
  fetchStockData: async (symbol, period = '6mo') => {
    set({ loading: true, error: null })
    try {
      const data = await b3Api.getStockData(symbol, period)
      set({ 
        stockData: data.data,
        currentStock: symbol,
        loading: false 
      })
    } catch (error) {
      set({ 
        error: 'Erro ao buscar dados da ação',
        loading: false 
      })
    }
  },

  fetchAnalysis: async (symbol) => {
    set({ loading: true, error: null })
    try {
      const analysis = await b3Api.quickAnalyze(symbol)
      set({ 
        analysis,
        loading: false 
      })
    } catch (error) {
      set({ 
        error: 'Erro ao realizar análise',
        loading: false 
      })
    }
  },

  fetchPortfolioAnalysis: async (stocks, weights) => {
    set({ loading: true, error: null })
    try {
      const portfolioAnalysis = await b3Api.analyzePortfolio(stocks, weights)
      set({ 
        portfolioAnalysis,
        loading: false 
      })
    } catch (error) {
      set({ 
        error: 'Erro ao analisar carteira',
        loading: false 
      })
    }
  },

  fetchMarketOverview: async () => {
    set({ loading: true, error: null })
    try {
      const marketOverview = await b3Api.getMarketOverview()
      set({ 
        marketOverview,
        loading: false 
      })
    } catch (error) {
      set({ 
        error: 'Erro ao buscar dados do mercado',
        loading: false 
      })
    }
  },
}))