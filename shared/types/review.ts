export interface IReview {
  user: string
  product: string
  rating: number
  comment?: string
  createdAt: Date
  updatedAt: Date
}
